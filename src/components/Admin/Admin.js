import React, { useState, useRef, useEffect } from "react";
import Input from "../../UI/Input";
import classes from "./Admin.module.scss";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import configData from "../../config/config.json";
import { getUserDetailsByKey, deleteUser } from "../../services/authService";
import { getBanner, deleteAdBanner, addBanner } from "../../services/promotionService";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { registration } from "../../services/authService";
import formattedDate from "../../Utils/Utils";
import Loader from "../../Loader/Loader";
import ReactPaginate from 'react-paginate';

const Admin = props => {

  const { addToast } = useToasts();
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [admins, setAdmins] = useState(null);
  const [isLoader, setIsLoader] = useState(true);
  let count = 0;

  useEffect(() => {
    fetchUsers('user_role', 'ADMIN');
  }, [count]);

  let banner = "";
  let avatar = "";
  let isBannerAvailable = null;
  let data = new FormData();

  const isEmpty = (value) => value.trim() === '';
  const isPhone = (value) => value.trim().length === 10;
  const isEmail = (value) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);

  const emailRef = useRef();
  const fnameRef = useRef();
  const lnameRef = useRef();
  const addressRef = useRef();
  const phoneRef = useRef();
  const cnameRef = useRef();

  const addAdmin = async (event) => {
    event.preventDefault();
    setIsLoader(true);

    const register = {
      first_name: fnameRef.current.value,
      last_name: lnameRef.current.value,
      email: emailRef.current.value,
      pwd: `${fnameRef.current.value}@${cnameRef.current.value}123`,
      phone: phoneRef.current.value,
      address: addressRef.current.value,
      company_name: cnameRef.current.value,
      pic: avatar
    }
    data.append("first_name", register.first_name);
    data.append("last_name", register.last_name);
    data.append("email", register.email);
    data.append("pwd", register.pwd);
    data.append("phone", register.phone);
    data.append("address", register.address);
    data.append("user_role", 'ADMIN');
    data.append("company_name", register.company_name);
    data.append("pic", register.pic);

    if (!register.pic) {
      addToast("Please upload the pic again if already uploaded", {
        appearance: 'error',
        autoDismiss: true,
        placement: "bottom-center"
      });
    }

    if (isEmpty(register.email || register.first_name || register.last_name || register.phone || register.address || register.company_name) || !isPhone(register.phone) || !isEmail(register.email)) {
      addToast("Data is not properly filled up!", {
        appearance: 'error',
        autoDismiss: true,
        placement: "bottom-center"
      });
    } else {
      await axios.post(`${configData.BASEURL}register`, data).then(res => {
        setIsLoader(false);
        console.log('register', res);
        addToast("Successfully registered", {
          appearance: 'success',
          autoDismiss: true,
          placement: "bottom-center"
        });

        fetchUsers('user_role', 'ADMIN');

      }).catch(err => {
        console.log(err);
        setIsLoader(false);
        addToast("Data is not properly filled up!", {
          appearance: 'error',
          autoDismiss: true,
          placement: "bottom-center"
        });
      });
    }
  }

  const adminChangeHandler = (e) => {
    avatar = e.target.files[0];
  }

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
      setIsLoader(true);
      deleteAdBanner().then(data => {
        console.log(data);
        if (data.message === "There is no image for deleting!") {
          setIsLoader(false);
          addToast(data.message, {
            appearance: 'info',
            autoDismiss: true,
            placement: "bottom-center"
          });
        } else if (data.message === "Banner successfully deleted!") {
          setIsLoader(false);
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
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
        placement: "bottom-center"
      });
    }
  }

  const fetchUsers = async (key, value) => {
    try {
      const result = await getUserDetailsByKey(key, value);
      console.log(result);
      setAdmins(result);
      setIsLoader(false);
    } catch (error) {
      console.log(error);
      setIsLoader(false);
    }
  }

  const deleteUserById = async (id) => {
    try {
      setIsLoader(true);
      const result = await deleteUser(id);
      console.log(result);
      setIsLoader(false);
      addToast("Successfully deleted", {
        appearance: 'success',
        autoDismiss: true,
        placement: "bottom-center"
      });
      fetchUsers('user_role', 'ADMIN');
    } catch (error) {
      console.log(error);
      setIsLoader(false);
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
        placement: "bottom-center"
      });
    }
  }

  return (
    <Fragment>
      {isLoader && <Loader />}
      <div className={classes.container}>
        <form className={classes.form}>
          <Input
            input={{
              type: "text",
              placeholder: "Company Name",
              ref: cnameRef
            }}
          />

          <Input
            input={{
              type: "text",
              placeholder: "Owner's First Name",
              ref: fnameRef
            }}
          />

          <Input
            input={{
              type: "text",
              placeholder: "Owner's Last Name",
              ref: lnameRef
            }}
          />

          <Input
            input={{
              type: "number",
              placeholder: "Phone",
              ref: phoneRef
            }}
          />

          <Input
            input={{
              type: "email",
              placeholder: "Email",
              ref: emailRef
            }}
          />

          <Input
            input={{
              type: "text",
              placeholder: "Address",
              ref: addressRef
            }}
          />

          <Input
            label="Logo :"
            input={{
              type: "file",
              placeholder: "Logo",
              onChange: adminChangeHandler
            }}
          />

          <button onClick={addAdmin}>Submit</button>
        </form>

        <div className={classes.advertisement}>
          <label>Any Advertisement to display :</label>
          <input type="file" name="promotion" id="promotion" onChange={changeitem} />

          <button onClick={uploadBanner}>Upload</button>
          <button onClick={deleteBanner}>Delete</button>

          {/* <CircularProgressbar value={uploadPercentage} text={`${uploadPercentage}%`} /> */}

        </div>

        <div>
          {!admins ? <h1>No Admins</h1> :
            admins.map((admin, index) => {
              return <Fragment>
                <div className={classes.content} key={admin.uuid}>
                  <img
                    src={`${configData.BASEURL}userImageByUuid?field=uuid&value=${admin.uuid}`}
                    width="10%"
                    height="10%"
                  />
                  <span>
                    <p className={classes.title}>{admin.company_name}</p>
                    <p className={classes.capital}>{admin.first_name} {admin.last_name}</p>
                    <small className={classes.capital}>{admin.phone}</small>
                    <small>{admin.email}</small>
                    <small className={classes.capital}>{admin.address}</small>
                    <small>{formattedDate(admin.created_on)}</small>
                  </span>

                  <span className={classes.btns}>
                    <Link to={`/adminProfile/${admin.company_name}`}>
                      <button>Edit</button>
                    </Link>
                    <button onClick={() => deleteUserById(admin.id)}>Delete</button>
                  </span>
                </div>
              </Fragment>
            })};
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
