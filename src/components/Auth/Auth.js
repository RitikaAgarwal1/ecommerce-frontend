import React, { useRef, useState } from "react";
import Input from "../../UI/Input";
import { Fragment } from "react";
import Modal from "../../UI/Modal";
import classes from "./Auth.module.scss";
import { useToasts } from 'react-toast-notifications';
import { login, registration } from "../../services/authService";
import axios from 'axios';
import configData from "../../config/config.json";

const Auth = props => {
    const { addToast } = useToasts();
    const [isAdmin, setIsAdmin] = useState('');
    const [isToggle, setIsToggle] = useState('Show Password');
    let data = new FormData();

    const isEmpty = (value) => value.trim() === '';
    const isPhone = (value) => value.trim().length === 10;
    const isEmail = (value) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);

    const emailRef = useRef();
    const passRef = useRef();
    const fnameRef = useRef();
    const lnameRef = useRef();
    const addressRef = useRef();
    const phoneRef = useRef();
    const cnameRef = useRef();
    const roleRef = useRef();

    const authUser = async (event) => {
        event.preventDefault();
        if (props.modalContent !== "REGISTER") {
            const signIn = {
                email: emailRef.current.value,
                password: passRef.current.value
            }

            if (isEmpty(signIn.email && signIn.password) || !isEmail(signIn.email)) {
                addToast("Email id or password is either empty or not valid!", {
                    appearance: 'error',
                    autoDismiss: true,
                    placement: "bottom-center"
                });
            } else {
                let err = "";
                let response;
                try {
                    response = await login(signIn);
                    let role = response.user.user_role == "SUPERADMIN" ? "ADMIN" : response.user.user_role;
                    if (role != props.modalContent) {
                        addToast('You are not registered as ' + props.modalContent.toLowerCase() + ' . Please signin as valid role.', {
                            appearance: 'error',
                            autoDismiss: true,
                            placement: "bottom-center"
                        });
                        setTimeout(() => {
                            props.onClose();
                        }, 1000);
                        return false;
                    }

                } catch (error) {
                    console.log(error);
                    err = error;
                }
                addToast(err ? err.message : "You are now successfully logged in", {
                    appearance: err ? 'error' : 'success',
                    autoDismiss: true,
                    placement: "bottom-center"
                });

                if (!err) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('userDetails', JSON.stringify(response.user));
                    localStorage.setItem('login', true);
                    setTimeout(() => {
                        props.onClose();
                        window.location.reload();
                    }, 1000);
                }

            }
        } else if (props.modalContent === "REGISTER") {
            const register = {
                first_name: fnameRef.current.value,
                last_name: lnameRef.current.value,
                email: emailRef.current.value,
                pwd: passRef.current.value,
                phone: phoneRef.current.value,
                address: addressRef.current.value,
                user_role: roleRef.current.value,
                company_name: cnameRef.current ? cnameRef.current.value : ''
            }

            data.append("first_name", register.first_name);
            data.append("last_name", register.last_name);
            data.append("email", register.email);
            data.append("pwd", register.pwd);
            data.append("phone", register.phone);
            data.append("address", register.address);
            data.append("user_role", 'ADMIN');
            data.append("company_name", register.company_name);

            if (isEmpty(register.email && register.pwd && register.first_name && register.last_name && register.phone && register.address && register.user_role) || !isPhone(register.phone) || !isEmail(register.email)) {
                addToast("Data is not properly filled up!", {
                    appearance: 'error',
                    autoDismiss: true,
                    placement: "bottom-center"
                });
            } else if (isAdmin == 'ADMIN' && isEmpty(register.email && register.pwd && register.first_name && register.last_name && register.phone && register.address && register.user_role && register.company_name) || !isPhone(register.phone) || !isEmail(register.email)) {
                addToast("Data is not properly filled up!", {
                    appearance: 'error',
                    autoDismiss: true,
                    placement: "bottom-center"
                });
            } else {
                await axios.post(`${configData.BASEURL}register`, data).then(res => {
                    addToast("You are successfully registered as " + (register.user_role).toLowerCase(), {
                        appearance: 'success',
                        autoDismiss: true,
                        placement: "bottom-center"
                    });

                    setTimeout(() => {
                        props.onClose();
                    }, 1000);

                }).catch(err => {
                    console.log(err.response);
                    addToast(err.response.data.Error, {
                        appearance: 'error',
                        autoDismiss: true,
                        placement: "bottom-center"
                    });
                });
            }
        }
    };

    const showPassword = (event) => {
        var x = document.getElementById("pass");
        if (x.type === "password") {
            x.type = "text";
            setIsToggle('Hide Password');
        } else {
            x.type = "password";
            setIsToggle('Show Password');
        }
    }

    return (
        <Modal>
            {props.modalContent === 'REGISTER' &&
                <form className={classes.authForm}>
                    <h1>Register</h1>
                    <Input
                        label="First Name"
                        input={{
                            type: "text",
                            ref: fnameRef
                        }}
                    />
                    <Input
                        label="Last Name"
                        input={{
                            type: "text",
                            ref: lnameRef
                        }}
                    />
                    <Input
                        label="Email Address"
                        input={{
                            type: "email",
                            ref: emailRef
                        }}
                    />
                    <Input
                        label="Password"
                        input={{
                            type: "password",
                            ref: passRef,
                            id: "pass"
                        }}
                    />
                    <small className={classes.info} onClick={showPassword}>{isToggle}</small>
                    <Input
                        label="Phone Number"
                        input={{
                            type: "number",
                            placeholder: "+91",
                            ref: phoneRef
                        }}
                    />
                    <Input
                        label="Address"
                        input={{
                            type: "text",
                            ref: addressRef
                        }}
                    />

                    <div>
                        <label>Register As</label>
                        <select name="register.user_role" ref={roleRef} onChange={(event) => {
                            const selectedRole = event.target.value;
                            setIsAdmin(selectedRole)
                        }}>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    {isAdmin === 'ADMIN' &&
                        <Input
                            label="Registered Company Name"
                            input={{
                                type: "text",
                                ref: cnameRef
                            }}
                        />
                    }

                    <div className={classes.btn}>
                        <button onClick={props.onClose}>Cancel</button>
                        <button onClick={authUser}>Submit</button>
                    </div>
                </form>
            }

            {/* for sigin in */}

            {
                props.modalContent !== 'REGISTER' &&
                <form className={classes.authForm}>
                    <h1>Sign in as <span className={classes.lower}>{props.modalContent}</span></h1>
                    <Input
                        label="Email Address"
                        input={{
                            type: "email",
                            ref: emailRef
                        }}
                    />
                    <Input
                        label="Password"
                        input={{
                            type: "password",
                            ref: passRef,
                            id: "pass"
                        }}
                    />
                    <small className={classes.info} onClick={showPassword}>{isToggle}</small>
                    <div className={classes.btn}>
                        <button onClick={props.onClose}>Cancel</button>
                        <button onClick={authUser} >Sign in</button>
                    </div>
                </form>
            }

        </Modal >
    )

}

export default Auth;