import React from "react";
import Input from "../../UI/Input";
import classes from './Admin.module.scss';
import { Fragment } from "react";
import { useParams } from "react-router-dom";

const AdminDetail = () => {
  let {companyName} = useParams();

  console.log(companyName);

  return (
    <div>
      <h1>Admin Detail Page</h1>
      <p>{companyName}</p>
    </div>
  )};

export default AdminDetail;