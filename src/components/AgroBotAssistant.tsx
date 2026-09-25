"use client";

import React, { useState } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Info, 
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { CompletePlantAnalysis } from "@/lib/types";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  category?: "AI prediction" | "Historical data" | "Live data" | "Verified Agronomic Knowledge";
  referenceTag?: string;
  time: string;
}

interface AgroBotAssistantProps {
  currentAnalysis: CompletePlantAnalysis;
}

const QUICK_PROMPTS = [
  "What disease does this plant have?",
  "Why are my leaves yellow?",
  "When should I water my tomato crop?",
  "What nutrients may be missing?",
  "What are the available tomato prices?",
  "Which nearby markets have recent price data?"
];

export const AgroBotAssistant: React.FC<AgroBotAssistantProps> = ({ currentAnalysis }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Namaste! I am **AgroBot**, your agricultural intelligence partner.\n\nAsk me about disease identification, yellow leaves, smart watering, or mandi market rates. I explicitly categorize all outputs as **AI prediction**, **Historical data**, or **Live data**.",
      category: "Verified Agronomic Knowledge",
      referenceTag: "AgroVision AI System",
      time: "Now"
    }
  ]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          activeAnalysis: currentAnalysis
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.reply,
          category: data.category,
          referenceTag: data.referenceTag,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case "AI prediction":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Historical data":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Live data":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-black font-bold shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:shadow-[0_0_45px_rgba(16,185,129,0.9)] hover:scale-105 transition-all flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-black" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black"></span>
            </span>
          </div>
          <span className="text-sm font-extrabold font-heading hidden sm:inline">Ask AgroBot AI</span>
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] h-[600px] max-h-[85vh] glass-panel rounded-3xl border border-emerald-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden backdrop-blur-2xl">
          {/* Header */}
          <div className="p-4 bg-emerald-950/80 border-b border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-heading flex items-center gap-1.5">
                  <span>AgroBot AI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                </h4>
                <p className="text-[10px] text-emerald-200/70 font-mono">
                  Verified Agtech Knowledge • Non-Prescriptive
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-emerald-900/40 text-emerald-400 hover:text-white hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompt Pill Strip */}
          <div className="px-3 py-2 bg-black/40 border-b border-emerald-500/20 overflow-x-auto flex gap-2 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-[11px] text-emerald-300 border border-emerald-500/30 whitespace-nowrap cursor-pointer transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                {/* Data Category Pill if from Bot */}
                {msg.sender === "bot" && msg.category && (
                  <div className="mb-1 flex items-center gap-1.5">
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${getCategoryColor(msg.category)}`}>
                      Source Type: {msg.category}
                    </span>
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl max-w-[90%] text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-500 text-black font-medium rounded-tr-none shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      : "bg-[#0b1c13] text-emerald-100 border border-emerald-500/30 rounded-tl-none whitespace-pre-line"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.referenceTag && (
                  <span className="text-[10px] text-emerald-400/60 font-mono mt-1 px-1">
                    {msg.referenceTag}
                  </span>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20 w-fit">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>AgroBot analyzing verified datasets...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-emerald-950/80 border-t border-emerald-500/30 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about crops, diseases, water, or mandis..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-[#07150d] border border-emerald-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-emerald-100/40 outline-none focus:border-emerald-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-40 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
