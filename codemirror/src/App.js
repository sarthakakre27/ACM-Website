// import logo from "./logo.svg";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";
import classes from "./custom.module.css";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { EditorView } from "@codemirror/view";

function App() {
  const [language, setLanguage] = useState({ language: "cpp", id: "54" });
  const [languages,setLanguages] = useState([]);
  
  useEffect(() => {
    axios.get("https://ce.judge0.com/languages/").then((res) => {
    setLanguages(res.data);
  });
  },[]);

  const optionOnClickHandler = (event) => {
    console.log(event.target.value);
    console.log(event.target.options[event.target.selectedIndex].textContent);
    setLanguage({language: event.target.options[event.target.selectedIndex].textContent, id: event.target.value });
  }
  

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
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // let editor = document.querySelector(".cm-content");
    // console.log(editor);
    let text = document.querySelector("[role=textbox]").innerText;
    console.log(text);

    // e.preventDefault();

    let outputText = document.getElementById("output");
    outputText.innerHTML = "";
    outputText.innerHTML += "Creating Submission ...\n";
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key":
            "90ab22116emshf7da77335368ea5p11efc8jsn0df3135378c4", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          source_code: text,
          stdin: "",
          language_id: language.id,
        }),
      }
    );
    outputText.innerHTML += "Submission Created ...\n";
    const jsonResponse = await response.json();

    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    };

    while (
      jsonGetSolution.status.description !== "Accepted" &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key":
              "90ab22116emshf7da77335368ea5p11efc8jsn0df3135378c4", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
            "content-type": "application/json",
          },
        });

        jsonGetSolution = await getSolution.json();
      }
    }
    if (jsonGetSolution.stdout) {
      const output = atob(jsonGetSolution.stdout);

      outputText.innerHTML = "";

      outputText.innerHTML += `Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
    } else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr);

      outputText.innerHTML = "";

      outputText.innerHTML += `\n Error :${error}`;
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output);

      outputText.innerHTML = "";

      outputText.innerHTML += `\n Error :${compilation_error}`;
    }
  };

  return (
    <>
      {/* <CodeMirror
        value="console.log('hello world!');"
        height="500px"
        extensions={[javascript({ jsx: true })]}
        onChange={(value, viewUpdate) => {
          console.log("value:", value);
        }}
      /> */}
      <CodeMirror
        className={classes.CodeMirror}
        value="//cout << 'hello world';"
        height="700px"
        extensions={[cpp(), customEditorTheme]}
        // onChange={(value, viewUpdate) => {
        //   console.log("value:", value);
        // }}
      />
      <select id="" onChange={optionOnClickHandler}>
        {languages.map((el) => {
          return <option value={el.id} key={el.id}>{el.name}</option>;
        })}
      </select>
      <form onSubmit={onSubmitHandler}>
        <button type="submit">submit</button>
      </form>
      <textarea id="output" cols="30" rows="10"></textarea>
    </>
  );
}

export default App;
