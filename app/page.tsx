"use client";

import { useState, useEffect } from "react";
import Terminal from "../components/Terminal";
import { FileJson, FileText, FileCode, FolderOpen, User, Briefcase, Code } from "lucide-react";
// Import your real data
import { PORTFOLIO_DATA } from "../lib/mockData";

export default function Home() {
  // 1. Convert your DB data into a format the UI can read (Files)
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string>("bio-summary.md");

  useEffect(() => {
    const newFiles: Record<string, string> = {};
    
    // Transform mockData into "files"
    PORTFOLIO_DATA.forEach((item) => {
      // Create a fake filename based on the ID
      const filename = item.id.includes("json") ? `${item.id}` : `${item.id}.md`;
      newFiles[filename] = item.text;
    });

    setFiles(newFiles);
    // Set default open file
    if (Object.keys(newFiles).length > 0) {
        setActiveFile(Object.keys(newFiles)[0]);
    }
  }, []);

  return (
    <main className="h-screen w-screen bg-[#1e1e1e] text-[#d4d4d4] flex flex-col font-mono overflow-hidden">
      {/* Top Bar */}
      <div className="h-8 bg-[#333] flex items-center px-4 text-xs select-none text-[#ccc]">
        <span className="mr-4 hover:text-white cursor-pointer">File</span>
        <span className="mr-4 hover:text-white cursor-pointer">Edit</span>
        <span className="mr-4 hover:text-white cursor-pointer">View</span>
        <span className="ml-auto text-gray-500">OS/IDE Portfolio v2.0</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Explorer */}
        <aside className="w-64 bg-[#252526] flex flex-col border-r border-[#1e1e1e]">
          <div className="p-2 text-xs font-bold uppercase tracking-wider text-[#bbb] flex justify-between">
            <span>Explorer</span>
            <span className="text-[10px] opacity-50">.git</span>
          </div>
          
          <div className="mt-2">
            {/* Folder Header */}
            <div className="flex items-center px-4 py-1 text-sm text-blue-400 cursor-pointer hover:bg-[#2a2d2e]">
              <FolderOpen size={16} className="mr-2" />
              <span className="font-bold">portfolio-root</span>
            </div>

            {/* Dynamic File List from MockData */}
            <div className="pl-4 mt-1">
              {Object.keys(files).map((fileName) => (
                <div
                  key={fileName}
                  onClick={() => setActiveFile(fileName)}
                  className={`flex items-center px-4 py-1 cursor-pointer text-sm transition-colors ${
                    activeFile === fileName 
                      ? "bg-[#37373d] text-white border-l-2 border-[#007acc]" 
                      : "text-gray-400 hover:bg-[#2a2d2e] hover:text-[#d4d4d4]"
                  }`}
                >
                  {/* Icons based on content type */}
                  {fileName.includes("bio") && <User size={14} className="mr-2 text-yellow-400" />}
                  {fileName.includes("project") && <Briefcase size={14} className="mr-2 text-green-400" />}
                  {fileName.includes("skill") && <Code size={14} className="mr-2 text-blue-400" />}
                  {fileName.includes("contact") && <FileText size={14} className="mr-2 text-red-400" />}
                  
                  {fileName}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative bg-[#1e1e1e]">
            {/* Tabs */}
            <div className="flex bg-[#252526] h-9 border-b border-[#1e1e1e]">
                <div className="px-4 flex items-center bg-[#1e1e1e] border-t-2 border-[#007acc] text-[#d4d4d4] text-sm pr-6 relative group cursor-pointer">
                    <span className="mr-2">{activeFile}</span>
                    <span className="text-xs opacity-0 group-hover:opacity-100 hover:bg-[#333] rounded-full p-1">✕</span>
                </div>
            </div>

            {/* Code Editor View */}
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                <div className="flex min-h-full">
                    {/* Line Numbers */}
                    <div className="flex flex-col text-right pr-4 select-none text-[#6e7681] border-r border-[#333] mr-4 font-mono text-sm leading-6">
                       {Array.from({length: 20}).map((_, i) => (
                           <span key={i} className="hover:text-[#d4d4d4]">{i + 1}</span>
                       ))}
                    </div>
                    
                    {/* File Content */}
                    <div className="flex-1 text-[#ce9178] font-mono text-sm leading-6 whitespace-pre-wrap animate-in fade-in duration-300">
                        {files[activeFile] ? (
                            <>
                                <span className="text-[#569cd6]">const </span>
                                <span className="text-[#4ec9b0]">data </span>
                                <span className="text-[#d4d4d4]">= </span>
                                <span className="text-[#ce9178]">{`"${files[activeFile]}"`}</span>;
                            </>
                        ) : (
                            <span className="text-gray-500">// Select a file to view content...</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Terminal Panel */}
            <div className="h-[35%] border-t border-[#007acc] bg-[#1e1e1e]">
                <Terminal />
            </div>
        </div>
      </div>
      
      {/* Bottom Status Bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-[11px] justify-between select-none">
         <div className="flex gap-3">
            <span className="flex items-center gap-1"><i>⚡</i> master*</span>
            <span>0 errors, 0 warnings</span>
         </div>
         <div className="flex gap-4">
            <span>Ln 10, Col 42</span>
            <span>UTF-8</span>
            <span>TypeScript React</span>
            <span className="hover:bg-[#1f8ad2] px-1 cursor-pointer">Prettier</span>
            <span className="hover:bg-[#1f8ad2] px-1 cursor-pointer">🔔</span>
         </div>
      </div>
    </main>
  );
}