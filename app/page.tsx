"use client"
import { Sidebar } from "@/components/sidebar"
import { meetings } from "@/data/meetings"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar meetings={meetings} />
      <main className="flex-1 overflow-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold glow-text">Summary Evaluator</h1>
            <p className="text-muted-foreground mt-2">
              Compare and evaluate meeting summaries to determine which version is superior
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting, index) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <a href={`/meetings/${meeting.id}`} className="block h-full">
                  <div className="h-full gradient-bg rounded-xl p-6 border border-border/30 card-elevation hover:border-primary/30 transition-colors">
                    <h2 className="text-xl font-semibold mb-2">{meeting.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4">{meeting.date}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="inline-block w-2 h-2 rounded-full bg-accent mr-2"></span>
                      Ready for evaluation
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
