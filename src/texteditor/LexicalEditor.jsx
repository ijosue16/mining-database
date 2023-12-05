import {$getRoot, $getSelection} from 'lexical';
import {useEffect,useRef,useState} from 'react';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin'
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
// import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import ToolbarEditor from './toolbar/ToolbarEditor';
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin, } from "@lexical/react/LexicalLinkPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import lexicalEditorConfig from './config';


// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
};

function OnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
}

function EditorWrapper() {
  // const [editor] = useLexicalComposerContext();
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState();

  function onChange(editorState) {
    // console.log(editorState)
    // Call toJSON on the EditorState object, which produces a serialization safe string
    const editorStateJSON = editorState.toJSON();
    // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
    // setEditorState(JSON.stringify(editorStateJSON));
    setEditorState(editorStateJSON);

  }


  return (
    <LexicalComposer initialConfig={lexicalEditorConfig} editorRef={editorRef}>
        <div className=' w-full bg-slate-300 p-2 space-y-2'>
            <ToolbarEditor/>
      <RichTextPlugin
        contentEditable={<ContentEditable className=' focus:outline-none bg-white rounded p-2 text-where-words-go' />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <ListPlugin/>
      <LinkPlugin/>
      <MyCustomAutoFocusPlugin />
      <OnChangePlugin onChange={onChange}/>
      </div>
      <button className=' p-2 rounded bg-orange-300' onClick={()=>{console.log(editorState)}}>Output</button>
    </LexicalComposer>
    
  );
}

export default EditorWrapper;