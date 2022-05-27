import { EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useEffect } from 'react';
import { EditorProps } from 'react-draft-wysiwyg';
import uniqid from 'uniqid';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
  fileIconAliases,
  supportedFileIcons,
} from '@/components/Attachment/Attachment';

export interface IFile {
  id: string;
  type: string;
  value?: string;
  name: string;
  size: number;
}
type IEditorState = any;
type ISetEditorState = any;
type ISetAttachedFile = any;

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

export default function TextEditor({
  editorState,
  setEditorState,
  setAttachedFile,
}: {
  editorState: IEditorState;
  setEditorState: ISetEditorState;
  setAttachedFile: ISetAttachedFile;
}) {
  const attachToFiles = (file: IFile) => {
    setAttachedFile((prev: any) => {
      if (!prev) return [file];
      return [file, ...prev];
    });
  };

  useEffect(() => {
    const handlePaste = (event: any) => {
      const data = event.dataTransfer || event.clipboardData;
      if (!data) return;
      let files = data.file || data.items;
      if (!files || files.length === 0) {
        files = data.items;
      }
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          if (file.type === 'text/plain') return;

          if (file.type.indexOf('image') !== -1) {
            if (file.getAsFile) {
              file = file.getAsFile();
            }
            attachToFiles({
              id: uniqid(),
              type: file.type,
              name: file.name,
              size: file.size,
              value: URL.createObjectURL(file),
            });
          }

          if (file.type.indexOf('image') === -1) {
            file = file.getAsFile();
            const fileExtension = (() => {
              const fileExtensionMatch = /\.(\w+)$/g.exec(file.name);
              if (
                fileExtensionMatch &&
                supportedFileIcons.includes(fileExtensionMatch[1].toLowerCase())
              ) {
                const fileExtension = fileExtensionMatch[1].toLowerCase();
                return fileIconAliases[fileExtension] || fileExtension;
              }
              return false;
            })();

            if (supportedFileIcons.includes(`${fileExtension}`)) {
              attachToFiles({
                id: uniqid(),
                type: file.type,
                name: file.name,
                size: file.size,
              });
            }
          }
        }
      }
      event.preventDefault();
    };

    window.addEventListener('paste', handlePaste, false);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const onEditorStateChange = (
    editorState: React.SetStateAction<EditorState>
  ) => {
    setEditorState(editorState);
  };

  return (
    <div className='flex h-48 py-2.5'>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        placeholder='Write something!'
      />
    </div>
  );
}
