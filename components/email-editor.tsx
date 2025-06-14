"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface EmailEditorProps {
  value: string
  onChange: (value: string) => void
  subject: string
  onSubjectChange: (subject: string) => void
}

export default function EmailEditor({
  value,
  onChange,
  subject,
  onSubjectChange,
}: EmailEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })
  

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])


  const toggleLink = () => {
    if (!editor) return

    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run()
    } else if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
    }

    setLinkUrl("")
  }

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <div className="space-y-4">
      {/* Subject Field */}
      <div className="space-y-2">
        <Label htmlFor="email-subject">Subject</Label>
        <Input
          id="email-subject"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="Enter email subject"
        />
      </div>

      {/* Email Body */}
      <div className="space-y-2">
        <Label>Email Body</Label>
        <div className="border rounded-md overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
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

            {/* Link Popover */}
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
                  <Label htmlFor="link-url">URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="link-url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                    <Button type="button" size="sm" onClick={toggleLink}>
                      {editor.isActive("link") ? "Remove" : "Add"}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Text Alignment */}
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

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Lists */}
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

            {/* Clear Button */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => editor.commands.setContent("")}
              title="Clear"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>

          {/* Editor Body */}
          <EditorContent
            editor={editor}
            className="p-3 min-h-[200px] max-h-[400px] overflow-auto focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
