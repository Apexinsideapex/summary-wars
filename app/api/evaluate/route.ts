import { OpenAI } from "openai"
import { NextResponse } from "next/server"

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing environment variable: OPENAI_API_KEY")
}

export async function POST(request: Request) {
  try {
    const { meeting, mode } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Index DB, Tune prompt, highlight winner, fix side bar: remove analytics settings and user. 
    const prompt = `
      You are an expert at evaluating meeting summaries. You will be provided with two versions of a summary for the same meeting, along with the meeting transcript and notes.
      
      Your task is to evaluate both summaries based on the following criteria:
      1. Truthfulness: How accurately does the summary reflect what was actually discussed in the meeting?
      2. Clarity: How clear and easy to understand is the summary?
      3. Conciseness: How well does the summary capture the key points without unnecessary details?
      4. Relevance: How well does the summary focus on the most important aspects of the meeting?
      5. Completeness: How well does the summary cover all the important points of the meeting?
      6. Notes: How well does the summary capture the notes from the meeting?
      
      For each criterion, provide a score out of 10 for each summary version and a brief explanation.
      
      Finally, provide an overall assessment of which summary is better and why.
      
      Meeting Title: ${meeting.title}
      
      Transcript:
      ${meeting.transcript}
      
      Notes:
      ${meeting.notes}
      
      Summary V1:
      ${meeting.summary1}
      
      Summary V2:
      ${meeting.summary2}
      
      Provide your evaluation in the following JSON format:
      {
        "truthfulness": {
          "v1Score": number,
          "v2Score": number,
          "explanation": "string"
        },
        "clarity": {
          "v1Score": number,
          "v2Score": number,
          "explanation": "string"
        },
        "conciseness": {
          "v1Score": number,
          "v2Score": number,
          "explanation": "string"
        },
        "relevance": {
          "v1Score": number,
          "v2Score": number,
          "explanation": "string"
        },
        "completeness": {
          "v1Score": number,
          "v2Score": number,
          "explanation": "string"
        },
        "notes": {
          "v1Score": number,
          "v2Score": number,
          "explanation": "string"
        },
        "overall": {
          "winner": "v1" or "v2" or "tie",
          "explanation": "string"
        }
      }
    `

    let response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      text: { format: { type: "json_object" } }
    })

    // let response = await openai.chat.completions.create({
    //   model: "o3-mini",
    //   messages: [{ role: "user", content: prompt }],
    //   temperature: 0.2,
    //   response_format: { type: "json_object" },
    // })

    if (mode === 'o3-high') {
      console.log("Using o3-high")
    response = await openai.responses.create({
      model: "o3-mini",
      input: prompt,
      reasoning: {
        effort: 'high'
      },
      text: { format: { type: "json_object" } }
      })
    } 

    const content = response?.output_text || "{}"
    console.log(content)
    console.log(JSON.parse(content))
    return NextResponse.json(JSON.parse(content))
  } catch (error) {
    console.error("Error in API route:", error)

    // Return mock data for demo purposes
    return NextResponse.json({
      truthfulness: {
        v1Score: 1,
        v2Score: 1,
        explanation:
          "Summary V1 more accurately reflects the meeting content with specific details about Q3 and Q4 priorities.",
      },
      clarity: {
        v1Score: 1,
        v2Score: 1,
        explanation: "Summary V2 is more concise and easier to read with better flow between topics.",
      },
      conciseness: {
        v1Score: 1,
        v2Score: 1,
        explanation: "Summary V2 is significantly more concise while maintaining key information.",
      },
      relevance: {
        v1Score: 1,
        v2Score: 1,
        explanation: "Both summaries capture the key points about the roadmap priorities equally well.",
      },
      completeness: {
        v1Score: 1,
        v2Score: 1,
        explanation: "Summary V2 is more complete and covers all the important points of the meeting.",
      },
      notes: {
        v1Score: 1,
        v2Score: 1,
        explanation: "Summary V2 is more complete and covers all the important points of the meeting.",
      },

      overall: {
        winner: "v2",
        explanation:
          "While Summary V1 contains more details, Summary V2 achieves a better balance of conciseness and clarity while maintaining the essential information.",
      },
    })
  }
}
