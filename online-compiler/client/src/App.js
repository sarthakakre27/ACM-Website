import axios from "axios";
import "./App.css";
import stubs from "./stubs";
import React, { useState, useEffect } from "react";
import moment from "moment";
import AceEditor from "react-ace";
// import brace from "brace";
//languages
import "brace/mode/javascript";
import "brace/mode/c_cpp";
import "brace/mode/python";
import "brace/mode/java";
//editor themes
import "brace/theme/monokai";
import "brace/theme/dracula";
import "brace/theme/xcode";
import "brace/theme/eclipse";
import "brace/theme/terminal";
import "brace/theme/twilight";
import "brace/theme/github";
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [langForEditor, setLangForEditor] = useState("c_cpp");
  const [theme, setTheme] = useState("monokai");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLang);
  }, []);

  let pollInterval;

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
      input,
    };
    try {
      setOutput("");
      setStatus(null);
      setJobId(null);
      setJobDetails(null);
      const { data } = await axios.post("http://localhost:5000/run", payload);
      if (data.jobId) {
        setJobId(data.jobId);
        setStatus("Submitted.");

        // poll here
        pollInterval = setInterval(async () => {
          const { data: statusRes } = await axios.get(
            `http://localhost:5000/status`,
            {
              params: {
                id: data.jobId,
              },
            }
          );
          const { success, job, error } = statusRes;
          console.log(statusRes);
          if (success) {
            const { status: jobStatus, output: jobOutput } = job;
            setStatus(jobStatus);
            setJobDetails(job);
            if (jobStatus === "pending") return;
            jobStatus === "error"
              ? setOutput(
                  `\\033[94m` +
                    jobOutput
                      .substring(1, jobOutput.length - 1)
                      .replaceAll(/\\n\s+/g, "\n          ") +
                    `\\033[0m`
                )
              : setOutput(jobOutput);
            clearInterval(pollInterval);
          } else {
            console.error(error);
            setOutput(error);
            setStatus("Bad request");
            clearInterval(pollInterval);
          }
        }, 1000);
      } else {
        setOutput("Retry again.");
      }
    } catch ({ response }) {
      if (response) {
        const errMsg = response.data.err.stderr;
        setOutput(errMsg);
      } else {
        setOutput("Please retry submitting.");
      }
    }
  };

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
    console.log(`${language} set as default!`);
  };

  const renderTimeDetails = () => {
    if (!jobDetails) {
      return "";
    }
    let { submittedAt, startedAt, completedAt } = jobDetails;
    let result = "";
    submittedAt = moment(submittedAt).toString();
    result += `Job Submitted At: ${submittedAt}  `;
    if (!startedAt || !completedAt) return result;
    const start = moment(startedAt);
    const end = moment(completedAt);
    const diff = end.diff(start, "seconds", true);
    result += `Execution Time: ${diff}s`;
    return result;
  };

  return (
    <div className="App">
      <h1>Online Code Compiler</h1>
      <div>
        <label>Language: </label>
        <select
          value={language}
          onChange={(e) => {
            const shouldSwitch = window.confirm(
              "Are you sure you want to change language? WARNING: Your current code will be lost."
            );
            if (shouldSwitch) {
              setLanguage(e.target.value);
              if (e.target.value === "py") {
                setLangForEditor("python");
              } else if (e.target.value === "cpp" || e.target.value === "c") {
                setLangForEditor("c_cpp");
              } else if (e.target.value === "js") {
                setLangForEditor("javascript");
              } else if (e.target.value === "java") {
                setLangForEditor("java");
              }
            }
          }}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
          <option value="c">C</option>
          <option value="js">JavaScript</option>
          <option value="java">Java</option>
        </select>
        <label>Editor Theme: </label>
        <select
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value);
            if (e.target.value === "dracula") {
              setTheme("dracula");
            } else if (e.target.value === "github") {
              setTheme("github");
            } else if (e.target.value === "xcode") {
              setTheme("xcode");
            } else if (e.target.value === "twilight") {
              setTheme("twilight");
            } else if (e.target.value === "eclipse") {
              setTheme("eclipse");
            } else if (e.target.value === "terminal") {
              setTheme("terminal");
            } else if (e.target.value === "monokai") {
              setTheme("monokai");
            }
          }}
        >
          <option value="monokai">monokai</option>
          <option value="twilight">twilight</option>
          <option value="dracula">dracula</option>
          <option value="xcode">xcode</option>
          <option value="github">github</option>
          <option value="eclipse">eclipse</option>
          <option value="terminal">terminal</option>
        </select>
      </div>
      <br />
      <div>
        <button onClick={setDefaultLanguage}>Set Default</button>
      </div>
      <br />
      {/* <textarea
        rows="20"
        cols="75"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
      ></textarea> */}
      <AceEditor
        placeholder="//Your Code Here"
        mode={langForEditor} //"javascript"
        theme={theme}
        name="blah2"
        // onLoad={this.onLoad}
        onChange={(code) => {
          setCode(code);
        }}
        // value={code}
        fontSize={16}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
        }}
        width="100%"
        height="700px"
      />
      <br />
      <button onClick={handleSubmit} className="submit-btn">
        Submit Code
      </button>
      <AceEditor
        placeholder="//Input"
        mode={langForEditor}
        theme={theme}
        name="input-box"
        // onLoad={this.onLoad}
        value={input}
        onChange={(input) => {
          setInput(input);
        }}
        fontSize={16}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          // enableBasicAutocompletion: true,
          // enableLiveAutocompletion: true,
          // enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
          useWorker: false,
        }}
        width="50%"
        height="300px"
      />
      <AceEditor
        placeholder="//Output"
        mode={"python"}
        theme={theme}
        name="output-box"
        // onLoad={this.onLoad}
        // onChange={(code) => {
        //   setCode(code);
        // }}
        value={`Status : ${status === null ? "" : status}\nJobId : ${
          jobId === null ? "" : jobId
        }\n${renderTimeDetails()}\nOutput : ${output}`}
        fontSize={16}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          // enableBasicAutocompletion: true,
          // enableLiveAutocompletion: true,
          // enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
          useWorker: false,
        }}
        width="50%"
        height="300px"
      />
      {/* <p>{status}</p>
      <p>{jobId ? `Job ID: ${jobId}` : ""}</p>
      <p>{renderTimeDetails()}</p>
      <p>{output}</p> */}
    </div>
  );
}

export default App;
