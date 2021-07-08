import React, {useState, useEffect} from "react";
import classes from "./Auth.module.scss";
import { verificationEmail } from "../../services/authService";
import { useParams, useHistory } from "react-router-dom";

const Verify = props => {

    const [isMessage, setIsMessage] = useState('');
    let { token } = useParams();
    let history = useHistory();

    useEffect(() => {
        verification();
      }, []);

    const verification = async() => {
        try{
            const response = await verificationEmail(token);
            console.log(response.Message);
            setIsMessage(response.Message);
            if (response.Message == 'Congratulations! Email id got verified. You may now log in.') setTimeout(() => {history.replace("/")}, 2000);
        } catch (err){
            console.log(err);
            if (err) setIsMessage(err.response.data.Message);
        }
    };

    return (
        <h1 className={classes.emailVerifyTitle}>{isMessage}</h1>
    )
}

export default Verify;