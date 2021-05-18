import React, { useState, useEffect } from "react";
import Input from "../../UI/Input";
import classes from './Admin.module.scss';
import { Fragment } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { getUserDetailsByKey } from "../../services/authService";
import configData from "../../config/config.json";
import formattedDate from "../../Utils/Utils";

const AdminDetail = () => {
  const [isLoader, setIsLoader] = useState(true);
  const [adminDetail, setAdminDetail] = useState([]);
  let { companyName } = useParams();

  useEffect(() => {
    fetchUsers('company_name', companyName);
  }, [0]);

  const fetchUsers = async (key, value) => {
    setIsLoader(true);
    const result = await getUserDetailsByKey(key, value);
    setAdminDetail(result[0]);
    console.log(adminDetail);
    setIsLoader(false);
  }

  return (
    <Fragment>
      {isLoader && <Loader />}
      <div key={adminDetail.uuid} className={classes.detailContainer}>
        <span className={classes.head}>
          <h1>{adminDetail.company_name}'s Profile</h1>
          <button>Update</button>
        </span>
        <div className={classes.detailContent}>
          <img src={`${configData.BASEURL}userImageByUuid?field=uuid&value=${adminDetail.uuid}`} width="300px" height="300px" />
          <form className={classes.editProfile}>
            <Input
              label="Company Name:"
              input={{
                type: "text",
                value: adminDetail.company_name
              }}
            />
            <Input
              label="First Name:"
              input={{
                type: "text",
                value: adminDetail.first_name
              }}
            />
            <Input
              label="Last Name:"
              input={{
                type: "text",
                value: adminDetail.last_name
              }}
            />
            <Input
              label="Phone Number:"
              input={{
                type: "number",
                value: adminDetail.phone
              }}
            />
            <Input
              label="Email Address:"
              input={{
                type: "email",
                value: adminDetail.email
              }}
            />
            <Input
              label="Address:"
              input={{
                type: "text",
                value: adminDetail.address
              }}
            />
            <Input
              label="Created On:"
              input={{
                type: "text",
                value: formattedDate(adminDetail.created_on),
                disabled: true
              }}
            />
          </form>
        </div>
      </div>
    </Fragment>
  )
};

export default AdminDetail;