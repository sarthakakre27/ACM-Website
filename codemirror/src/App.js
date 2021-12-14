// import logo from "./logo.svg";
import "./App.css";
import classes from "./custom.module.css";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { EditorView } from "@codemirror/view";

function App() {
  const customEditorTheme = EditorView.theme(
    {
      "&": {
        color: "#56b6c2",
        backgroundColor: "#e06c75",
      },
      ".cm-content": {
        caretColor: "#61afef",
        backgroundColor: "#0d112b",
      },
      ".cm-line::selection": {
        background: "#0d112b",
      },
      "& .cm-activeLineGutter, & .cm-activeLine": {
        backgroundColor: "##080a1c !important",
      },
    },
    { dark: true }
  );
  //function onChange2(value)=>{
    
  return (
    <>
      <CodeMirror
        value="console.log('hello world!');"
        height="500px"
        extensions={[javascript({ jsx: true })]}
        onChange={(value, viewUpdate) => {
          console.log("value:", value);
        }}
      />
      <CodeMirror
        className={classes.CodeMirror}
        value="//cout << 'hello world';"
        height="500px"
        extensions={[cpp(), customEditorTheme]}
        onChange={(value, viewUpdate) => {
          console.log("value:", viewUpdate);
        }}
      />
    </>
  );
}

export default App;
