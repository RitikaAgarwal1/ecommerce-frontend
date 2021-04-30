import React, { useState } from "react";
import Input from "../../UI/Input";
import classes from "./Admin.module.css";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import configData from "../../config/config.json";

const Admin = props => {

  const { addToast } = useToasts();

  let banner;

  const changeitem = (e) => {
    !banner ? banner = e.target.files[0] : banner = "";
    if (banner) {
      banner.type == "image/png" || banner.type == "image/jpeg" ? banner = e.target.files[0] : banner = "";
    }
    console.log(banner);
  }

  const getBanner = async () => {
    try {
      const info = {
        method: "get",
        url: `${configData.BASEURL}bannerDetails`
      }

      let response = await axios(info);
      console.log(response);

    } catch (error) {
      console.log(error);
    }

  };

  const uploadBanner = () => {
    getBanner();
    // if (banner) {
    //   if (!localStorage.getItem("banner")) {
    //     const reader = new FileReader();
    //     reader.addEventListener("load", () => {
    //       localStorage.setItem("banner", reader.result);
    //     });
    //     reader.readAsDataURL(banner);
    //     addToast("Advertisement successfully added to the Landing Page!", {
    //       appearance: 'success',
    //       autoDismiss: true,
    //       placement:"bottom-center"
    //     });
    //   } else {
    //     addToast("Please delete existing image first!", {
    //       appearance: 'error',
    //       autoDismiss: true,
    //       placement:"bottom-center"
    //     });
    //   }
    // } else if (!banner || banner == undefined) {
    //   addToast("Please select a valid file type", {
    //     appearance: 'error',
    //     autoDismiss: true,
    //     placement:"bottom-center"
    //   });
    // }


  }

  const deleteBanner = () => {
    localStorage.removeItem("banner");
    addToast("Advertisement successfully deleted!", {
      appearance: 'success',
      autoDismiss: true,
      placement: "bottom-center"
    });
  }

  return (
    <Fragment>
      <div className={classes.container}>
        <form className={classes.form}>
          <Input
            input={{
              type: "text",
              placeholder: "Company Name"
            }}
          />

          <Input
            input={{
              type: "text",
              placeholder: "Owner's First Name"
            }}
          />

          <Input
            input={{
              type: "text",
              placeholder: "Owner's Last Name"
            }}
          />

          <Input
            input={{
              type: "number",
              placeholder: "Phone"
            }}
          />

          <Input
            input={{
              type: "email",
              placeholder: "Email"
            }}
          />

          <Input
            input={{
              type: "text",
              placeholder: "Address"
            }}
          />

          <Input
            label="Logo :"
            input={{
              type: "file",
              placeholder: "Logo"
            }}
          />

          <button>Submit</button>
        </form>

        <div className={classes.advertisement}>
          <label>Any Advertisement to display :</label>
          <input type="file" name="promotion" id="promotion" onChange={changeitem} />

          <button onClick={uploadBanner}>Upload</button>
          <button onClick={deleteBanner}>Delete</button>

        </div>

        <div className={classes.content}>
          <img
            src="https://cdn.logo.com/hotlink-ok/logo-social-sq.png"
            width="10%"
            height="10%"
          />
          <span>
            <p className={classes.title}>Company Name</p>
            <p>First Last</p>
            <small>Phone</small>
            <small>Email</small>
            <small>Address</small>
            <small>created on</small>
          </span>

          <span className={classes.btns}>
            <Link to="/adminProfile/company1">
              <button>Edit</button>
            </Link>
            <button>Delete</button>
          </span>
        </div>

        <div className={classes.content}>
          <img
            src="https://cdn.logo.com/hotlink-ok/logo-social-sq.png"
            width="10%"
            height="10%"
          />
          <span>
            <p className={classes.title}>Company Name</p>
            <p>First Last</p>
            <small>Phone</small>
            <small>Email</small>
            <small>Address</small>
            <small>created on</small>
          </span>

          <span className={classes.btns}>
            <Link to="/adminProfile/company2">
              <button>Edit</button>
            </Link>
            <button>Delete</button>
          </span>
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
