import React, { useRef, useState } from "react";
import Input from "../../UI/Input";
import { useHistory } from "react-router-dom";
import Modal from "../../UI/Modal";
import classes from "./Auth.module.scss";
import { useToasts } from 'react-toast-notifications';
import { login, registration, getUserDetailsByKey } from "../../services/authService";
import { sendEmail } from "../../services/commonService";
import axios from 'axios';
import configData from "../../config/config.json";
import { titleCase } from "../../Utils/Utils";

const Auth = props => {
    const { addToast } = useToasts();
    const [isAdmin, setIsAdmin] = useState('');
    const [isToggle, setIsToggle] = useState('Show Password');
    const [isForgot, setIsForgot] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    let data = new FormData();
    const history = useHistory();

    const isEmpty = (value) => value.trim() === '';
    const isPhone = (value) => value.trim().length === 10;
    const isEmail = (value) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
    const isPasswordLength = (value) => value.trim().length > 10;

    const emailRef = useRef();
    const passRef = useRef();
    const fnameRef = useRef();
    const lnameRef = useRef();
    const addressRef = useRef();
    const phoneRef = useRef();
    const cnameRef = useRef();
    const roleRef = useRef();
    const femailRef = useRef();

    const emailVerification = async (token) => {
        const info = {
            content: `<div style="width: 100%;background:#eee;padding:1%;">
                        <div style="border: 2px solid #c2d44e;color:#646565;width: 650px;margin: auto;font-family: system-ui;">
                          <header style="background:#fff;">
                            <h1 style="text-align:center;font-weight: 100;margin: 0;background:#fff;">
                            <span style="color: #c2d44e;font-size:150%;">E</span>commerce</h1>
                          </header>
                          <section style="background: #c2d44e;padding:1%;">
                            <h1 style="font-size: 28px;border-bottom: 1px solid #646565;font-weight:100;">Let's verify your email id</h1>
                            <p style="font-size: 18px;">Hey ${titleCase(fnameRef.current.value)}, <br><br>
                            A sign in attempt requires further verification because we did not recognize your email id ${emailRef.current.value}. To complete the sign in, please click on the button.
                            <div>
                              <button style="cursor: pointer;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border: none;padding: 6px 15px;margin-right: 1%;background: #eee;color: #333;"><a href="https://ritikaagarwal1.github.io/ecommerce-frontend/#/verify-email?token=${token}
                              " style="color: #333;text-decoration: none;">Verify email address</a></button>
                            </div>
                            <small><br>Thank You <br>Sent by Ecommerce</small>
                          </section>
                        </div>
                      </div>`,
            email: emailRef.current.value,
            subject: `Please verify your email id`
        }
        const mailResponse = await sendEmail(info);
    };

    const authUser = async (event) => {
        event.preventDefault();
        if (props.modalContent !== "REGISTER") {
            const signIn = {
                email: emailRef.current.value,
                password: passRef.current.value
            }

            if (isEmpty(signIn.email && signIn.password) || !isEmail(signIn.email) || !isPasswordLength(signIn.password)) {
                addToast("Email id or password is either empty or not valid!", {
                    appearance: 'error',
                    autoDismiss: true,
                    placement: "bottom-center"
                });
            } else {
                let err = "";
                let response;
                try {
                    setIsLoader(true);
                    response = await login(signIn);
                    setIsLoader(false);
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
                    err = error.response.data.message;
                    setIsLoader(false);
                }
                addToast(err ? err : "You are now successfully logged in", {
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
                company_name: cnameRef.current ? cnameRef.current.value : 'none'
            }

            data.append("first_name", register.first_name);
            data.append("last_name", register.last_name);
            data.append("email", register.email);
            data.append("pwd", register.pwd);
            data.append("phone", register.phone);
            data.append("address", register.address);
            data.append("user_role", register.user_role);
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
                setIsLoader(true);
                await axios.post(`${configData.BASEURL}register`, data).then(res => {
                    addToast("You are successfully registered as " + (register.user_role).toLowerCase() + "." + "Please check you email for further steps.", {
                        appearance: 'success',
                        autoDismiss: true,
                        placement: "bottom-center"
                    });

                    setIsLoader(false);
                    emailVerification(res.data.data.verify_token);

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
                    setIsLoader(false);
                });
            }
        }
    };

    const showPassword = () => {
        var x = document.getElementById("pass");
        if (x.type === "password") {
            x.type = "text";
            setIsToggle('Hide Password');
        } else {
            x.type = "password";
            setIsToggle('Show Password');
        }
    };

    const forgotPass = async (event) => {
        event.preventDefault();
        const response = await getUserDetailsByKey('email', femailRef.current.value);
        if (response.length == 0) {
            addToast("Sorry! This email id is not registered", {
                appearance: 'error',
                autoDismiss: true,
                placement: "bottom-center"
            });
            return false;
        }
        if (response[0].user_role == 'SUPERADMIN') response[0].user_role = 'ADMIN';
        if (props.modalContent != response[0].user_role) {
            addToast("Please request from correct user role", {
                appearance: 'error',
                autoDismiss: true,
                placement: "bottom-center"
            });
            return false;
        }
        let path = `/forgot-password/${response[0].email}`;
        history.replace(path);
    };

    const triggerEvent = (event) => {
        if (event.keyCode == 13) {
            console.log(event.target.value, 'trigger');
            authUser(event);
        }
    };

    return (
        <Modal>
            {isLoader && <div className={classes.spinner}><i className="fa fa-spinner fa-pulse" aria-hidden="true" data-tip data-for="profileTip" /></div>}

            {props.modalContent === 'REGISTER' && !isForgot &&
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
                        <button type="button" onClick={props.onClose}>Cancel</button>
                        <button onClick={authUser}>Submit</button>
                    </div>
                </form>
            }

            {/* for sigin in */}

            {props.modalContent !== 'REGISTER' && !isForgot &&
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
                            id: "pass",
                            onKeyUp: (event) => triggerEvent(event)
                        }}
                    />
                    <small className={classes.info} onClick={showPassword}>{isToggle}</small>
                    <div className={classes.btn}>
                        <button type="button" onClick={props.onClose}>Cancel</button>
                        <button onClick={authUser} >Sign in</button>
                    </div>
                    <small className={classes.fpwd} onClick={() => setIsForgot(true)}>Change / Forgot Password</small>
                </form>
            }

            {props.modalContent !== 'REGISTER' && isForgot &&
                <form className={classes.authForm}>
                    <h1>Forgot your password?</h1>
                    <Input
                        label="Email Address"
                        input={{
                            type: "email",
                            ref: femailRef
                        }}
                    />
                    <div className={classes.btn}>
                        <button onClick={() => setIsForgot(false)}>Back</button>
                        <button type="button" onClick={props.onClose}>Cancel</button>
                        <button onClick={forgotPass}>Change Password</button>
                    </div>
                </form>
            }
        </Modal >
    )

}

export default Auth;