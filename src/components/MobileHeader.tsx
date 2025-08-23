"use client";
import { Menu, Sparkles, User } from "lucide-react";
import { useDecision } from "@/context/DecisionContext";
import Link from "next/link";

export default function MobileHeader() {
  const { isDrawerOpen, setIsDrawerOpen } = useDecision();

  return (
    <div className="sticky top-0 p-2 flex items-center justify-between h-full max-h-[80px] bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow md:hidden w-full ">
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="p-2 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow md:hidden"
      >
        <Menu size={24} />
      </button>

      <div className="flex items-center justify-center p-6 border-b border-slate-700 w-full">
        <Link href="/app" className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ThinkBetter
            </h1>
            <p className="text-sm text-slate-400">AI Decision Helper</p>
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-3 w-10" />
    </div>
  );
}
