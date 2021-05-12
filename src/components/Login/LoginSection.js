import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import classes from "./LoginSection.module.scss";
import Login from "./Login";
import configData from "../../config/config.json";
import { getBanner } from "../../services/promotionService";
import Loader from "../../Loader/Loader";

const LoginSection = props => {

  const [promotion, setPromotion] = useState(0);
  const [isLoader, setIsLoader] = useState(true);

  useEffect(() => {
    getBannerDetails();
  });

  const isLogin = (status) => {
    console.log(status);
  };

  const getBannerDetails = async () => {
    try {
      getBanner().then(data => {
        data.message? setPromotion(false): setPromotion(true);
        console.log(data, promotion);
        setIsLoader(false);
        return data;
      });
    }
    catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      {isLoader && <Loader/>}
      <section className={classes.login}>
        <div className={classes.image}>
          <img src="https://bridge214.qodeinteractive.com/wp-content/uploads/2018/04/home-slider-1.jpg" width="100%" height="784px" />
        </div>
        <div className={classes.loginbg}>
          <Login status={isLogin}></Login>
        </div>
      </section>

      {!promotion ? (
        <section></section>
      ) : (
        <section className={classes.banner}>
          <img src={`${configData.BASEURL}bannerDetails`} id="banner" height="413px" width="100%" />
        </section>
      )}

    </Fragment >
  );
};

export default LoginSection;
