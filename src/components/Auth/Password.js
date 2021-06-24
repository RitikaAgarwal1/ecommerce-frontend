import React, { useRef, useState } from "react";
import { Fragment } from "react";
import classes from "./Auth.module.scss";
import Input from "../../UI/Input";
import { useToasts } from 'react-toast-notifications';
import { updateData } from "../../services/commonService";
import { useParams, useHistory } from "react-router-dom";

const Password = props => {
    let { email } = useParams();
    const isPasswordLength = (value) => value.trim().length > 10;
    const [isToggle, setIsToggle] = useState('Show Password');
    const { addToast } = useToasts();
    const passRef = useRef();
    const cpassRef = useRef();
    let history = useHistory();

    const showPassword = () => {
        var x = document.getElementById("pass");
        var y = document.getElementById("cpass");
        if (x.type === "password" && y.type === "password") {
            x.type = "text";
            y.type = "text";
            setIsToggle('Hide Password');
        } else {
            x.type = "password";
            y.type = "password";
            setIsToggle('Show Password');
        }
    };

    const resetPass = async (event) => {
        event.preventDefault();
        if (passRef.current.value != cpassRef.current.value) {
            addToast("Password does not match!", {
                appearance: 'error',
                autoDismiss: true,
                placement: "bottom-center"
            });
            return false;
        }
        if (!isPasswordLength(passRef.current.value)) {
            addToast("Password must be of 10 characters", {
                appearance: 'error',
                autoDismiss: true,
                placement: "bottom-center"
            });
            return false;
        }
        try {
            const info = {
                tableName: "users",
                obj: {
                    "pwd": passRef.current.value
                },
                key: "email",
                value: email
            }
            const response = await updateData(info);
            //console.log(response.data);
            addToast(`Congratulations! Your password for ${email} was successfully changed`, {
                appearance: 'success',
                autoDismiss: true,
                placement: "bottom-center"
            });
            history.replace("/ecommerce-frontend");
        } catch (error) {
            console.log(error);
            addToast(error.message, {
                appearance: 'error',
                autoDismiss: true,
                placement: "bottom-center"
            });
        }
    };

    return (
        <Fragment>
            <div className={classes.passContainer}>
                <div className={classes.overlay}>
                    <div className={classes.modal}>
                        <div>
                            <form className={classes.authForm}>
                                <h1>Reset password</h1>
                                <Input
                                    label="New Password"
                                    input={{
                                        type: "password",
                                        ref: passRef,
                                        id: "pass"
                                    }}
                                />
                                <Input
                                    label="Confirm Password"
                                    input={{
                                        type: "password",
                                        ref: cpassRef,
                                        id: "cpass"
                                    }}
                                />

                                <small className={classes.info} onClick={showPassword}>{isToggle}</small>

                                <button onClick={resetPass}>Confirm</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Password;