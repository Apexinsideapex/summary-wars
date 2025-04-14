"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface ParticleContainerProps {
  children: React.ReactNode
}

export function ParticleContainer({ children }: ParticleContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])

  class Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    color: string

    constructor(x: number, y: number) {
      this.x = x
      this.y = y
      this.size = Math.random() * 3 + 1
      this.speedX = Math.random() * 0.5 - 0.25
      this.speedY = Math.random() * 0.5 - 0.25
      this.color = `hsla(${250 + Math.random() * 30}, 95%, 65%, ${Math.random() * 0.3 + 0.1})`
    }

    update() {
      this.x += this.speedX
      this.y += this.speedY
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      if (!containerRef.current || !canvas) return
      canvas.width = containerRef.current.offsetWidth
      canvas.height = containerRef.current.offsetHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize particles
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      particlesRef.current.push(new Particle(x, y))
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        particle.update()
        particle.draw(ctx)

        // Wrap particles around the canvas
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      particlesRef.current = []
    }
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
