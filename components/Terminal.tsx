"use client";
import React, { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, Send } from "lucide-react";

interface Message { role: "user" | "system"; content: string; }

// Phrases to cycle through
const PLACEHOLDERS = [
  "ask about my projects...",
  "does he know python?",
  "contact information...",
  "experience level...",
];

export default function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Message[]>([
    { role: "system", content: "Welcome to OS/Portfolio v1.0. System Ready." },
  ]);
  const [loading, setLoading] = useState(false);

  // --- Typewriter Logic ---
  const [placeholder, setPlaceholder] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const currentPhrase = PLACEHOLDERS[phraseIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting && placeholder.length < currentPhrase.length) {
        setPlaceholder(currentPhrase.slice(0, placeholder.length + 1));
      } else if (isDeleting && placeholder.length > 0) {
        setPlaceholder(currentPhrase.slice(0, placeholder.length - 1));
      } else if (!isDeleting && placeholder.length === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && placeholder.length === 0) {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, phraseIndex]);

  // --- Chat Logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setHistory((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setHistory((prev) => [...prev, { role: "system", content: data.response }]);
    } catch (error) {
      setHistory((prev) => [...prev, { role: "system", content: "Error: Network Failure." }]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-t border-[#333] font-mono text-sm">
      <div className="flex items-center px-4 py-2 bg-[#2d2d2d] text-[#ccc] border-b border-[#111]">
        <TerminalIcon size={14} className="mr-2" />
        <span>TERMINAL</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 text-[#d4d4d4]">
        {history.map((msg, i) => (
          <div key={i} className={`${msg.role === "system" ? "text-green-400" : "text-blue-400"}`}>
            <span className="opacity-50 mr-2">{msg.role === "user" ? "❯" : "sudo >>"}</span>
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-green-400 animate-pulse">sudo processing...</div>}
      </div>
      <form onSubmit={handleSubmit} className="p-2 bg-[#1e1e1e] flex items-center border-t border-[#333]">
        <span className="text-green-500 mr-2">➜</span>
        <div className="relative flex-1">
            {!input && (
                <span className="absolute inset-0 top-[2px] text-gray-500 pointer-events-none">
                    {placeholder}<span className="animate-pulse border-r-2 border-green-500 ml-1"></span>
                </span>
            )}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-transparent text-[#d4d4d4] focus:outline-none relative z-10"
                autoFocus
            />
        </div>
        <button type="submit" className="text-[#007acc]"><Send size={16} /></button>
      </form>
    </div>
  );
}