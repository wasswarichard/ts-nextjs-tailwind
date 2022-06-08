import { Divider } from '@mui/material';
import {
  ContentBlock,
  DraftEditorCommand,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  RichUtils,
} from 'draft-js';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import uniqid from 'uniqid';

import 'draft-js/dist/Draft.css';
import styles from './RichTextEditor.module.css';

import Attachment, {
  fileIconAliases,
  supportedFileIcons,
} from '@/components/Attachment';

import { BLOCK_TYPES, INLINE_STYLES, styleMap } from '@/utils/bytes';

export interface IFile {
  id: string;
  type: string;
  value?: string;
  name: string;
  size: number;
}

const StyleButton = ({
  active,
  label,
  onToggle,
  style,
}: {
  active: boolean;
  label: string;
  onToggle: any;
  style: string;
}) => {
  let buttonStyles = styles['RichEditor-styleButton'];
  if (active) {
    buttonStyles += styles['RichEditor-activeButton'];
  }
  return (
    <span className={`${buttonStyles}  ${style}`} onMouseDown={onToggle}>
      {label}
    </span>
  );
};

const getBlockStyle = (block: ContentBlock) => {
  switch (block.getType()) {
    case 'blockquote':
      return styles['RichEditor-blockquote'];
    default:
      return '';
  }
};

const BlockStyleControls = (props: { onToggle?: any; editorState?: any }) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className={`${styles['RichEditor-controls']}`}>
      {BLOCK_TYPES.map((type) => {
        return (
          <StyleButton
            key={uniqid()}
            active={type.style === blockType}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        );
      })}
    </div>
  );
};

const InlineStyleControls = (props: {
  editorState: { getCurrentInlineStyle: () => any };
  onToggle: any;
}) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className={`${styles['RichEditor-controls']}`}>
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={uniqid()}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

export default function RichTextEditor({
  editorState,
  setEditorState,
  setAttachedFile,
  attachedFile,
}: {
  editorState: any;
  setEditorState: any;
  setAttachedFile: any;
  attachedFile: IFile[];
}) {
  const editor = useRef(null);

  const [mounted, setMounted] = useState(false);

  const attachToFiles = (file: IFile) => {
    setAttachedFile((prev: any) => {
      if (!prev) return [file];
      return [file, ...prev];
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const onChange = (editorState: React.SetStateAction<EditorState>) => {
    setEditorState(editorState);
  };

  const onEditorStateChange = (
    editorState: React.SetStateAction<EditorState>
  ) => {
    setEditorState(editorState);
  };

  const toggleBlockType = (blockType: string) => {
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };



  const handleKeyCommand = (command: DraftEditorCommand) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const mapKeyToEditorCommand = (e: React.KeyboardEvent<{}>) => {
    if (e.keyCode === 9) {
      const newEditorState = RichUtils.onTab(e, editorState, 4);
      if (newEditorState !== editorState) {
        onChange(newEditorState);
      }
      return null;
    }
    return getDefaultKeyBinding(e);
  };

  let className = styles['RichEditor-editor'];
  const contentState = editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      className += styles['RichEditor-hidePlaceholder'];
    }
  }

  return (
    <div className={`${styles['RichEditor-root']}`}>
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />
      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />
      <Divider />
      <Attachment
        attachedFiles={attachedFile}
        setAttachedFile={setAttachedFile}
      />
      <div className={className} >
        {mounted && (
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            editorState={editorState}
            ref={editor}
            onChange={onEditorStateChange}
            placeholder='Write / paste something!'
            spellCheck={true}
          />
        )}
      </div>
    </div>
  );
}
