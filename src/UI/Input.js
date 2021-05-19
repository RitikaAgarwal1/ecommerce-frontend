import React from "react";
import classes from './Input.module.scss';

const Input = props => {
  return <div>
  <label htmlFor={props.input.id}>{props.label}</label>
  <input {...props.input}/>
  </div>
};

export default Input;