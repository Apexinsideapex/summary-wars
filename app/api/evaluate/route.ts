import { OpenAI } from "openai"
import { NextResponse } from "next/server"
import { defaultPrompt, o3HighPrompt } from "@/app/utils/prompts"
import { splitTranscript } from "@/lib/utils"

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
    const meetingDataString = `
      - Meeting Title: ${meeting.title}
      - Transcript: ${splitTranscript(meeting.transcript).map(segment => `${segment.speaker}: ${segment.text}`).join('\n')}
      - Notes: ${meeting.notes}
      - Summary V1: ${meeting.summary1}
      - Summary V2: ${meeting.summary2}
    `
    

    let response = null;
    
    console.log("Mode: ", mode)
    console.log("Meeting Data String: ", meetingDataString)
    // let response = await openai.chat.completions.create({
    //   model: "o3-mini",
    //   messages: [{ role: "user", content: prompt }],
    //   temperature: 0.2,
    //   response_format: { type: "json_object" },
    // })

    if (mode === 'o3-mini') {
      console.log("Using o3-mini")
    response = await openai.responses.create({
      model: "o3-mini",
      input: [
        {
          role: "system",
          content: o3HighPrompt
        },
        {
          role: "user",
          content: meetingDataString
        }
      ],
      reasoning: {
        effort: 'medium'
      },
      text: { format: { type: "json_object" } },
      })
    } 
    else {
      console.log("Using gpt-4.1")
      response = await openai.responses.create({
        model: 'gpt-4.1',
        input: [
          {
            role: "system",
            content: o3HighPrompt
          },
          {
            role: "user",
            content: meetingDataString
          }
        ],
        text: { format: { type: "json_object" } },
        temperature: 0.2
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
