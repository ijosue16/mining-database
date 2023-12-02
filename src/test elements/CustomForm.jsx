import React, { useState } from 'react';
// import { Editor, Transforms } from '@lexical/editor';
// import { ReactEditor, useSlate } from '@lexical/react';

const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
      universal: true,
    });

    return !!match;
  },
  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    );
  },
  // Add other custom editor functions as needed
};

const RichTextEditor = () => {
  const editor = useSlate();
  const [value, setValue] = useState([{ type: 'paragraph', children: [{ text: '' }]}]);

  return (
    <div>
      <button
        onMouseDown={event => {
          event.preventDefault();
          CustomEditor.toggleBoldMark(editor);
        }}
      >
        Bold
      </button>
      <Editor
        value={value}
        onChange={newValue => setValue(newValue)}
        renderElement={props => <Element {...props} />}
        renderLeaf={props => <Leaf {...props} />}
      />
    </div>
  );
};

const Element = ({ attributes, children, element }) => {
  // Render custom elements as needed
};

const Leaf = ({ attributes, children, leaf }) => {
  // Render custom leaf nodes as needed
};

export default RichTextEditor;