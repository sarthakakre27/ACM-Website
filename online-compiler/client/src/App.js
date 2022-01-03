import axios from "axios";
import "./App.css";
import stubs from "./stubs";
import React, {useState, useEffect} from "react";
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

import "ace-builds/src-noconflict/ext-language_tools";

//Styling using MAterial UI

import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

function App() {
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [input, setInput] = useState("");
    const [language, setLanguage] = useState("cpp");
    const [langForEditor, setLangForEditor] = useState("c_cpp");
    const [theme, setTheme] = useState("terminal");
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
            // probID: "61c481c193e6be53a096f17c",
        };
        try {
            setOutput("");
            setStatus(null);
            setJobId(null);
            setJobDetails(null);
            const {data} = await axios.post("http://localhost:5000/run", payload);
            if (data.jobId) {
                setJobId(data.jobId);
                setStatus("Submitted.");

                // poll here
                pollInterval = setInterval(async () => {
                    const {data: statusRes} = await axios.get(`http://localhost:5000/status`, {
                        params: {
                            id: data.jobId,
                        },
                    });
                    const {success, job, error} = statusRes;
                    console.log(statusRes);
                    if (success) {
                        const {status: jobStatus, output: jobOutput} = job;
                        setStatus(jobStatus);
                        setJobDetails(job);
                        if (jobStatus === "pending") return;
                        jobStatus === "error"
                            ? setOutput(jobOutput.substring(1, jobOutput.length - 1).replaceAll(/\\n/g, "\n"))
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
        } catch ({response}) {
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

    const handleClearInput = event => {
        setInput("");
    };

    const renderTimeDetails = () => {
        if (!jobDetails) {
            return "";
        }
        let {submittedAt, executionTime} = jobDetails;
        let result = "";
        submittedAt = moment(submittedAt).toString();
        result += `Job Submitted At: ${submittedAt}  `;
        if (executionTime === undefined) return result;
        result += `Execution Time: ${executionTime}ms`;
        return result;
    };

    return (
        <div style={{backgroundColor: "#F7DBD7"}}>
            <Typography
                variant="h3"
                // component="Box"
                display="flex"
                justifyContent="center"
                padding={1}
                sx={{
                    backgroundColor: "#9CC0E7",
                    // fontFamily: "Poppins",
                    // fontStyle: "normal",
                }}>
                Online Compiler
            </Typography>
            <Box sx={{flexGrow: 1}}>
                <Grid container spacing="0.2vh">
                    <Grid item xs={12} sm={7}>
                        <Box
                            display="flex"
                            justifyContent="center"
                            sx={{
                                padding: 0.7,
                                backgroundColor: "#F7DBD7",
                                gap: "20px",
                            }}>
                            <FormControl size="small">
                                <Select
                                    value={theme}
                                    onChange={e => {
                                        setTheme(e.target.value);
                                    }}>
                                    <MenuItem value="monokai">monokai</MenuItem>
                                    <MenuItem value="twilight">twilight</MenuItem>
                                    <MenuItem value="dracula">dracula</MenuItem>
                                    <MenuItem value="xcode">xcode</MenuItem>
                                    <MenuItem value="github">github</MenuItem>
                                    <MenuItem value="eclipse">eclipse</MenuItem>
                                    <MenuItem value="terminal">terminal</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl size="small">
                                <Select
                                    value={language}
                                    onChange={e => {
                                        const shouldSwitch = window.confirm(
                                            "Are you sure you want to change language? WARNING: Your current code will be lost."
                                        );
                                        if (shouldSwitch) {
                                            // console.log("here");
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
                                            setCode(""); //
                                            console.log("here");
                                        }
                                    }}>
                                    <MenuItem value="cpp">C++</MenuItem>
                                    <MenuItem value="py">Python</MenuItem>
                                    <MenuItem value="c">C</MenuItem>
                                    <MenuItem value="js">JavaScript</MenuItem>
                                    <MenuItem value="java">Java</MenuItem>
                                </Select>
                            </FormControl>
                            <Button onClick={setDefaultLanguage} variant="contained" size="small">
                                Set Default
                            </Button>
                            <Button onClick={handleSubmit} variant="contained" size="small">
                                Submit Code
                            </Button>
                        </Box>
                        <AceEditor
                            placeholder="//Your Code Here"
                            mode={langForEditor}
                            showPrintMargin={false}
                            theme={theme}
                            name="blah2"
                            onChange={code => {
                                setCode(code);
                            }}
                            fontSize={18}
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
                            height="100.2vh"
                        />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <Box
                            display="flex"
                            justifyContent="center"
                            sx={{
                                padding: 0.95,
                                backgroundColor: "#F7DBD7",
                                gap: "20px",
                            }}>
                            <Button onClick={handleClearInput} variant="contained" size="medium">
                                Clear Input
                            </Button>
                        </Box>
                        <Box display="flex" justifyContent="flex-end" flexDirection="column" gap="0.2vh">
                            <AceEditor
                                placeholder="//Input"
                                mode={langForEditor}
                                theme={theme}
                                name="input-box"
                                value={input}
                                onChange={input => {
                                    setInput(input);
                                }}
                                fontSize={18}
                                showPrintMargin={false}
                                showGutter={true}
                                highlightActiveLine={true}
                                setOptions={{
                                    showLineNumbers: true,
                                    tabSize: 4,
                                    useWorker: false,
                                }}
                                width="100%"
                                height="50vh"
                            />
                            <AceEditor
                                placeholder="//Output"
                                theme={theme}
                                name="output-box"
                                value={`Status : ${status === null ? "" : status}\nJobId : ${
                                    jobId === null ? "" : jobId
                                }\n${renderTimeDetails()}\nOutput : \n${output}`}
                                fontSize={18}
                                showPrintMargin={false}
                                showGutter={true}
                                highlightActiveLine={true}
                                setOptions={{
                                    showLineNumbers: true,
                                    tabSize: 4,
                                    useWorker: false,
                                    readOnly: true,
                                }}
                                width="100%"
                                height="50vh"
                                editorProps={{readOnly: true}}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default App;
