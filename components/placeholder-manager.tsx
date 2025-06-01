"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"

export type PlaceholderDefinition = {
  key: string
  label: string
  type: "text" | "email" | "number"
}

interface PlaceholderManagerProps {
  placeholders: PlaceholderDefinition[]
  onChange: (placeholders: PlaceholderDefinition[]) => void
}

export default function PlaceholderManager({ placeholders, onChange }: PlaceholderManagerProps) {
  const [newPlaceholder, setNewPlaceholder] = useState<PlaceholderDefinition>({
    key: "",
    label: "",
    type: "text",
  })

  const addPlaceholder = () => {
    if (!newPlaceholder.key || !newPlaceholder.label) return

    const key = newPlaceholder.key.replace(/[^a-zA-Z0-9]/g, "")
    if (placeholders.some((p) => p.key === key)) return

    onChange([...placeholders, { ...newPlaceholder, key }])
    setNewPlaceholder({ key: "", label: "", type: "text" })
  }

  const removePlaceholder = (index: number) => {
    onChange(placeholders.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Template Placeholders</Label>

      {placeholders.length > 0 && (
        <div className="space-y-2">
          {placeholders.map((placeholder, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
              <div className="flex-1">
                <span className="text-sm font-medium">{placeholder.label}</span>
                <span className="text-xs text-gray-500 ml-2">({placeholder.key})</span>
              </div>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">{placeholder.type}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePlaceholder(index)}
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border rounded-md">
        <div>
          <Input
            placeholder="Key (e.g., name)"
            value={newPlaceholder.key}
            onChange={(e) => setNewPlaceholder({ ...newPlaceholder, key: e.target.value })}
          />
        </div>
        <div>
          <Input
            placeholder="Label (e.g., Full Name)"
            value={newPlaceholder.label}
            onChange={(e) => setNewPlaceholder({ ...newPlaceholder, label: e.target.value })}
          />
        </div>
        <div>
          <Select
            value={newPlaceholder.type}
            onValueChange={(value: "text" | "email" | "number") =>
              setNewPlaceholder({ ...newPlaceholder, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="number">Number</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="button" onClick={addPlaceholder} disabled={!newPlaceholder.key || !newPlaceholder.label}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-sm text-gray-500">
        Add placeholders that users can fill in when using this template. Use them in your template like {"{key}"}.
      </p>
    </div>
  )
}
