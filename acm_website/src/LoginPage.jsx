import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import LoginBox from "./Login";
import RegisterBox from "./Register";

const LoginPage = () => {

    const [loginMode, setLoginMode] = useState(false)
    const switchMode = () => {
        setLoginMode(!loginMode);
    }
    return (
        <>
            <div>
                <Grid container spacing={2} height="100%">
                    <Grid item xs={12} md={6} lg={6}>
                        {!loginMode ? <LoginBox register={switchMode} /> :
                            <RegisterBox login={switchMode}></RegisterBox>}
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

export default LoginPage;