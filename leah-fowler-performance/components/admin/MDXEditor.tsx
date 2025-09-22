'use client'

import React, { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import {
  Bold,
  Italic,
  Code,
  Link2,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Undo,
  Redo,
  Table,
  Youtube,
  FileCode
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

const lowlight = createLowlight(common)

interface MDXEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function MDXEditor({ content, onChange, placeholder = 'Start writing...' }: MDXEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false)
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false)
  const [linkUrl, setLinkUrl] = React.useState('')
  const [linkText, setLinkText] = React.useState('')
  const [imageUrl, setImageUrl] = React.useState('')
  const [imageAlt, setImageAlt] = React.useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false
}),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline'
}
}),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg'
}
}),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 rounded-md p-4 font-mono text-sm'
}
}),
    ],
    content,
    onUpdate: ({ editor }) => {
      // Convert to MDX format
      const html = editor.getHTML()
      onChange(html)
    }
})

  const setLink = useCallback(() => {
    if (!editor) return

    if (linkUrl === '') {
      editor.chain().focus().unsetLink().run()
    } else {
      if (linkText && editor.state.selection.empty) {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${linkUrl}">${linkText}</a>`)
          .run()
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: linkUrl })
          .run()
      }
    }
    setLinkDialogOpen(false)
    setLinkUrl('')
    setLinkText('')
  }, [editor, linkUrl, linkText])

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return

    editor
      .chain()
      .focus()
      .setImage({ src: imageUrl, alt: imageAlt })
      .run()

    setImageDialogOpen(false)
    setImageUrl('')
    setImageAlt('')
  }, [editor, imageUrl, imageAlt])

  const insertYouTubeEmbed = () => {
    if (!editor) return

    const url = prompt('Enter YouTube URL:')
    if (!url) return

    // Extract video ID from URL
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    if (!videoId) {
      alert('Invalid YouTube URL')
      return
    }

    const embedHtml = `<div class="relative aspect-video mb-6">
      <iframe
        src="https://www.youtube.com/embed/${videoId}"
        class="absolute inset-0 w-full h-full rounded-lg"
        frameborder="0"
        allowfullscreen>
      </iframe>
    </div>`

    editor.chain().focus().insertContent(embedHtml).run()
  }

  const insertCodeBlock = () => {
    if (!editor) return

    const language = prompt('Enter programming language (e.g., javascript, python, tsx):') || 'javascript'
    editor.chain().focus().setCodeBlock({ language }).run()
  }

  const insertTable = () => {
    if (!editor) return

    const tableHtml = `<table class="min-w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-50">
          <th class="border border-gray-300 px-4 py-2">Header 1</th>
          <th class="border border-gray-300 px-4 py-2">Header 2</th>
          <th class="border border-gray-300 px-4 py-2">Header 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border border-gray-300 px-4 py-2">Cell 1</td>
          <td class="border border-gray-300 px-4 py-2">Cell 2</td>
          <td class="border border-gray-300 px-4 py-2">Cell 3</td>
        </tr>
      </tbody>
    </table>`

    editor.chain().focus().insertContent(tableHtml).run()
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-300 bg-gray-50 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
              type="button"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
              type="button"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
              type="button"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Text Styles */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'bg-gray-200' : ''}
              type="button"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'bg-gray-200' : ''}
              type="button"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={editor.isActive('code') ? 'bg-gray-200' : ''}
              type="button"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
              type="button"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
              type="button"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
              type="button"
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>

          {/* Media */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLinkDialogOpen(true)}
              type="button"
            >
              <Link2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setImageDialogOpen(true)}
              type="button"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={insertYouTubeEmbed}
              type="button"
            >
              <Youtube className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={insertTable}
              type="button"
            >
              <Table className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={insertCodeBlock}
              type="button"
            >
              <FileCode className="h-4 w-4" />
            </Button>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              type="button"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              type="button"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose prose-lg max-w-none p-4 min-h-[500px] focus:outline-none"
      />

      {/* Bubble Menu temporarily disabled - not available in current tiptap version */}

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
            <DialogDescription>
              Enter the URL and optional link text
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-url" className="text-right">
                URL
              </Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-text" className="text-right">
                Text
              </Label>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Link text (optional)"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={setLink}>Add Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
            <DialogDescription>
              Enter the image URL and alt text
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image-url" className="text-right">
                Image URL
              </Label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image-alt" className="text-right">
                Alt Text
              </Label>
              <Input
                id="image-alt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Description of the image"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={addImage}>Add Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}