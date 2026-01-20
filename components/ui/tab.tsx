"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "./button"

interface TabProps {
  text: string
  selected: boolean
  setSelected: (text: string) => void
  discount?: boolean
}

export function Tab({
  text,
  selected,
  setSelected,
  discount = false,
}: TabProps) {
  return (
    <Button
      onClick={() => setSelected(text)}
      variant={"outline"}
      className={cn(
        "relative w-fit px-4 py-2 text-sm font-semibold capitalize rounded-lg",
        "text-foreground transition-colors",
        selected ? "cursor-default bg-primary! text-white!" : "hover:bg-accent/50" ,
      )}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ type: "spring", duration: 0.4 }}
          className={`"absolute inset-0 z-0 rounded-full bg-background shadow-sm ${selected ? "" : ""}`}
        />
      )}
    </Button>
  )
}