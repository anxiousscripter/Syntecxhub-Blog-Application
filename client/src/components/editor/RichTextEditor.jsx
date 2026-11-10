import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

import './RichTextEditor.css';

function RichTextEditor({ value, onChange }) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				link: false,
			}),
			Link.configure({
				openOnClick: false,
				autolink: true,
				HTMLAttributes: {
					rel: 'noopener noreferrer',
					target: '_blank',
				},
			}),
		],
		content: value || '',
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: 'editor-content',
				'aria-label': 'Blog post content',
			},
		},
	});

	// Keep the editor synchronized if its value changes externally.
	useEffect(() => {
		if (!editor) return;

		const currentContent = editor.getHTML();
		const newContent = value || '';

		if (currentContent !== newContent) {
			editor.commands.setContent(newContent);
		}
	}, [editor, value]);

	if (!editor) return null;

	const addLink = () => {
		const previousUrl = editor.getAttributes('link').href || '';
		const url = window.prompt('Enter a URL:', previousUrl);

		if (url === null) return;

		if (url.trim() === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}

		editor
			.chain()
			.focus()
			.extendMarkRange('link')
			.setLink({
				href: url.trim(),
			})
			.run();
	};

	return (
		<div className="rich-text-editor">
			<div className="editor-toolbar">
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={editor.isActive('bold') ? 'is-active' : ''}
					title="Bold">
					B
				</button>

				<button
					type="button"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={editor.isActive('italic') ? 'is-active' : ''}
					title="Italic">
					I
				</button>

				<button
					type="button"
					onClick={() => editor.chain().focus().toggleStrike().run()}
					className={editor.isActive('strike') ? 'is-active' : ''}
					title="Strikethrough">
					S
				</button>

				<span className="toolbar-divider" />

				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					className={
						editor.isActive('heading', { level: 2 })
							? 'is-active'
							: ''
					}
					title="Heading 2">
					H2
				</button>

				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					className={
						editor.isActive('heading', { level: 3 })
							? 'is-active'
							: ''
					}
					title="Heading 3">
					H3
				</button>

				<span className="toolbar-divider" />

				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleBulletList().run()
					}
					className={editor.isActive('bulletList') ? 'is-active' : ''}
					title="Bullet list">
					• List
				</button>

				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
					className={
						editor.isActive('orderedList') ? 'is-active' : ''
					}
					title="Numbered list">
					1. List
				</button>

				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleBlockquote().run()
					}
					className={editor.isActive('blockquote') ? 'is-active' : ''}
					title="Blockquote">
					Quote
				</button>

				<span className="toolbar-divider" />

				<button
					type="button"
					onClick={addLink}
					className={editor.isActive('link') ? 'is-active' : ''}
					title="Insert link">
					Link
				</button>

				<button
					type="button"
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().undo()}
					title="Undo">
					↶
				</button>

				<button
					type="button"
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().redo()}
					title="Redo">
					↷
				</button>
			</div>

			<EditorContent editor={editor} />
		</div>
	);
}

export default RichTextEditor;
