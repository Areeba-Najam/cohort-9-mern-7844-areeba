import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write something...' }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex gap-1 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
        <ToolbarBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>B</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><em>i</em></ToolbarBtn>
        <ToolbarBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarBtn>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-3 min-h-[180px] focus:outline-none"
      />
    </div>
  );
}

function ToolbarBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded ${active ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-200'}`}
    >
      {children}
    </button>
  );
}

export default RichTextEditor;