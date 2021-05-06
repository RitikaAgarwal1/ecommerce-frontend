import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import classes from "./LoginSection.module.scss";
import Login from "./Login";
import configData from "../../config/config.json";
import { getBanner } from "../../services/promotionService";

const LoginSection = props => {

  const [promotion, setPromotion] = useState(0);

  useEffect(() => {
    getBannerDetails();
  });

  const getBannerDetails = async () => {
    try {
      getBanner().then(data => {
        data.message? setPromotion(false): setPromotion(true);
        console.log(data, promotion);
        return data;
      });
    }
    catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      {promotion}

      <section className={classes.login}>
        <div className={classes.image}>
          <img src="https://bridge214.qodeinteractive.com/wp-content/uploads/2018/04/home-slider-1.jpg" width="100%" height="784px" />
        </div>
        <div className={classes.loginbg}>
          <Login></Login>
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
