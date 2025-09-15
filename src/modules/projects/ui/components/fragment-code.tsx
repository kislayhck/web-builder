import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, FileIcon, FolderIcon, CopyIcon, CheckIcon } from "lucide-react";
import { Fragment } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from "@/components/ui/button";

interface Props {
    data: Fragment;
}

interface FileTreeItem {
    name: string;
    path: string;
    type: 'file' | 'folder';
    content?: string;
    children?: FileTreeItem[];
}

interface FileTreeNodeProps {
    item: FileTreeItem;
    level: number;
    selectedFile: string | null;
    onFileSelect: (path: string, content: string) => void;
}

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'tsx':
            return <FileIcon className="size-4 text-[#1dd3fb]" />; // React TypeScript
        case 'jsx':
            return <FileIcon className="size-4 text-[#61dafb]" />; // React
        case 'ts':
            return <FileIcon className="size-4 text-[#3178c6]" />; // TypeScript
        case 'js':
            return <FileIcon className="size-4 text-[#f7df1e]" />; // JavaScript
        case 'css':
            return <FileIcon className="size-4 text-[#1572b6]" />; // CSS
        case 'scss':
        case 'sass':
            return <FileIcon className="size-4 text-[#cf649a]" />; // Sass
        case 'html':
            return <FileIcon className="size-4 text-[#e34c26]" />; // HTML
        case 'json':
            return <FileIcon className="size-4 text-[#cbcb41]" />; // JSON
        case 'md':
            return <FileIcon className="size-4 text-[#083fa1]" />; // Markdown
        case 'xml':
            return <FileIcon className="size-4 text-[#005a9c]" />;
        case 'yaml':
        case 'yml':
            return <FileIcon className="size-4 text-[#cb171e]" />;
        case 'py':
            return <FileIcon className="size-4 text-[#3776ab]" />; // Python
        case 'java':
            return <FileIcon className="size-4 text-[#f89820]" />; // Java
        case 'php':
            return <FileIcon className="size-4 text-[#777bb4]" />; // PHP
        case 'go':
            return <FileIcon className="size-4 text-[#00add8]" />; // Go
        case 'rs':
            return <FileIcon className="size-4 text-[#ce422b]" />; // Rust
        case 'sql':
            return <FileIcon className="size-4 text-[#336791]" />; // SQL
        default:
            return <FileIcon className="size-4 text-[#cccccc]" />; // Default
    }
};

const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'tsx':
            return 'tsx';
        case 'jsx':
            return 'jsx';
        case 'ts':
            return 'typescript';
        case 'js':
            return 'javascript';
        case 'css':
            return 'css';
        case 'scss':
        case 'sass':
            return 'scss';
        case 'html':
            return 'html';
        case 'json':
            return 'json';
        case 'md':
            return 'markdown';
        case 'xml':
            return 'xml';
        case 'yaml':
        case 'yml':
            return 'yaml';
        case 'sql':
            return 'sql';
        case 'sh':
            return 'bash';
        case 'py':
            return 'python';
        case 'php':
            return 'php';
        case 'rb':
            return 'ruby';
        case 'go':
            return 'go';
        case 'rs':
            return 'rust';
        case 'java':
            return 'java';
        case 'c':
            return 'c';
        case 'cpp':
        case 'cxx':
            return 'cpp';
        case 'cs':
            return 'csharp';
        case 'swift':
            return 'swift';
        case 'kt':
            return 'kotlin';
        case 'dart':
            return 'dart';
        default:
            return 'text';
    }
};

