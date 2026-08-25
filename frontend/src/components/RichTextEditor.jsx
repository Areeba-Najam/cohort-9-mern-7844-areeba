import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import PropTypes from 'prop-types';
import { useTheme } from '../context/ThemeContext';
import { useEffect } from 'react';

function RichTextEditor({ content = '', onChange }) {
  const { theme } = useTheme();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write something...' }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) return null;

  let containerClasses = 'border rounded-lg overflow-hidden transition-colors ';
  if (theme === 'dark') {
    containerClasses += 'border-gray-700 bg-black/40 text-white [&_.ProseMirror]:text-white [&_.ProseMirror_*]:text-white';
  } else {
    containerClasses += 'border-gray-200 bg-white/60 text-gray-900';
  }

  let toolbarClasses = 'flex gap-1 px-2 py-1.5 border-b transition-colors ';
  if (theme === 'dark') {
    toolbarClasses += 'border-gray-700 bg-gray-900/60';
  } else {
    toolbarClasses += 'border-gray-200 bg-gray-50';
  }

  return (
    <div className={containerClasses}>
      <div className={toolbarClasses}>
        <ToolbarBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} theme={theme}>B</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} theme={theme}><em>i</em></ToolbarBtn>
        <ToolbarBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} theme={theme}>• List</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} theme={theme}>1. List</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} theme={theme}>H2</ToolbarBtn>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none px-4 py-3 min-h-[180px] focus:outline-none"
      />
    </div>
  );
}

function ToolbarBtn({ active = false, onClick, children, theme = 'light' }) {
  let btnClasses = 'text-xs px-2.5 py-1 rounded transition-colors ';
  if (active) {
    btnClasses += 'bg-brand text-white';
  } else if (theme === 'dark') {
    btnClasses += 'text-gray-300 hover:bg-gray-800 hover:text-white';
  } else {
    btnClasses += 'text-gray-600 hover:bg-gray-200';
  }

  return (
    <button type="button" onClick={onClick} className={btnClasses}>
      {children}
    </button>
  );
}

RichTextEditor.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

ToolbarBtn.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  theme: PropTypes.string,
};

export default RichTextEditor;