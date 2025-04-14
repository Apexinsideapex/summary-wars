"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import type { Meeting } from "@/types"
import { cn } from "@/lib/utils"
import { Home, FileText, BarChart2, Settings, Menu, X, ChevronRight } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  meetings: Meeting[]
}

export function Sidebar({ meetings }: SidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)
  const [meetingsExpanded, setMeetingsExpanded] = useState(true)

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-muted md:hidden"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar backdrop for mobile */}
      {expanded && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 z-40 h-full bg-card border-r border-border/30 glow-border",
          expanded ? "w-64" : "w-16",
          "transition-all duration-300 ease-in-out",
          "md:relative md:z-0",
        )}
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 border-b border-border/30 flex items-center justify-between">
          {expanded ? (
            <h1 className="text-xl font-bold glow-text bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Summary<span className="text-accent">AI</span>
            </h1>
          ) : (
            <span className="text-xl font-bold text-accent">AI</span>
          )}
          <button className="p-1 rounded-full hover:bg-muted transition-colors" onClick={() => setExpanded(!expanded)}>
            <ChevronRight
              size={18}
              className={cn("transition-transform duration-300", expanded ? "rotate-180" : "rotate-0")}
            />
          </button>
        </div>

        <nav className="flex-1 overflow-auto p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-muted/50",
                  pathname === "/" ? "bg-primary/10 text-primary" : "text-foreground/80",
                  !expanded && "justify-center",
                )}
                onClick={() => setExpanded(false)}
              >
                <Home size={20} className={pathname === "/" ? "text-primary" : ""} />
                {expanded && <span>Overview</span>}
              </Link>
            </li>

            <li className="pt-4">
              <button
                onClick={() => setMeetingsExpanded(!meetingsExpanded)}
                className={cn(
                  "flex items-center w-full gap-3 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-muted/50 text-foreground/80",
                  !expanded && "justify-center",
                )}
              >
                <FileText size={20} />
                {expanded && (
                  <>
                    <span className="flex-1">Meetings</span>
                    <ChevronRight
                      size={16}
                      className={cn("transition-transform duration-300", meetingsExpanded ? "rotate-90" : "rotate-0")}
                    />
                  </>
                )}
              </button>

              {expanded && meetingsExpanded && (
                <motion.ul
                  className="mt-2 ml-2 space-y-1 border-l border-border/30 pl-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                >
                  {meetings.map((meeting) => (
                    <motion.li
                      key={meeting.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={`/meetings/${meeting.id}`}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                          "hover:bg-muted/50",
                          pathname === `/meetings/${meeting.id}` ? "text-primary bg-primary/5" : "text-foreground/70",
                        )}
                        onClick={() => setExpanded(false)}
                      >
                        <span className="truncate">{meeting.title}</span>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </li>

            <li className="pt-4">
              <Link
                href="#analytics"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-muted/50 text-foreground/80",
                  !expanded && "justify-center",
                )}
              >
                <BarChart2 size={20} />
                {expanded && <span>Analytics</span>}
              </Link>
            </li>

            <li>
              <Link
                href="#settings"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-muted/50 text-foreground/80",
                  !expanded && "justify-center",
                )}
              >
                <Settings size={20} />
                {expanded && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-border/30">
          <div className={cn("flex items-center gap-3 px-3 py-2 rounded-lg", !expanded && "justify-center")}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
              G
            </div>
            {expanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Granola AI</p>
                <p className="text-xs text-muted-foreground truncate">Prompt Engineer</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}