const FileTreeNode = ({ item, level, selectedFile, onFileSelect }: FileTreeNodeProps) => {
    const [isExpanded, setIsExpanded] = useState(level === 0 || level === 1);

    const handleClick = () => {
        if (item.type === 'folder') {
            setIsExpanded(!isExpanded);
        } else if (item.content) {
            onFileSelect(item.path, item.content);
        }
    };

    return (
        <div>
            <div
                className={cn(
                    "flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-[#2a2d2e] text-sm rounded-sm transition-colors",
                    selectedFile === item.path && "bg-[#094771] text-white",
                    !selectedFile || selectedFile !== item.path ? "text-[#cccccc]" : ""
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={handleClick}
            >
                {item.type === 'folder' ? (
                    <>
                        {isExpanded ? (
                            <ChevronDownIcon className="size-3 text-[#cccccc]" />
                        ) : (
                            <ChevronRightIcon className="size-3 text-[#cccccc]" />
                        )}
                        <FolderIcon className="size-4 text-[#dcb67a]" />
                    </>
                ) : (
                    <>
                        <div className="w-3" />
                        {getFileIcon(item.name)}
                    </>
                )}
                <span className="text-inherit font-normal">{item.name}</span>
            </div>
            {item.type === 'folder' && isExpanded && item.children && (
                <div>
                    {item.children.map((child, index) => (
                        <FileTreeNode
                            key={`${child.path}-${index}`}
                            item={child}
                            level={level + 1}
                            selectedFile={selectedFile}
                            onFileSelect={onFileSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const buildFileTree = (files: Record<string, string>): FileTreeItem[] => {
    const tree: FileTreeItem[] = [];
    const folderMap = new Map<string, FileTreeItem>();

    // Sort files to ensure consistent ordering
    const sortedFiles = Object.entries(files).sort(([a], [b]) => a.localeCompare(b));

    for (const [filePath, content] of sortedFiles) {
        const parts = filePath.split('/');
        let currentTree = tree;
        let currentPath = '';

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            currentPath += (i === 0 ? '' : '/') + part;

            if (i === parts.length - 1) {
                // This is a file
                currentTree.push({
                    name: part,
                    path: filePath,
                    type: 'file',
                    content: content,
                });
            } else {
                // This is a folder
                let folder = currentTree.find(item => item.name === part && item.type === 'folder');
                if (!folder) {
                    folder = {
                        name: part,
                        path: currentPath,
                        type: 'folder',
                        children: [],
                    };
                    currentTree.push(folder);
                    folderMap.set(currentPath, folder);
                }
                currentTree = folder.children!;
            }
        }
    }

    return tree;
};

export function FragmentCode({ data }: Props) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [selectedContent, setSelectedContent] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const [useSyntaxHighlighting, setUseSyntaxHighlighting] = useState(true);

    // Parse the fragment files data
    let files: Record<string, string> = {};
    try {
        if (data.files) {
            if (typeof data.files === 'string') {
                files = JSON.parse(data.files);
            } else {
                files = data.files as Record<string, string>;
            }
        }
    } catch (error) {
        console.error('Error parsing fragment files:', error);
        files = {};
    }

    const fileTree = buildFileTree(files);

    const handleFileSelect = (path: string, content: string) => {
        setSelectedFile(path);
        setSelectedContent(content);
        setCopied(false); // Reset copy status when switching files
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(selectedContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    // Select the first file by default if none selected
    if (!selectedFile && Object.keys(files).length > 0) {
        const firstFilePath = Object.keys(files)[0];
        setSelectedFile(firstFilePath);
        setSelectedContent(files[firstFilePath]);
    }

    if (Object.keys(files).length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-[#cccccc] bg-[#1e1e1e]">
                <div className="text-center">
                    <FileIcon className="size-12 mx-auto mb-2 text-[#cccccc]/50" />
                    <p className="text-sm">No code files available for this fragment</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex bg-[#1e1e1e]">
            {/* File Tree */}
            <div className="w-64 border-r border-[#2d2d30] bg-[#252526] flex flex-col flex-shrink-0">
                <div className="p-3 border-b border-[#2d2d30] bg-[#2d2d30]">
                    <h4 className="text-sm font-medium text-white uppercase tracking-wide">Explorer</h4>
                </div>
                <div className="flex-1 overflow-y-auto py-1">
                    {fileTree.map((item, index) => (
                        <FileTreeNode
                            key={`${item.path}-${index}`}
                            item={item}
                            level={0}
                            selectedFile={selectedFile}
                            onFileSelect={handleFileSelect}
                        />
                    ))}
                </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
                {selectedFile ? (
                    <>
                        {/* File Tab */}
                        <div className="border-b border-[#2d2d30] bg-[#2d2d30] px-4 py-2 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-2">
                                {getFileIcon(selectedFile)}
                                <span className="text-sm text-white font-medium">{selectedFile.split('/').pop()}</span>
                                <span className="text-xs text-[#cccccc]/70">({selectedFile})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setUseSyntaxHighlighting(!useSyntaxHighlighting)}
                                    className="h-7 px-2 text-[#cccccc] hover:text-white hover:bg-[#094771]"
                                >
                                    {useSyntaxHighlighting ? 'Simple' : 'Syntax'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="h-7 px-2 text-[#cccccc] hover:text-white hover:bg-[#094771]"
                                >
                                    {copied ? (
                                        <>
                                            <CheckIcon className="size-3 mr-1" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <CopyIcon className="size-3 mr-1" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                        
                        {/* Code Content */}
                        {useSyntaxHighlighting ? (
                            // Syntax Highlighted Version
                            <div className="flex-1 relative" style={{ height: 0 }}>
                                <div className="absolute inset-0 overflow-auto bg-[#1e1e1e]">
                                    <SyntaxHighlighter
                                        language={getLanguageFromFileName(selectedFile)}
                                        style={vscDarkPlus}
                                        customStyle={{
                                            margin: 0,
                                            padding: '16px',
                                            background: 'transparent',
                                            fontSize: '14px',
                                            lineHeight: '1.5',
                                            height: 'auto',
                                            minHeight: '100%'
                                        }}
                                        showLineNumbers={true}
                                        lineNumberStyle={{
                                            color: '#858585',
                                            fontSize: '12px',
                                            marginRight: '16px',
                                            userSelect: 'none',
                                            minWidth: '40px'
                                        }}
                                        wrapLines={false}
                                        wrapLongLines={false}
                                        codeTagProps={{
                                            style: {
                                                fontSize: '14px',
                                                fontFamily: 'Consolas, "Courier New", monospace'
                                            }
                                        }}
                                    >
                                        {selectedContent}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        ) : (
                            // Simple Scrollable Version
                            <div className="flex-1 bg-[#1e1e1e] overflow-auto">
                                <div className="flex min-h-full">
                                    {/* Line Numbers */}
                                    <div className="bg-[#1e1e1e] border-r border-[#2d2d30] text-[#858585] text-xs text-right pr-3 pl-4 py-4 select-none font-mono flex-shrink-0 sticky left-0">
                                        {selectedContent.split('\n').map((_, index) => (
                                            <div key={index} style={{ lineHeight: '24px', height: '24px' }}>
                                                {index + 1}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Code Content */}
                                    <div className="flex-1 min-w-0">
                                        <pre className="p-4 m-0 text-[#d4d4d4] font-mono text-sm overflow-x-auto" style={{ 
                                            lineHeight: '24px',
                                            background: 'transparent',
                                            whiteSpace: 'pre',
                                            wordWrap: 'normal'
                                        }}>
                                            <code className="text-[#d4d4d4]">
                                                {selectedContent}
                                            </code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-[#cccccc] bg-[#1e1e1e]">
                        <div className="text-center">
                            <FileIcon className="size-12 mx-auto mb-2 text-[#cccccc]/50" />
                            <p className="text-sm">Select a file to view its content</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}