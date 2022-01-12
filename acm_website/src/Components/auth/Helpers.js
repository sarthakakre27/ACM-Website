import axios from "axios";

export const isAuthenticated = () => {
    return axios
        .get("/api/verify")
        .then(res => {
            if (res.status === 200) {
                return true;
            } else {
                return false;
            }
        })
        .catch(err => {
            return false;
        });
};
