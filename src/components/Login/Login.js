import React from "react";
import { Fragment } from "react";
import classes from "./LoginSection.module.css";

const Login = props => {
  return (
    <Fragment>
      <div className={classes.loginContainer}>
        <div className={classes.border}>
          <p>
            <span className={classes.letter}>L</span>
            <span className={classes.logintext}>ogin as<br/>User<br/>---or---<br/>Admin</span>
          </p>
        </div>
      </div>

      <button>Register</button>
    </Fragment>
  );
};

export default Login;