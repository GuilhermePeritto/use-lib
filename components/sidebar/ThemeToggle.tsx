'use client'

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Verifica se o componente foi montado no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Se o componente não foi montado, não renderiza nada
  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-full justify-start px-2 text-white/80 hover:text-white hover:bg-white/10"
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="ml-2">
        {theme === "light" ? "Modo Escuro" : "Modo Claro"}
      </span>
    </Button>
  )
}