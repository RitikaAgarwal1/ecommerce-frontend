import React, {useState, useEffect} from "react";
import { Fragment } from "react";
import classes from "./LoginSection.module.scss";
import Auth from "../Auth/Auth";

const Login = props => {
const [authIsShown, setAuthIsShown] = useState(false);
const [modalContent, setModalContent] = useState('');
const [isLoginStatus, setIsLogin] = useState(false);

useEffect(() => {
  const loginTrue = localStorage.getItem('login')? true: false;
  setIsLogin(loginTrue);
});

const showAuthHandler = (modalContent) => {
  setAuthIsShown(true);
  setModalContent(modalContent);
};

const hideAuthHandler = () => {
  setAuthIsShown(false);
};


  return (
    <Fragment>
      {authIsShown && <Auth onClose={hideAuthHandler} modalContent={modalContent}/>}

      {!isLoginStatus && 
        <Fragment>
      <div className={classes.loginContainer}>
        <div className={classes.border}>
          <p>
            <span className={classes.letter}>L</span>
            <span className={classes.logintext}>ogin as<br/>
              <span className={classes.authBtn} onClick={(event) => showAuthHandler('USER')}>User</span>
                <br/>
                  ---or---
                <br/>
              <span className={classes.authBtn} onClick={(event) => showAuthHandler('ADMIN')}>Admin</span>
            </span>
          </p>
        </div>
      </div>
      <button onClick={(event) => showAuthHandler('REGISTER')}>Register</button>
      </Fragment>
      }
    </Fragment>
  );
};

export default Login;