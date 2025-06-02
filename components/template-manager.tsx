"use client"

import { useEffect, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Bold,
  Italic,
  UnderlineIcon,
  LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import PlaceholderManager, { type PlaceholderDefinition } from "./placeholder-manager"
import type { Template } from "./email-referral-tool"

interface TemplateManagerProps {
  template?: Template | null
  onSave: (template: Template) => void
  isEditing?: boolean
}

export default function TemplateManager({ template, onSave, isEditing = false }: TemplateManagerProps) {
  const [templateName, setTemplateName] = useState(template?.name || "")
  const [subject, setSubject] = useState(template?.subject || "")
  const [placeholders, setPlaceholders] = useState<PlaceholderDefinition[]>(template?.placeholders || [])
  const [linkUrl, setLinkUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    ],
    content: template?.body || "<p>Enter your template content here...</p>",
  })

  // Update form when template changes
  useEffect(() => {
    if (template) {
      setTemplateName(template.name)
      setSubject(template.subject)
      setPlaceholders(template.placeholders || [])
      if (editor) {
        editor.commands.setContent(template.body)
      }
    } else {
      setTemplateName("")
      setSubject("")
      setPlaceholders([])
      if (editor) {
        editor.commands.setContent("<p>Enter your template content here...</p>")
      }
    }
  }, [template, editor])

  const setLink = () => {
    if (!linkUrl) return

    editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
    setLinkUrl("")
  }

  const insertPlaceholder = (placeholder: PlaceholderDefinition) => {
    editor?.chain().focus().insertContent(`{${placeholder.key}}`).run()
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a name for your template")
      return
    }

    if (!subject.trim()) {
      toast.error("Subject required")
      return
    }

    if (!editor || !editor.getHTML() || editor.getHTML() === "<p></p>") {
      toast.error("Please enter content for your template")
      return
    }

    try {
      setIsSaving(true)

      const method = isEditing ? "PUT" : "POST"
      const url = isEditing && template ? `/api/templates/${template.id}` : "/api/templates"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: templateName,
          subject,
          body: editor.getHTML(),
          placeholders,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save template")
      }

      const savedTemplate = await response.json()

      toast.success(isEditing ? "Template updated successfully" : "Template created successfully")

      onSave(savedTemplate)
    } catch (error) {
      toast.error("Failed to save template")
      console.error("Error saving template:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{isEditing ? "Edit Template" : "Create Template"}</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter template name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-subject">Subject</Label>
          <Input
            id="template-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
          />
        </div>

        <PlaceholderManager placeholders={placeholders} onChange={setPlaceholders} />

        <div className="space-y-2">
          <Label>Template Body</Label>
          <div className="border rounded-md overflow-hidden">
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
              {/* Formatting buttons */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-gray-200" : ""}
              >
                <Bold className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-gray-200" : ""}
              >
                <Italic className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive("underline") ? "bg-gray-200" : ""}
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={editor.isActive("link") ? "bg-gray-200" : ""}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="link-url-template">URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="link-url-template"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                      />
                      <Button type="button" size="sm" onClick={setLink}>
                        Add
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              {/* Alignment buttons */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className={editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                className={editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                className={editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}
              >
                <AlignRight className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              {/* List buttons */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
              >
                <List className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>

            <EditorContent editor={editor} className="p-3 min-h-[200px]" />
          </div>

          {placeholders.length > 0 && (
            <div className="mt-2">
              <Label className="text-sm">Quick Insert Placeholders:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {placeholders.map((placeholder) => (
                  <Button
                    key={placeholder.key}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertPlaceholder(placeholder)}
                  >
                    {placeholder.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button onClick={handleSaveTemplate} disabled={isSaving} className="w-full">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Saving..."}
            </>
          ) : isEditing ? (
            "Update Template"
          ) : (
            "Save Template"
          )}
        </Button>
      </div>
    </div>
  )
}
