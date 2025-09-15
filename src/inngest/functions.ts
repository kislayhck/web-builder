import { z } from "zod";
import { inngest } from "./client";
import { openai, createAgent, createTool, createNetwork, type Tool, type Message,createState } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { PROMPT } from "@/prompt";
import prisma from "@/lib/db";

interface AgentState {
  summary: string;
  files: {[path: string]: string};
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },

  async ({ event,step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("8ngtcyz3faxwin0eaksr");
      await sandbox.setTimeout(15 * 60); // 15 minutes
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run("get-previous-messages", async () => {
        const formattedMessages: Message[] = [];

        const messages = await prisma.message.findMany({
          where: { projectId: event.data.projectId },
          orderBy: { createdAt: 'desc' },
        })

        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,
          });
        }

        return formattedMessages;
    });

    const state = createState<AgentState>(
      {
        summary: "",
        files: {}
      },
      {
        messages: previousMessages
      }
  );

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: openai({ model: "gpt-4.1",
        defaultParameters:{
          temperature: 0.1,
        }
       }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "" , stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command,{
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  }
                });
                return result.stdout;
              } catch (error) {
                console.error(`Command failed: ${error} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`);
                return `Command failed: ${error} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
              }
            });
          }
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update a file in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async ({ files }, { step, network } : Tool.Options<AgentState>) => {
            const newFiles = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }

                return updatedFiles;
              } catch (error) {
                console.error(`Failed to create or update files: ${error}`);
                return { error: `Failed to create or update files: ${error}` };
              }
            });

            if (newFiles && typeof newFiles === "object" && !('error' in newFiles)) {
              network.state.data.files = newFiles;
            }
            
            return newFiles;
          }
        }),
        createTool({
          name: "readFiles",
          description: "Read a file from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }

                return JSON.stringify(contents);
              } catch (error) {
                console.error(`Failed to read files: ${error}`);
              }
            });
          }
        })
      ],

      lifecycle:{
        onResponse: async ({ result, network }) => {

          const lastAssistantTextMessageText = lastAssistantTextMessageContent(result);

          if(lastAssistantTextMessageText && network){
            if(lastAssistantTextMessageText.includes("<task_summary>")){
              // Extract summary content from between the tags
              const summaryMatch = lastAssistantTextMessageText.match(/<task_summary>(.*?)<\/task_summary>/s);
              if(summaryMatch){
                network.state.data.summary = summaryMatch[1].trim();
              }
            }
          } 
          return result;
        }
      }
    });

    const network = createNetwork<AgentState>({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      state: {
        data: {
          summary: "",
          files: {}
        }
      },
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if(summary){
          return null; // Explicitly return null to stop execution
        }
        return codeAgent;
      }
    })


    const result = await network.run(event.data.value, {
      maxIter: 15,
      state: state,
      onNetworkEnd: ({ network }) => {
        console.log("Network ended with state:", network.state.data);
      }
    });

    const isError = !result.state.data.summary || result.state.data.summary.trim() === "";

    const sandboxUrl = await step.run("execute-in-sandbox", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-result" , async () => {

      if(isError){
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "I'm sorry, I was unable to complete your request.",
            role: "ASSISTANT",
            type: "ERROR",
          }
        });
      }

      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: result.state.data.summary,
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: "Fragment",
              files: result.state.data.files,
              summary: result.state.data.summary
            }
          }
        }
      });
    })

    return { 
      url: sandboxUrl ,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary

    };
  },
);   