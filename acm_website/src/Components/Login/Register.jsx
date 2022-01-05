import React, {useState} from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const RegisterBox = props => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("Please check your Email or password!");

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenAlert(false);
    };

    const handleSubmit = e => {
        e.preventDefault();
        var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (email.match(mailformat) && username && password && password2 && password2 === password) {
            const params = JSON.stringify({
                username: username,
                password: password,
                email: email,
            });

            axios
                .post("http://localhost:8000/api/register", params, {
                    headers: {
                        "content-type": "application/json",
                    },
                })
                .then(res => props.login())
                .catch(err => {
                    console.error(err);
                    setAlertMessage("Username or Email Already Taken!");
                    setOpenAlert(true);
                });
        } else {
            setAlertMessage("Please check your Email or password!");
            setOpenAlert(true);
        }
    };
    return (
        <div className="RegisterBox">
            <Card>
                <CardContent>
                    <h3>Join Us! </h3>
                    <TextField label="Email" onChange={e => setEmail(e.target.value)} />
                    <br />
                    <br />
                    <TextField label="Username" onChange={e => setUsername(e.target.value)} />
                    <br />
                    <br />
                    <TextField label="Password" type="password" onChange={e => setPassword(e.target.value)} />
                    <br />
                    <br />
                    <TextField label="Check Password" type="password" onChange={e => setPassword2(e.target.value)} />
                    <br />
                    <br />
                    <Button variant="outlined" onClick={handleSubmit}>
                        Register
                    </Button>
                    <p>
                        Existing User?{" "}
                        <Button onClick={props.login}>
                            <b>Login</b>
                        </Button>
                    </p>
                </CardContent>
            </Card>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="error" sx={{width: "100%"}}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default RegisterBox;
