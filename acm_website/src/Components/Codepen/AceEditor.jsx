import React from "react";
import {useParams} from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import AceEditor from "react-ace";
import {useState} from "react";
//languages
import "brace/mode/javascript";
import "brace/mode/css";
import "brace/mode/html";

//editor themes
import "brace/theme/monokai";
import "brace/theme/dracula";
import "brace/theme/xcode";
import "brace/theme/eclipse";
import "brace/theme/terminal";
import "brace/theme/twilight";
import "brace/theme/github";

import "ace-builds/src-noconflict/ext-language_tools";

 const CodeInput =  (props) => {
    const [theme, setTheme] = useState(props.theme);
     return (
        <div>
        <FormControl size="small">
        <Select
            value={theme}
            onChange={e => {
                setTheme(e.target.value);
                props.setTheme(e.target.value);
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
        <AceEditor
        placeholder="//Your Code Here"
        mode={props.language}
        showPrintMargin={false}
        value={props.value}
        theme={theme}
        name="blah2"
        onChange={code => {
            
            props.save(code);
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
    </div>
     )
 }


export default CodeInput;