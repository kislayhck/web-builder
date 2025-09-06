import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  createAI: baseProcedure
    .input(
      z.object({
        prompt: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.prompt}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;