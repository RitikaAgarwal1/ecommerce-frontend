import React, { useState } from "react";
import Input from "../../UI/Input";
import classes from "./Admin.module.scss";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import configData from "../../config/config.json";
import { getBanner, deleteAdBanner } from "../../services/promotionService"

const Admin = props => {

  const { addToast } = useToasts();
  const [uploadPercentage, setUploadPercentage] = useState(0);

  let banner = "";
  let isBannerAvailable = null;

  const changeitem = (e) => {
    !banner ? banner = e.target.files[0] : banner = "";
    if (banner) {
      banner.type == "image/png" || banner.type == "image/jpeg" ? banner = e.target.files[0] : banner = "";
      getBannerDetails();
    }
    console.log(banner);
  }

  const getBannerDetails = async () => {
    try {
      getBanner().then(data => {
        console.log(data);
        if (data.message) {
          isBannerAvailable = data.message;
          console.log(isBannerAvailable);
        }
        return data;
      });
    }
    catch (error) {
      console.log(error);
    }
  };

  // const uploadBanner = () => {
  //   let data = new FormData();
  //   data.append("file", banner);

  //   const option = {
  //     onUploadProgress: ProgressEvent => {
  //       const {loaded, total} = ProgressEvent;
  //       let percent = Math.floor((loaded * 100) / total);

  //       if (percent < 100){
  //         setUploadPercentage(percent);
  //       }
  //     }
  //   };
  //   axios.post(`${configData.BASEURL}addBanner`, data, option).then(res => {
  //     console.log('res of upload', res);
  //     setUploadPercentage(100);

  //   }).catch(err => {
  //     console.log(err);
  //     setUploadPercentage(0);
  //   })
  // }

  const uploadBanner = async () => {
    try {
      if (banner) {
        if (isBannerAvailable) {
          let data = new FormData();
          data.append("file", banner);
          const option = {
            onUploadProgress: ProgressEvent => {
              const { loaded, total } = ProgressEvent;
              let percent = Math.floor((loaded * 100) / total);

              if (percent < 100) {
                setUploadPercentage(percent);
              }
            }
          };
          axios.post(`${configData.BASEURL}addBanner`, data, option).then(res => {
            console.log('res of upload', res);
            setUploadPercentage(100);

          }).catch(err => {
            console.log(err);
            setUploadPercentage(0);
          });
          addToast("Advertisement successfully added to the Landing Page!", {
            appearance: 'success',
            autoDismiss: true,
            placement: "bottom-center"
          });
        } else {
          addToast("Please delete existing image first!", {
            appearance: 'error',
            autoDismiss: true,
            placement: "bottom-center"
          });
        }
      } else if (!banner || banner == undefined) {
        addToast("Please select a valid file type", {
          appearance: 'error',
          autoDismiss: true,
          placement: "bottom-center"
        });
      }
    } catch (err) {
      console.log(err);
      setUploadPercentage(0);
    }
  }

  const deleteBanner = async () => {
    try {
      deleteAdBanner().then(data => {
        console.log(data);
        if (data.message === "There is no image for deleting!") {
          addToast(data.message, {
            appearance: 'info',
            autoDismiss: true,
            placement: "bottom-center"
          });
        } else if (data.message === "Banner successfully deleted!") {
          addToast(data.message, {
            appearance: 'success',
            autoDismiss: true,
            placement: "bottom-center"
          });
        }
        return data;
      });
    } catch (error) {
      console.log(error);
    }
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
          {uploadPercentage}

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
