"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Meeting } from "@/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { EvaluationResults } from "@/components/evaluation-results"
import { evaluateSummaries } from "@/lib/evaluate-summaries"
import { FileText, MessageSquare, ClipboardList, Sparkles } from "lucide-react"
import { ParticleContainer } from "@/components/particle-container"

interface MeetingComparisonProps {
  meeting: Meeting
}

export function MeetingComparison({ meeting }: MeetingComparisonProps) {
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluationResults, setEvaluationResults] = useState<any | null>(null)

  const handleEvaluate = async () => {
    setIsEvaluating(true)
    try {
      const results = await evaluateSummaries(meeting)
      setEvaluationResults(results)
    } catch (error) {
      console.error("Error evaluating summaries:", error)
    } finally {
      setIsEvaluating(false)
    }
  }

  return (
    <motion.div
      className="space-y-6 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold glow-text">{meeting.title}</h1>
          <p className="text-muted-foreground mt-1">{meeting.date}</p>
        </div>
        <Button
          onClick={handleEvaluate}
          disabled={isEvaluating}
          size="lg"
          className="gradient-accent relative overflow-hidden group"
        >
          {isEvaluating ? (
            <span className="flex items-center">
              <span className="animate-pulse-glow mr-2">Analyzing</span>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
            </span>
          ) : (
            <span className="flex items-center">
              <Sparkles size={18} className="mr-2" />
              Evaluate Summaries
            </span>
          )}
          <span className="absolute bottom-0 left-0 h-1 bg-accent/50 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Button>
      </div>

      <Tabs defaultValue="summaries" className="w-full">
        <TabsList className="w-full justify-start mb-6 bg-muted/30 p-1 rounded-lg">
          <TabsTrigger
            value="summaries"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileText size={16} className="mr-2" />
            Summaries
          </TabsTrigger>
          <TabsTrigger
            value="transcript"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MessageSquare size={16} className="mr-2" />
            Transcript
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <ClipboardList size={16} className="mr-2" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summaries" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="gradient-bg border-border/30 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Summary V1</h3>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Version 1</span>
                </div>
                <div className="prose prose-invert max-w-none">
                  <MarkdownRenderer content={meeting.summaryV1} />
                </div>
              </div>
            </Card>

            <Card className="gradient-bg border-border/30 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Summary V2</h3>
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">Version 2</span>
                </div>
                <div className="prose prose-invert max-w-none">
                  <MarkdownRenderer content={meeting.summaryV2} />
                </div>
              </div>
            </Card>
          </div>

          <AnimatePresence>
            {evaluationResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ParticleContainer>
                  <EvaluationResults results={evaluationResults} />
                </ParticleContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="transcript" className="animate-fade-in">
          <Card className="gradient-bg border-border/30">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Meeting Transcript</h3>
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={meeting.transcript} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="animate-fade-in">
          <Card className="gradient-bg border-border/30">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Meeting Notes</h3>
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={meeting.notes} />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
