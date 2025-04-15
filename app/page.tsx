"use client"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { meetings } from "@/data/meetings"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { getAllEvaluationResults, StoredEvaluationResult, clearAllEvaluationResults } from "@/lib/indexdb"
import { CheckCircle2, HelpCircle, Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { evaluateSummaries } from "@/lib/evaluate-summaries"
import { saveEvaluationResult } from "@/lib/indexdb"
import { Progress } from "@/components/ui/progress"
import { EvaluationResults } from "@/components/evaluation-results"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

export default function Home() {
  const [evaluationResults, setEvaluationResults] = useState<Record<number, Partial<Record<"4.1" | "o3-mini", StoredEvaluationResult>>>>({})
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [remainingEvals, setRemainingEvals] = useState(0)
  const [aggregateResults, setAggregateResults] = useState<any | null>(null)
  const [evaluationMode, setEvaluationMode] = useState<"4.1" | "o3-mini">("4.1")

  useEffect(() => {
    loadAllResults()
  }, [])

  useEffect(() => {
    // Update displayed results when mode changes
    if (Object.keys(evaluationResults).length > 0) {
      calculateAggregateResults(evaluationResults, evaluationMode)
    }
  }, [evaluationMode, evaluationResults])

  const loadAllResults = async () => {
    try {
      const results = await getAllEvaluationResults()
      const resultsMap = results.reduce((acc, result) => {
        if (!acc[result.meetingId]) {
          acc[result.meetingId] = {}
        }
        acc[result.meetingId][result.model] = result
        return acc
      }, {} as Record<number, Partial<Record<"4.1" | "o3-mini", StoredEvaluationResult>>>)
      
      setEvaluationResults(resultsMap)
      updateRemainingEvals(resultsMap, evaluationMode)
      if (Object.keys(resultsMap).length > 0) {
        calculateAggregateResults(resultsMap, evaluationMode)
      }
    } catch (error) {
      console.error("Error loading evaluation results:", error)
    }
  }

  const updateRemainingEvals = (
    resultsMap: Record<number, Partial<Record<"4.1" | "o3-mini", StoredEvaluationResult>>>, 
    mode: "4.1" | "o3-mini"
  ) => {
    const remaining = meetings.filter(m => !resultsMap[m.id] || !resultsMap[m.id][mode]).length
    setRemainingEvals(remaining)
  }

  const calculateAggregateResults = (
    resultsMap: Record<number, Partial<Record<"4.1" | "o3-mini", StoredEvaluationResult>>>, 
    mode: "4.1" | "o3-mini"
  ) => {
    const filteredResults = Object.values(resultsMap)
      .map(modelResults => modelResults[mode])
      .filter((r): r is StoredEvaluationResult => r !== undefined);
      
    const allResults = filteredResults.map(r => r.results);
    if (allResults.length === 0) {
      setAggregateResults(null);
      return;
    }

    const aggregate = {
      truthfulness: { v1Score: 0, v2Score: 0, explanation: "" },
      clarity: { v1Score: 0, v2Score: 0, explanation: "" },
      conciseness: { v1Score: 0, v2Score: 0, explanation: "" },
      relevance: { v1Score: 0, v2Score: 0, explanation: "" },
      completeness: { v1Score: 0, v2Score: 0, explanation: "" },
      notes: { v1Score: 0, v2Score: 0, explanation: "" },
      overall: { winner: "", explanation: "" }
    }

    // Calculate averages
    allResults.forEach(result => {
      aggregate.truthfulness.v1Score += result.truthfulness.v1Score
      aggregate.truthfulness.v2Score += result.truthfulness.v2Score
      aggregate.clarity.v1Score += result.clarity.v1Score
      aggregate.clarity.v2Score += result.clarity.v2Score
      aggregate.conciseness.v1Score += result.conciseness.v1Score
      aggregate.conciseness.v2Score += result.conciseness.v2Score
      aggregate.relevance.v1Score += result.relevance.v1Score
      aggregate.relevance.v2Score += result.relevance.v2Score
      aggregate.completeness.v1Score += result.completeness.v1Score
      aggregate.completeness.v2Score += result.completeness.v2Score
      aggregate.notes.v1Score += result.notes.v1Score
      aggregate.notes.v2Score += result.notes.v2Score
    })

    const count = allResults.length
    aggregate.truthfulness.v1Score = +(aggregate.truthfulness.v1Score / count).toFixed(1)
    aggregate.truthfulness.v2Score = +(aggregate.truthfulness.v2Score / count).toFixed(1)
    aggregate.clarity.v1Score = +(aggregate.clarity.v1Score / count).toFixed(1)
    aggregate.clarity.v2Score = +(aggregate.clarity.v2Score / count).toFixed(1)
    aggregate.conciseness.v1Score = +(aggregate.conciseness.v1Score / count).toFixed(1)
    aggregate.conciseness.v2Score = +(aggregate.conciseness.v2Score / count).toFixed(1)
    aggregate.relevance.v1Score = +(aggregate.relevance.v1Score / count).toFixed(1)
    aggregate.relevance.v2Score = +(aggregate.relevance.v2Score / count).toFixed(1)
    aggregate.completeness.v1Score = +(aggregate.completeness.v1Score / count).toFixed(1)
    aggregate.completeness.v2Score = +(aggregate.completeness.v2Score / count).toFixed(1)
    aggregate.notes.v1Score = +(aggregate.notes.v1Score / count).toFixed(1)
    aggregate.notes.v2Score = +(aggregate.notes.v2Score / count).toFixed(1)

    // Calculate overall winner
    const v1Total = aggregate.truthfulness.v1Score + aggregate.clarity.v1Score + 
                   aggregate.conciseness.v1Score + aggregate.relevance.v1Score + 
                   aggregate.completeness.v1Score + aggregate.notes.v1Score
    const v2Total = aggregate.truthfulness.v2Score + aggregate.clarity.v2Score + 
                   aggregate.conciseness.v2Score + aggregate.relevance.v2Score + 
                   aggregate.completeness.v2Score + aggregate.notes.v2Score

    aggregate.overall.winner = v1Total > v2Total ? "v1" : v2Total > v1Total ? "v2" : "tie"
    aggregate.overall.explanation = `Based on the average scores across ${count} meetings, ${
      aggregate.overall.winner === "v1" 
        ? "Summary V1 performs better overall" 
        : aggregate.overall.winner === "v2" 
          ? "Summary V2 performs better overall" 
          : "both summaries perform equally well"
    }.`

    setAggregateResults(aggregate)
  }

  const handleEvaluateAll = async () => {
    setIsEvaluating(true)
    const unevaluatedMeetings = meetings.filter(m => 
      !evaluationResults[m.id] || 
      !evaluationResults[m.id][evaluationMode]
    )
    const total = unevaluatedMeetings.length

    if (total === 0) {
      setIsEvaluating(false)
      return
    }

    const newResults = { ...evaluationResults }
    let completed = 0

    try {
      await Promise.all(unevaluatedMeetings.map(async (meeting) => {
        try {
          const results = await evaluateSummaries(meeting, evaluationMode)
          await saveEvaluationResult(meeting.id, results, evaluationMode)
          
          if (!newResults[meeting.id]) {
            newResults[meeting.id] = {}
          }
          
          newResults[meeting.id][evaluationMode] = {
            meetingId: meeting.id,
            results,
            timestamp: Date.now(),
            model: evaluationMode
          }
          
          completed++
          setProgress((completed / total) * 100)
        } catch (error) {
          console.error(`Error evaluating meeting ${meeting.id}:`, error)
        }
      }))

      setEvaluationResults(newResults)
      calculateAggregateResults(newResults, evaluationMode)
      setRemainingEvals(0)
    } catch (error) {
      console.error('Error in batch evaluation:', error)
    } finally {
      setIsEvaluating(false)
      setProgress(0)
    }
  }

  const handleClearDatabase = async () => {
    try {
      await clearAllEvaluationResults()
      setEvaluationResults({})
      setAggregateResults(null)
      setRemainingEvals(meetings.length)
    } catch (error) {
      console.error("Error clearing database:", error)
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar meetings={meetings} />
      <main className="flex-1 overflow-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold glow-text">Summary Evaluator</h1>
            <p className="text-muted-foreground mt-2">
              Compare and evaluate meeting summaries to determine which version is superior
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <a href={`/meetings/${meeting.id}`} className="block h-full">
                  <div className="h-full gradient-bg rounded-xl p-6 border border-border/30 card-elevation hover:border-primary/30 transition-colors">
                    <h2 className="text-xl font-semibold mb-4">{meeting.title}</h2>
                    
                    {evaluationResults[meeting.id]?.[evaluationMode] ? (
                      <div className="space-y-2">
                        <Badge
                          variant={evaluationResults[meeting.id]![evaluationMode]!.results.overall.winner === "tie" ? "outline" : "default"}
                          className={`
                            px-3 py-1 text-sm font-medium
                            ${
                              evaluationResults[meeting.id]![evaluationMode]!.results.overall.winner === "v1"
                                ? "bg-primary text-primary-foreground"
                                : evaluationResults[meeting.id]![evaluationMode]!.results.overall.winner === "v2"
                                  ? "bg-secondary text-secondary-foreground"
                                  : "bg-muted text-muted-foreground border-border"
                            }
                          `}
                        >
                          {evaluationResults[meeting.id]![evaluationMode]!.results.overall.winner === "v1" ? (
                            <>
                              <CheckCircle2 size={14} className="mr-1" /> Summary V1 is better
                            </>
                          ) : evaluationResults[meeting.id]![evaluationMode]!.results.overall.winner === "v2" ? (
                            <>
                              <CheckCircle2 size={14} className="mr-1" /> Summary V2 is better
                            </>
                          ) : (
                            <>
                              <HelpCircle size={14} className="mr-1" /> It's a tie
                            </>
                          )}
                        </Badge>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            Last evaluated: {new Date(evaluationResults[meeting.id]![evaluationMode]!.timestamp).toLocaleDateString()}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {evaluationResults[meeting.id]![evaluationMode]!.model}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-muted/30 text-muted-foreground border-border">
                        Not evaluated with {evaluationMode}
                      </Badge>
                    )}
                  </div>
                </a>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold glow-text">Batch Evaluation</h2>
                <div className="flex items-center gap-4">
                  <ToggleGroup
                    type="single"
                    value={evaluationMode}
                    onValueChange={(value) => {
                      if (value) {
                        setEvaluationMode(value as "4.1" | "o3-mini")
                        updateRemainingEvals(evaluationResults, value as "4.1" | "o3-mini")
                      }
                    }}
                    className="bg-muted/30 p-1 rounded-lg"
                  >
                    <ToggleGroupItem
                      value="4.1"
                      aria-label="4.1"
                      className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3 py-1 rounded"
                    >
                      4.1
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="o3-mini"
                      aria-label="o3-mini"
                      className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3 py-1 rounded"
                    >
                      o3-mini
                    </ToggleGroupItem>
                  </ToggleGroup>
                  {remainingEvals > 0 && (
                    <p className="text-muted-foreground">
                      {remainingEvals} meeting{remainingEvals !== 1 ? 's' : ''} remaining to evaluate
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="bg-destructive/90 hover:bg-destructive"
                      disabled={isEvaluating || Object.keys(evaluationResults).length === 0}
                    >
                      <Trash2 size={18} className="mr-2" />
                      Clear Results
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear All Evaluation Results?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will permanently delete all evaluation results from the database. 
                        You will need to re-evaluate all meetings to see their results again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearDatabase}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Clear All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  onClick={handleEvaluateAll}
                  disabled={isEvaluating || remainingEvals === 0}
                  size="lg"
                  variant="default"
                  className="bg-primary text-primary-foreground"
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
                      Evaluate All
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {isEvaluating && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Evaluating meetings... {Math.round(progress)}% complete
                </p>
              </div>
            )}

            {aggregateResults && (
              <Card className="gradient-bg border-border/30">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-6">Aggregate Results</h3>
                  <EvaluationResults results={aggregateResults} />
                </div>
              </Card>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

