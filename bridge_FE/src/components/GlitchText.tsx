import { useState, useEffect } from "react"

interface GlitchTextProps {
  children: string
  className?: string
}

export default function GlitchText({ children, className = "" }: GlitchTextProps) {
  const [glitchedText, setGlitchedText] = useState(children)

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        const glitchedString = children
          .split("")
          .map((char) =>
            Math.random() < 0.5 ? String.fromCharCode(char.charCodeAt(0) + Math.floor(Math.random() * 5)) : char,
          )
          .join("")
        setGlitchedText(glitchedString)
        setTimeout(() => setGlitchedText(children), 100)
      }
    }, 1000)

    return () => clearInterval(glitchInterval)
  }, [children])

  return (
    <span className={`glitch-text ${className}`} data-text={children}>
      {glitchedText}
    </span>
  )
}

