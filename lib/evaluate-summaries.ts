import type { EvalData } from "@/types"

export async function evaluateSummaries(meeting: EvalData, mode: "4.1" | "o3-mini" = "o3-mini") {
  try {
    const response = await fetch("/api/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ meeting, mode }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error evaluating summaries:", error)
    throw error // Let the caller handle the error
  }
}
