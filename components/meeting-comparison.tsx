"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { EvalData } from "@/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { EvaluationResults } from "@/components/evaluation-results"
import { evaluateSummaries } from "@/lib/evaluate-summaries"
import { FileText, MessageSquare, ClipboardList, Sparkles, Crown } from "lucide-react"
import { ParticleContainer } from "@/components/particle-container"
import { saveEvaluationResult, getEvaluationResult, StoredEvaluationResult } from "@/lib/indexdb"
import { splitTranscript } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface MeetingComparisonProps {
  meeting: EvalData
}

export function MeetingComparison({ meeting }: MeetingComparisonProps) {
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluationResults, setEvaluationResults] = useState<any | null>(null)
  const [evaluationMode, setEvaluationMode] = useState<"4.1" | "o3-mini">("o3-mini")
  const [savedResults, setSavedResults] = useState<Record<"4.1" | "o3-mini", any>>({
    "4.1": null,
    "o3-mini": null
  })

  useEffect(() => {
    // Load saved evaluation results when component mounts
    const loadSavedResults = async () => {
      try {
        const savedResults = await getEvaluationResult(meeting.id) as StoredEvaluationResult[];
        if (savedResults.length > 0) {
          // Store results by model
          const resultsByModel = savedResults.reduce((acc, result) => ({
            ...acc,
            [result.model]: result.results
          }), {} as Record<"4.1" | "o3-mini", any>);
          
          setSavedResults(resultsByModel);
          // Set current evaluation results based on selected mode
          if (resultsByModel[evaluationMode]) {
            setEvaluationResults(resultsByModel[evaluationMode]);
          }
        }
      } catch (error) {
        console.error("Error loading saved evaluation results:", error);
      }
    };
    loadSavedResults();
  }, [meeting.id]);

  // Update displayed results when mode changes
  useEffect(() => {
    setEvaluationResults(savedResults[evaluationMode])
  }, [evaluationMode, savedResults])

  const handleEvaluate = async () => {
    setIsEvaluating(true)
    try {
      const results = await evaluateSummaries(meeting, evaluationMode)
      setEvaluationResults(results)
      // Save results to IndexedDB with model information
      await saveEvaluationResult(meeting.id, results, evaluationMode)
      // Update saved results
      setSavedResults(prev => ({
        ...prev,
        [evaluationMode]: results
      }))
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
          {savedResults["4.1"] && savedResults["o3-mini"] && (
            <p className="text-sm text-muted-foreground mt-2">
              Evaluated with both models
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ToggleGroup
            type="single"
            value={evaluationMode}
            onValueChange={(value) => value && setEvaluationMode(value as "o3-mini" | "4.1")}
            className="bg-muted/30 p-1 rounded-lg"
          >
            <ToggleGroupItem
              value="o3-mini"
              aria-label="o3-mini evaluation"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3 py-1 rounded"
            >
              o3-mini {savedResults["o3-mini"] && "✓"}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="4.1"
              aria-label="4.1 evaluation"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3 py-1 rounded"
            >
              4.1 <span className="text-xs text-muted-foreground align-middle">(exp)</span> {savedResults["4.1"] && "✓"}
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            onClick={handleEvaluate}
            disabled={isEvaluating}
            size="lg"
            variant="default"
            className="bg-primary text-primary-foreground relative overflow-hidden"
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
          </Button>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <Card className={cn(
              "gradient-bg border-border/30 overflow-hidden transition-all duration-500",
              evaluationResults?.overall.winner === "v1" 
                ? "ring-2 ring-primary shadow-lg shadow-primary/20 md:scale-102 z-10" 
                : evaluationResults?.overall.winner === "v2" 
                  ? "opacity-85 md:scale-98 -z-10" 
                  : ""
            )}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Summary V1</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Version 1</span>
                    {evaluationResults?.overall.winner === "v1" && (
                      <Crown size={16} className="text-primary animate-bounce" />
                    )}
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <MarkdownRenderer content={meeting.summary1} />
                </div>
              </div>
            </Card>

            <Card className={cn(
              "gradient-bg border-border/30 overflow-hidden transition-all duration-500",
              evaluationResults?.overall.winner === "v2" 
                ? "ring-2 ring-secondary shadow-lg shadow-secondary/20 md:scale-102 z-10" 
                : evaluationResults?.overall.winner === "v1" 
                  ? "opacity-85 md:scale-98 -z-10" 
                  : ""
            )}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Summary V2</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">Version 2</span>
                    {evaluationResults?.overall.winner === "v2" && (
                      <Crown size={16} className="text-secondary animate-bounce" />
                    )}
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <MarkdownRenderer content={meeting.summary2} />
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
              <div className="space-y-4">
                {splitTranscript(meeting.transcript).map((segment, index) => {
                  if (segment.speaker === 'Me' || segment.speaker === 'Them') {
                    const message = segment.text
                    return (
                      <div 
                        key={index} 
                        className={cn(
                          "flex gap-4 p-4 rounded-lg",
                          segment.speaker === 'Me' 
                            ? "bg-primary/10 border border-primary/20" 
                            : "bg-secondary/10 border border-secondary/20"
                        )}
                      >
                        <div className={cn(
                          "font-medium text-sm px-2 py-1 rounded-md h-fit",
                          segment.speaker === 'Me' 
                            ? "bg-primary/20 text-primary" 
                            : "bg-secondary/20 text-secondary"
                        )}>
                          {segment.speaker}
                        </div>
                        <div className="flex-1">{message}</div>
                      </div>
                    )
                  }
                  return segment.text ? <p key={index} className="text-muted-foreground text-sm">{segment.text}</p> : null
                })}
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
