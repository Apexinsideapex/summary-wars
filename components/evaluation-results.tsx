"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { CheckCircle2, HelpCircle, TrendingUp, Minus } from "lucide-react"
import { RadarChart } from "@/components/radar-chart"

interface EvaluationResultsProps {
  results: {
    truthfulness: {
      v1Score: number
      v2Score: number
      explanation: string
    }
    clarity: {
      v1Score: number
      v2Score: number
      explanation: string
    }
    conciseness: {
      v1Score: number
      v2Score: number
      explanation: string
    }
    relevance: {
      v1Score: number
      v2Score: number
      explanation: string
    }
    completeness: {
      v1Score: number
      v2Score: number
      explanation: string
    }
    notes: {
      v1Score: number
      v2Score: number
      explanation: string
    }
    overall: {
      winner: "v1" | "v2" | "tie"
      explanation: string
    }
  }
}

export function EvaluationResults({ results }: EvaluationResultsProps) {
  const criteriaItems = [
    { name: "Truthfulness", data: results.truthfulness },
    { name: "Clarity", data: results.clarity },
    { name: "Conciseness", data: results.conciseness },
    { name: "Relevance", data: results.relevance },
    { name: "Completeness", data: results.completeness },
    { name: "Notes", data: results.notes },
  ]

  const chartData = {
    labels: criteriaItems.map((item) => item.name),
    datasets: [
      {
        label: "Summary V1",
        data: criteriaItems.map((item) => item.data.v1Score),
        backgroundColor: "rgba(168, 85, 247, 0.2)",
        borderColor: "rgb(168, 85, 247)",
        borderWidth: 2,
      },
      {
        label: "Summary V2",
        data: criteriaItems.map((item) => item.data.v2Score),
        backgroundColor: "rgba(20, 184, 166, 0.2)",
        borderColor: "rgb(20, 184, 166)",
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold glow-text">Evaluation Results</h2>
        <Badge
          variant={results.overall.winner === "tie" ? "outline" : "default"}
          className={`
            px-3 py-1 text-sm font-medium
            ${
              results.overall.winner === "v1"
                ? "bg-primary text-primary-foreground"
                : results.overall.winner === "v2"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground border-border"
            }
          `}
        >
          {results.overall.winner === "v1" ? (
            <>
              <CheckCircle2 size={14} className="mr-1" /> Summary V1 is better
            </>
          ) : results.overall.winner === "v2" ? (
            <>
              <CheckCircle2 size={14} className="mr-1" /> Summary V2 is better
            </>
          ) : (
            <>
              <HelpCircle size={14} className="mr-1" /> It's a tie
            </>
          )}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="gradient-bg border-border/30 lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Criteria Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criteriaItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-muted/30 rounded-lg p-4 border border-border/30"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{item.name}</h4>
                    {item.data.v1Score > item.data.v2Score ? (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        <TrendingUp size={12} className="mr-1" /> V1 Better
                      </Badge>
                    ) : item.data.v2Score > item.data.v1Score ? (
                      <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
                        <TrendingUp size={12} className="mr-1" /> V2 Better
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-muted/50">
                        <Minus size={12} className="mr-1" /> Equal
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm text-muted-foreground">V1:</span>
                      <span className="ml-1 font-medium">{item.data.v1Score}/10</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-teal-500 mr-2"></div>
                      <span className="text-sm text-muted-foreground">V2:</span>
                      <span className="ml-1 font-medium">{item.data.v2Score}/10</span>
                    </div>
                  </div>

                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div className="w-full bg-muted/50 rounded-full h-2">
                        <motion.div
                          className="bg-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.data.v1Score / 10) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        ></motion.div>
                      </div>
                    </div>
                    <div className="flex mb-2 items-center justify-between">
                      <div className="w-full bg-muted/50 rounded-full h-2">
                        <motion.div
                          className="bg-teal-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.data.v2Score / 10) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        ></motion.div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3">{item.data.explanation}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="gradient-bg border-border/30 h-full">
          <div className="p-6 flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-4">Score Visualization</h3>
            <div className="flex-1 min-h-[300px] flex items-center justify-center">
              <RadarChart data={chartData} />
            </div>
          </div>
        </Card>
      </div>

      <Card className="gradient-bg border-border/30 glow-effect">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Overall Assessment</h3>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {results.overall.winner === "v1" ? (
                <div className="flex items-center text-primary">
                  <CheckCircle2 size={20} className="mr-2" />
                  <span className="font-medium">Summary V1 is recommended</span>
                </div>
              ) : results.overall.winner === "v2" ? (
                <div className="flex items-center text-secondary">
                  <CheckCircle2 size={20} className="mr-2" />
                  <span className="font-medium">Summary V2 is recommended</span>
                </div>
              ) : (
                <div className="flex items-center text-muted-foreground">
                  <HelpCircle size={20} className="mr-2" />
                  <span className="font-medium">Both summaries are equally effective</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-sm text-muted-foreground mr-1">V1:</span>
                <span className="font-medium">{((
                  results.truthfulness.v1Score +
                  results.clarity.v1Score +
                  results.conciseness.v1Score +
                  results.relevance.v1Score +
                  results.completeness.v1Score +
                  (results.notes.v1Score * 2)
                ) / 7).toFixed(1)}/10</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-teal-500 mr-2"></div>
                <span className="text-sm text-muted-foreground mr-1">V2:</span>
                <span className="font-medium">{((
                  results.truthfulness.v2Score +
                  results.clarity.v2Score +
                  results.conciseness.v2Score +
                  results.relevance.v2Score +
                  results.completeness.v2Score +
                  (results.notes.v2Score * 2)
                ) / 7).toFixed(1)}/10</span>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">{results.overall.explanation}</p>
        </div>
      </Card>
    </div>
  )
}
