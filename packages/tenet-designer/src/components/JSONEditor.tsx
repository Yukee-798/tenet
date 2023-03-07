import React, { useState, useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { json } from '@codemirror/lang-json';
import { parse } from 'jsonc-parser';
import { debounce } from 'lodash';

export interface JSONEditorProps {
  /* 默认值必须传入一个对象 */
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const JSONEditor: React.FC<JSONEditorProps> = (props) => {
  const { defaultValue, onChange } = props;
  const editorRef = useRef(null);
  const [editorView, setEditorView] = useState(null);

  useEffect(() => {
    if (editorRef.current && !editorView) {
      const initialState = EditorState.create({
        doc: defaultValue,
        extensions: [
          basicSetup,
          json(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newValue = update.state.doc.toString();
              if (onChange) {
                try {
                  onChange(newValue);
                } catch (err) {
                  // do nothing
                }
              }
            }
          }),
        ],
      });
      const view = new EditorView({
        state: initialState,
        parent: editorRef.current,
      });
      setEditorView(view);
    }
  }, [editorRef, editorView]);

  return <div ref={editorRef} />;
};

export default JSONEditor;
