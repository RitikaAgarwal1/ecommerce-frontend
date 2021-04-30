import React from "react";
import { Fragment } from "react";
import classes from "./LoginSection.module.css";
import Login from "./Login";

const LoginSection = props => {

  const bannerUrl = localStorage.getItem("banner");

  return (
    <Fragment>
      <section className={classes.login}>
        <div className={classes.image}>
          <img src="https://bridge214.qodeinteractive.com/wp-content/uploads/2018/04/home-slider-1.jpg" width="100%" height="784px" />
        </div>
        <div className={classes.loginbg}>
          <Login></Login>
        </div>
      </section>

      {(() => {
        if (bannerUrl) {
          return (
            <section className={classes.banner} bannerUrl={bannerUrl}>
              <img src={bannerUrl} id="banner" height="413px" width="100%" />
            </section>
          )
        }
      })()}
    </Fragment>
  );
};

export default LoginSection;
