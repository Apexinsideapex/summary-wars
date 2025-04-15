import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { overallExplanationsPrompt } from '@/app/utils/prompts'

const openai = new OpenAI()

export async function POST(request: Request) {
  try {
    const { data } = await request.json()

    // Process each model's data
    const results = await Promise.all(data.map(async (modelData: any) => {
      const { model, explanations, totalEvaluations } = modelData

      // Generate analysis for each criterion
      console.log('--------------------------------')
      console.log(explanations)
      console.log('--------------------------------')
      const analysis = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: overallExplanationsPrompt
          },
          {
            role: "user",
            content: JSON.stringify({
              totalEvaluations,
              explanations
            })
          }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })

      const content = analysis.choices[0].message.content
      if (!content) {
        throw new Error('No analysis content received from OpenAI')
      }

      return {
        model,
        analysis: JSON.parse(content)
      }
    }))

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Error analyzing results:', error)
    return NextResponse.json(
      { success: false, error: 'Error analyzing results' },
      { status: 500 }
    )
  }
} 