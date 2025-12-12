"use client";
import { useState } from "react";
import Terminal from "../components/Terminal";
import { FileJson, FileText, FileCode, FolderOpen } from "lucide-react";

const FILES = {
  "bio.md": "I am a Senior Full-Stack Developer...",
  "projects.json": JSON.stringify([{ name: "OS Portfolio", stack: "Next.js" }], null, 2),
  "contact.ts": "export const email = 'contact@example.com';",
};

export default function Home() {
  const [activeFile, setActiveFile] = useState<keyof typeof FILES>("bio.md");

  return (
    <main className="h-screen w-screen bg-[#1e1e1e] text-[#d4d4d4] flex flex-col font-mono overflow-hidden">
      {/* Top Bar */}
      <div className="h-8 bg-[#333] flex items-center px-4 text-xs select-none text-[#ccc]">
        <span className="mr-4">File</span>
        <span className="mr-4">Edit</span>
        <span className="ml-auto">OS/IDE Portfolio</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#252526] flex flex-col border-r border-[#1e1e1e]">
          <div className="p-2 text-xs font-bold uppercase tracking-wider text-[#bbb]">Explorer</div>
          <div className="mt-2">
            <div className="flex items-center px-4 py-1 text-sm text-blue-400">
              <FolderOpen size={16} className="mr-2" />
              <span>portfolio</span>
            </div>
            <div className="pl-4 mt-1">
              {Object.keys(FILES).map((file) => (
                <div key={file} onClick={() => setActiveFile(file as keyof typeof FILES)}
                  className={`flex items-center px-4 py-1 cursor-pointer text-sm ${activeFile === file ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"}`}>
                  {file.endsWith(".ts") && <FileCode size={14} className="mr-2 text-blue-400" />}
                  {file.endsWith(".json") && <FileJson size={14} className="mr-2 text-yellow-400" />}
                  {file.endsWith(".md") && <FileText size={14} className="mr-2 text-gray-400" />}
                  {file}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col relative">
            <div className="absolute top-0 left-0 right-0 h-9 bg-[#1e1e1e] flex border-b border-[#252526]">
                <div className="px-4 flex items-center bg-[#1e1e1e] border-t-2 border-[#007acc] text-[#d4d4d4] text-sm">
                    {activeFile}
                </div>
            </div>
            <div className="flex-1 overflow-auto bg-[#1e1e1e] p-8 mt-8">
                <div className="flex">
                    <div className="flex flex-col text-right pr-4 select-none text-[#858585] border-r border-[#333]">
                       {Array.from({length: 10}).map((_, i) => <span key={i}>{i + 1}</span>)}
                    </div>
                    <div className="pl-4 text-[#ce9178] whitespace-pre-wrap font-mono text-sm">
                        {FILES[activeFile]}
                    </div>
                </div>
            </div>
            {/* Terminal */}
            <div className="h-[35%] border-t border-[#007acc]">
                <Terminal />
            </div>
        </div>
      </div>
    </main>
  );
}