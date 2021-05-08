import React from "react";
import Input from "../../UI/Input";
import { Fragment } from "react";
import Modal from "../../UI/Modal";
import classes from "./Auth.module.scss";

const Auth = props => {
    console.log('auth', props.modalContent);

    const authUser = (event) => {
        event.preventDefault();
        console.log();
    };

    return (
        <Modal>
            {props.modalContent === 'REGISTER' &&
                <form onSubmit={(event) => authUser}>
                    <h1>Register</h1>
                    <Input
                        label="First Name"
                        input={{
                        type: "text"
                        }}
                    />
                    <Input
                        label="Last Name"
                        input={{
                        type: "text"
                        }}
                    />
                    <Input
                        label="Email Address"
                        input={{
                        type: "email"
                        }}
                    />
                    <Input
                        label="Password"
                        input={{
                        type: "password"
                        }}
                    />
                    <Input
                        label="Phone Number"
                        input={{
                        type: "number",
                        placeholder: "+91",
                        max: "10",
                        min: "9"
                        }}
                    />
                    <Input
                        label="Address"
                        input={{
                        type: "text"
                        }}
                    />
                    <Input
                        label="Registered Company Name"
                        input={{
                        type: "text"
                        }}
                    />
                    <div className={classes.btn}>
                        <button onClick={props.onClose}>Cancel</button>
                        <button>Submit</button>
                    </div>
                </form>
            }

            {/* for sigin in */}

            {props.modalContent !== 'REGISTER' &&
                <form onSubmit={authUser}>
                    <h1>Sign in as <span className={classes.lower}>{props.modalContent}</span></h1>
                    <Input
                        label="Email Address"
                        input={{
                        type: "email"
                        }}
                    />
                    <Input
                        label="Password"
                        input={{
                        type: "password"
                        }}
                    />
                    <div className={classes.btn}>
                        <button onClick={props.onClose}>Cancel</button>
                        <button>Sign in</button>
                    </div>
                </form>
            }

        </Modal>
    )

}

export default Auth;