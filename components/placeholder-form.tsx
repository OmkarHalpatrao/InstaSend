"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Placeholder } from "./homePage"
import type { PlaceholderDefinition } from "./placeholder-manager"

interface PlaceholderFormProps {
  placeholders: Placeholder[]
  onChange: (key: string, value: string) => void
  templatePlaceholders: PlaceholderDefinition[]
}

export default function PlaceholderForm({ placeholders, onChange, templatePlaceholders }: PlaceholderFormProps) {
  const getPlaceholderDefinition = (key: string) => {
    return templatePlaceholders.find((tp) => tp.key === key)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Fill in Template Values</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {placeholders.map((placeholder) => {
          const definition = getPlaceholderDefinition(placeholder.key)
          return (
            <div key={placeholder.key} className="space-y-2">
              <Label htmlFor={`placeholder-${placeholder.key}`}>{definition?.label || placeholder.key}</Label>
              <Input
                id={`placeholder-${placeholder.key}`}
                type={definition?.type || "text"}
                value={placeholder.value}
                onChange={(e) => onChange(placeholder.key, e.target.value)}
                placeholder={`Enter ${definition?.label || placeholder.key}`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
