import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote,
  Undo, Redo, ImageIcon
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  if (!editor) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      const { error } = await supabase.storage
        .from('public_images')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading image:', error);
        alert('حدث خطأ أثناء رفع الصورة');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('public_images')
        .getPublicUrl(filePath);

      editor.chain().focus().setImage({ src: publicUrl }).run();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الرفع');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-gray-50/50 rounded-t-xl" dir="ltr">
      {/* Undo/Redo */}
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50"><Undo size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50"><Redo size={16} /></button>
      <div className="w-[1px] h-5 bg-border mx-1" />

      {/* Formatting */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-primary/10 text-primary' : ''}`}><Bold size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-primary/10 text-primary' : ''}`}><Italic size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-primary/10 text-primary' : ''}`}><UnderlineIcon size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-primary/10 text-primary' : ''}`}><Strikethrough size={16} /></button>
      <div className="w-[1px] h-5 bg-border mx-1" />

      {/* Headings */}
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-1.5 rounded hover:bg-gray-200 font-bold ${editor.isActive('heading', { level: 1 }) ? 'bg-primary/10 text-primary' : ''}`}>H1</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded hover:bg-gray-200 font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/10 text-primary' : ''}`}>H2</button>
      <div className="w-[1px] h-5 bg-border mx-1" />

      {/* Alignment */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary/10 text-primary' : ''}`}><AlignLeft size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary/10 text-primary' : ''}`}><AlignCenter size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary/10 text-primary' : ''}`}><AlignRight size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-primary/10 text-primary' : ''}`}><AlignJustify size={16} /></button>
      <div className="w-[1px] h-5 bg-border mx-1" />

      {/* Lists & Quotes */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-primary/10 text-primary' : ''}`}><List size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-primary/10 text-primary' : ''}`}><ListOrdered size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-primary/10 text-primary' : ''}`}><Quote size={16} /></button>
      <div className="w-[1px] h-5 bg-border mx-1" />

      {/* Image Upload */}
      <label className={`p-1.5 rounded hover:bg-gray-200 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {isUploading ? <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : <ImageIcon size={16} />}
        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
      </label>
    </div>
  );
};

export default function TipTapEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg mx-auto block my-4',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg mx-auto focus:outline-none min-h-[300px] p-4 text-right',
        dir: 'rtl',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-border rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} dir="rtl" />
    </div>
  );
}
