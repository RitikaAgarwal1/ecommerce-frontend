import React from "react";
import classes from './Loader.module.scss';
import { Fragment } from "react";

const Loader = props => {
  return (
    <Fragment>
      <div className={classes.overlay}></div>
      <div className={classes.content}>
        <h2 data-text="Ecommerce">Ecommerce</h2>
      </div>
    </Fragment>
  )
};

export default Loader;