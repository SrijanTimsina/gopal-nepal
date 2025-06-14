'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  ChevronDown,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ImageInput from './ImageInput';
import { Extension } from '@tiptap/core';
import type { ChainedCommands } from '@tiptap/react';
import { NodeSelection } from '@tiptap/pm/state';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Custom extension to make images resizable
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }
          return {
            height: attributes.height,
          };
        },
      },
    };
  },
});

// Create a properly typed FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  // Fix the type for addCommands
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: { chain: () => ChainedCommands }) => {
          return chain().setMark('textStyle', { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }: { chain: () => ChainedCommands }) => {
          return chain()
            .setMark('textStyle', { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Write your content here...',
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [selectedImageWidth, setSelectedImageWidth] = useState<number>(100);

  const [isResizingImage, setIsResizingImage] = useState(false);
  const selectedImageRef = useRef<HTMLImageElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-navy hover:text-gold underline transition-colors',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      const { selection } = editor.view.state;

      if (
        selection instanceof NodeSelection &&
        selection.node?.type.name === 'image'
      ) {
        const node = selection.node;
        const dom = editor.view.nodeDOM(selection.from) as HTMLElement;

        let imageElement: HTMLImageElement | null = null;

        if (dom instanceof HTMLImageElement) {
          imageElement = dom;
        } else {
          imageElement = dom?.querySelector('img');
        }

        if (!imageElement) {
          imageElement = editor.view.dom.querySelector(
            `img[src="${node.attrs.src}"]`
          );
        }

        if (imageElement) {
          selectedImageRef.current = imageElement;
          setSelectedImageWidth(imageElement.width || 100);
        } else {
          console.error('Could not find image element for selected node');
        }
      } else {
        selectedImageRef.current = null;
      }
    },
  });

  const handleImageUploaded = useCallback(
    (url: string) => {
      if (editor) {
        editor.chain().focus().setImage({ src: url, alt: 'Blog image' }).run();
      }
    },
    [editor]
  );

  const setLink = useCallback(() => {
    if (!linkUrl) return;

    if (editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    }

    setLinkUrl('');
    setIsAddingLink(false);
  }, [editor, linkUrl]);

  const setFontSize = useCallback(
    (size: string) => {
      if (editor) {
        editor.chain().focus().setFontSize(size).run();
      }
    },
    [editor]
  );

  useEffect(() => {
    if (editor && editor.isActive('image')) {
      editor
        .chain()
        .updateAttributes('image', {
          width: selectedImageWidth,
        })
        .run();
    }
  }, [editor, selectedImageWidth]);

  const resetImageSize = useCallback(() => {
    if (editor && editor.isActive('image')) {
      editor
        .chain()
        .focus()
        .updateAttributes('image', {
          width: null,
          height: null,
        })
        .run();

      if (selectedImageRef.current) {
        setSelectedImageWidth(selectedImageRef.current.naturalWidth);
      }
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative rounded-md border">
      <div className="sticky left-0 right-0 top-0 z-10 flex h-20 flex-wrap gap-1 border-b bg-gray-50 p-2 md:h-12">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              <Type className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFontSize('12px')}>
              Small
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontSize('16px')}>
              Normal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontSize('20px')}>
              Large
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontSize('24px')}>
              X-Large
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontSize('30px')}>
              XX-Large
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
          }
          aria-label="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
          }
          aria-label="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={
            editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''
          }
          aria-label="Align Center"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
          }
          aria-label="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Popover open={isAddingLink} onOpenChange={setIsAddingLink}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={editor.isActive('link') ? 'bg-gray-200' : ''}
              aria-label="Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="button" size="sm" onClick={setLink}>
                Add
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Add Image"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2">
            <ImageInput
              setValue={(url) =>
                handleImageUploaded(`https://utfs.io/f/${url}`)
              }
            />
          </PopoverContent>
        </Popover>

        {editor.isActive('image') && (
          <Popover open={isResizingImage} onOpenChange={setIsResizingImage}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Resize Image"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="width">Width: {selectedImageWidth}px</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetImageSize}
                    >
                      <Minimize2 className="mr-1 h-3 w-3" /> Reset
                    </Button>
                  </div>
                  <Slider
                    id="width"
                    min={50}
                    max={1200}
                    step={10}
                    value={[selectedImageWidth]}
                    onValueChange={(value) => setSelectedImageWidth(value[0])}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <EditorContent
        editor={editor}
        className="prose max-w-none p-2 focus:outline-none focus:ring-0 focus:ring-offset-0"
      />
    </div>
  );
}
