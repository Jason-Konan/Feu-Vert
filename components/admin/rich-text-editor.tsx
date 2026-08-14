// components/admin/rich-text-editor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ToolbarButton = ({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active: boolean;
  label: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className={cn(
      "inline-flex h-7 w-7 items-center justify-center rounded text-sm transition-colors",
      active
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:bg-background hover:text-foreground",
    )}
  >
    {children}
  </button>
);

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value ?? "",
    onUpdate: ({ editor }) => {
      // Stocke "" si l'éditeur est vide plutôt que "<p></p>"
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[140px] px-3 py-2.5 focus:outline-none text-slate-700",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/50 p-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="Gras"
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="Italique"
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-border" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          label="Titre 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          label="Titre 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-border" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="Liste à puces"
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="Liste numérotée"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          active={false}
          label="Séparateur"
        >
          <Minus className="h-3.5 w-3.5" />
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-border" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
          label="Annuler"
        >
          <Undo className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
          label="Rétablir"
        >
          <Redo className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
