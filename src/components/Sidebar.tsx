"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDecision } from "@/context/DecisionContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  History,
  Brain,
  Menu,
  X,
  Lightbulb,
  TrendingUp,
  Settings,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function Sidebar() {
  const { isDrawerOpen, setIsDrawerOpen } = useDecision();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { currentDecision, decisions } = useDecision();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsDrawerOpen(true);
      } else {
        setIsDrawerOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const navigation = [
    {
      name: "Decision Maker",
      href: "/app",
      icon: Home,
      current: pathname === "/app",
    },
    {
      name: "History",
      href: "/app/history",
      icon: History,
      current: pathname === "/app/history",
      badge: decisions.length > 0 ? decisions.length : undefined,
    },
    {
      name: "AI Insights",
      href: "/app/ai-insights",
      icon: Brain,
      current: pathname === "/app/ai-insights",
      badge: "New",
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: TrendingUp,
      current: pathname === "/analytics",
    },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isDrawerOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={isDrawerOpen ? "open" : "closed"}
        className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-50 shadow-2xl ${
          isMobile ? "" : "md:relative md:translate-x-0"
        }`}
        style={{
          display: isMobile && !isDrawerOpen ? "none" : "block"
        }}
      >
        {/* Toggle button */}

        <div className="flex flex-col h-full">
          {/* Header */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="z-50 px-6 pt-6 rounded-lg hover:shadow-xl transition-shadow md:hidden"
          >
            <X size={24} />
          </button>

          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ThinkBetter
                </h1>
                <p className="text-sm text-slate-400">AI Decision Helper</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                    item.current
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                  onClick={() => isMobile && setIsDrawerOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        typeof item.badge === "number"
                          ? "bg-blue-500 text-white"
                          : "bg-green-500 text-white animate-pulse"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Current Decision Status */}
          {currentDecision.title && (
            <div className="p-4 border-t border-slate-700">
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb size={16} className="text-yellow-400" />
                  <span className="text-sm font-medium">Current Decision</span>
                </div>
                <p className="text-sm text-slate-300 truncate">
                  {currentDecision.title}
                </p>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>{currentDecision.options.length} options</span>
                  {currentDecision.selectedOptionId && (
                    <span className="text-green-400">✓ Decided</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 space-y-2">
            <Link
              href="/settings"
              className="flex items-center space-x-3 p-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
            <Link
              href="/help"
              className="flex items-center space-x-3 p-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <HelpCircle size={18} />
              <span>Help</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}
