import type { Meeting } from "@/types"

export async function evaluateSummaries(meeting: Meeting) {
  try {
    const response = await fetch("/api/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ meeting }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error evaluating summaries:", error)

    // Return mock data for demo purposes
    return {
      truthfulness: {
        v1Score: 8,
        v2Score: 7,
        explanation:
          "Summary V1 more accurately reflects the meeting content with specific details about Q3 and Q4 priorities.",
      },
      clarity: {
        v1Score: 7,
        v2Score: 9,
        explanation: "Summary V2 is more concise and easier to read with better flow between topics.",
      },
      conciseness: {
        v1Score: 6,
        v2Score: 9,
        explanation: "Summary V2 is significantly more concise while maintaining key information.",
      },
      relevance: {
        v1Score: 8,
        v2Score: 8,
        explanation: "Both summaries capture the key points about the roadmap priorities equally well.",
      },
      overall: {
        winner: "v2",
        explanation:
          "While Summary V1 contains more details, Summary V2 achieves a better balance of conciseness and clarity while maintaining the essential information.",
      },
    }
  }
}
