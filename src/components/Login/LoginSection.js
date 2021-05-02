import React from "react";
import { Fragment } from "react";
import classes from "./LoginSection.module.scss";
import Login from "./Login";
import configData from "../../config/config.json";

const LoginSection = props => {

  const Banner = () => (
    <section className={classes.banner}>
      <img src={`${configData.BASEURL}bannerDetails`} id="banner" height="413px" width="100%" />
    </section>
  )

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
        if (`${configData.BASEURL}bannerDetails`) {
          return (
            <Banner/>
          )
        }
      })()}
    </Fragment>
  );
};

export default LoginSection;
