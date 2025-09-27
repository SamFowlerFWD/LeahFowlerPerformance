"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "relative min-h-[44px] min-w-[44px] flex items-center justify-center",
        "before:content-[''] before:absolute before:inset-0 before:min-h-[44px] before:min-w-[44px] before:-m-2.5",
        "after:content-[''] after:absolute after:size-6 after:rounded-full after:border-2 after:border-navy after:bg-white after:shadow-sm after:transition-all after:duration-200",
        "hover:after:border-navy hover:after:shadow-md",
        "focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:after:border-navy data-[state=checked]:after:bg-navy data-[state=checked]:after:shadow-md",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative z-10 flex items-center justify-center"
      >
        <CircleIcon className="fill-white size-3" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
