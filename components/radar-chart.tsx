"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

interface RadarChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string
      borderColor: string
      borderWidth: number
    }[]
  }
}

export function RadarChart({ data }: RadarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Get the computed colors from CSS variables
    const style = getComputedStyle(document.documentElement)
    const textColor = style.getPropertyValue('--foreground')
    const borderColor = style.getPropertyValue('--border')
    const backgroundColor = style.getPropertyValue('--background')

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "radar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 10,
            ticks: {
              stepSize: 2,
              color: `hsl(${textColor})`,
              backdropColor: "transparent",
              font: {
                size: 13,
                weight: "500"
              }
            },
            pointLabels: {
              color: `hsl(${textColor})`,
              font: {
                size: 13,
                weight: "500"
              },
              padding: 8
            },
            grid: {
              color: `hsl(${borderColor} / 0.4)`,
              lineWidth: 1.5
            },
            angleLines: {
              color: `hsl(${borderColor} / 0.4)`,
              lineWidth: 1.5
            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: `hsl(${textColor})`,
              boxWidth: 12,
              padding: 20,
              font: {
                size: 13,
                weight: "500"
              },
            },
          },
          tooltip: {
            backgroundColor: `hsl(${backgroundColor} / 0.9)`,
            titleColor: `hsl(${textColor})`,
            bodyColor: `hsl(${textColor})`,
            borderColor: `hsl(${borderColor} / 0.2)`,
            borderWidth: 1,
            padding: 10,
            bodyFont: {
              weight: "500"
            },
            titleFont: {
              weight: "600"
            }
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="w-full h-[300px] rounded-lg gradient-bg">
      <canvas ref={chartRef} />
    </div>
  )
}
