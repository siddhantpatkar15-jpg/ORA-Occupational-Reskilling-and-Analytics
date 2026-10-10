"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  MessageSquare, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  BrainCircuit, 
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { Badge, Button, Spinner } from "@/components/ui";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  sourceType?: "deterministic_rule" | "guidance" | "data_query";
  timestamp: string;
}

const PRELOADED_PROMPTS = [
  "What skills am I missing for Data Analyst?",
  "Why was SQL prioritized in my roadmap?",
  "Which training activity should I complete next?",
  "How is evidence quality assessed?",
  "Which competencies need more evidence?"
];

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-welcome",
      sender: "assistant",
      text: "Hello! I am your ORA Explainable Skills Assistant. I can help explain your skill-gap reports, why certain courses are prioritized, and guide your occupational reskilling roadmap.",
      sourceType: "guidance",
      timestamp: "Just now"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const generateAnswer = async (query: string): Promise<{ text: string; sourceType: "deterministic_rule" | "guidance" | "data_query" }> => {
    const q = query.toLowerCase();

    if (q.includes("missing") || q.includes("gap") || q.includes("data analyst")) {
      return {
        text: "Based on your assessed profile against the Data Analyst occupation requirements:\n\n• **SQL**: Required Level 4 (Advanced), Assessed Level 2 (Beginner) → **Gap: -2 Levels** (Critical Importance)\n• **Python**: Required Level 3, Assessed Level 1 → **Gap: -2 Levels** (Important)\n• **Statistics**: Required Level 4, Assessed Level 1 → **Gap: -3 Levels** (Critical)\n\n**Total missing:** 3 competencies require development. Spreadsheet Analysis currently meets the benchmark (Level 3/3).",
        sourceType: "deterministic_rule"
      };
    }

    if (q.includes("prioritize") || q.includes("sql")) {
      return {
        text: "SQL was prioritized as Step 1 on your roadmap because:\n1. **Occupational Importance**: Tagged as 'Critical' (3.0x multiplier).\n2. **Prerequisite Foundation**: SQL is required prior to advanced database analytics.\n3. **Gap Feasibility**: Moving from Beginner (Level 2) to Advanced (Level 4) yields the highest immediate readiness gain (+18% overall score).",
        sourceType: "deterministic_rule"
      };
    }

    if (q.includes("next") || q.includes("activity") || q.includes("training")) {
      return {
        text: "Your recommended next learning activity is:\n\n**Course: 'SQL Fundamentals & Relational Querying'** (20 estimated hours)\n• Trainer: Priya Patel\n• Modules: 4 lessons including JOIN operations & data aggregation\n• Assessment: 10-question standardized knowledge test upon completion.",
        sourceType: "data_query"
      };
    }

    if (q.includes("evidence") || q.includes("quality")) {
      return {
        text: "ORA evaluates competencies through a 3-tier evidence hierarchy:\n\n1. **Trainer Verified (High Confidence)**: Evaluated directly from submitted capstone projects or practical demonstrations.\n2. **Knowledge Assessment (Medium Confidence)**: Validated through standardized, timed multiple-choice assessments.\n3. **Self-Reported (Low Confidence)**: Entered during onboarding. *Notice: Self-reported skills are never treated as verified expertise.*",
        sourceType: "guidance"
      };
    }

    return {
      text: `Based on your current learning profile, you are actively working towards the **Data Analyst** occupational standard. Your current overall readiness is **68%**. You have completed 1 of 5 milestone assessments and are enrolled in 1 training course.`,
      sourceType: "data_query"
    };
  };

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: "u-" + Date.now(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Simulate real AI / deterministic engine processing
      const answer = await generateAnswer(userText);
      const assistantMsg: Message = {
        id: "a-" + Date.now(),
        sender: "assistant",
        text: answer.text,
        sourceType: answer.sourceType,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button in bottom-right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white rounded-full p-3.5 shadow-2xl flex items-center gap-2.5 border-2 border-teal-500 transition-transform hover:scale-105 cursor-pointer group"
          title="Ask ORA AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-teal-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping" />
          </div>
          <span className="text-xs font-bold pr-1">Ask ORA Assistant</span>
        </button>
      )}

      {/* Slide-in Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[540px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  ORA Skills Assistant
                  <Badge variant="outline" className="text-[9px] text-teal-400 border-teal-500/40 py-0">
                    Explainable AI
                  </Badge>
                </h3>
                <p className="text-[11px] text-slate-400">Deterministic gap analysis &amp; career guidance</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div 
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user" 
                      ? "bg-teal-600 text-white rounded-br-none shadow-sm" 
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  {m.text}
                </div>

                <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-slate-400">
                  <span>{m.timestamp}</span>
                  {m.sourceType && (
                    <>
                      <span>•</span>
                      <span className="capitalize text-teal-700 font-medium">
                        {m.sourceType.replace("_", " ")}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl rounded-bl-none w-fit text-slate-500">
                <Spinner className="w-4 h-4 text-teal-600" />
                <span className="text-[11px]">Evaluating competency framework...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {PRELOADED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="shrink-0 text-[11px] bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 px-2.5 py-1 rounded-full transition-colors border border-slate-200 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about skill gaps, courses, or reasons..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
