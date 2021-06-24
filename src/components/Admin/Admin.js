import React, { useState, useRef, useEffect } from "react";
import Input from "../../UI/Input";
import classes from "./Admin.module.scss";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import configData from "../../config/config.json";
import { getUserDetailsByKey, deleteUser, deleteUsersBySelection } from "../../services/authService";
import { getBanner, deleteAdBanner, addBanner } from "../../services/promotionService";
import { filterFromData, sendEmail } from "../../services/commonService";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { registration } from "../../services/authService";
import {formattedDate, titleCase} from "../../Utils/Utils";
import Loader from "../../Loader/Loader";
import ReactTooltip from "react-tooltip";

const Admin = props => {

  const { addToast } = useToasts();
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [admins, setAdmins] = useState(null);
  const [isLoader, setIsLoader] = useState(true);
  const [offsetValue, setOffset] = useState(0);
  const [orderByRequest, setOrder] = useState('');
  const [check, setCheck] = useState(false);
  const [showLoadBtn, setLoadBtn] = useState(true);

  useEffect(() => {
    setOffset(0);
    fetchUsers('user_role', 'ADMIN', 'company_name', 'ASC', 5, 0);
  }, []);

  let banner = "";
  let avatar = "";
  let isBannerAvailable = null;
  let data = new FormData();
  let selectedData = [];

  const isEmpty = (value) => value.trim() === '';
  const isPhone = (value) => value.trim().length === 10;
  const isEmail = (value) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);

  const emailRef = useRef();
  const fnameRef = useRef();
  const lnameRef = useRef();
  const addressRef = useRef();
  const phoneRef = useRef();
  const cnameRef = useRef();

  const checkAll = () => {
    var inputs = document.querySelectorAll('.check');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].checked = true;
    }
  }

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
      setIsLoader(false);
    } else {
      await axios.post(`${configData.BASEURL}register`, data).then (async res => {
        const info = {
          content: `<div style="width: 100%;background:#eee;padding:1%;">
                      <div style="border: 2px solid #c2d44e;color:#646565;width: 650px;margin: auto;font-family: system-ui;">
                        <header style="background:#fff;">
                          <h1 style="text-align:center;font-weight: 100;margin: 0;background:#fff;">
                          <span style="color: #c2d44e;font-size:150%;">E</span>commerce</h1>
                        </header>
                        <section style="background: #c2d44e;padding:1%;">
                          <h1 style="font-size: 28px;border-bottom: 1px solid #646565;font-weight:100;">Congratulations!</h1>
                          <p style="font-size: 18px;">Hi ${titleCase(register.first_name)}, <br><br>
                          ${titleCase(register.company_name)} have successfully been registered to Ecommerce. 
                          <br>The auto generated password is ${register.pwd}. 
                          <br>You may change the password or get started.</p>
                          <div>
                            <button style="cursor: pointer;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border: none;padding: 6px 15px;margin-right: 1%;background: #eee;color: #333;"><a href="https://ritikaagarwal1.github.io/forgot-password/"${register.email} style="color: #333;    text-decoration: none;">Change Password</a></button>
                            <button style="cursor: pointer;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border: none;padding: 6px 15px;margin-right: 1%;background: #eee;"><a href="https://ritikaagarwal1.github.io/ecommerce-frontend" style="color: #333;    text-decoration: none;">Get Started</a></button>
                          </div>
                          <small><br>Thank You <br>Sent by Ecommerce</small>
                        </section>
                      </div>
                    </div>`,
          email: register.email,
          subject: `Welcome to Ecommerce! We have registered you`
        }
        const mailResponse = await sendEmail(info);
        //console.log(mailResponse);

        setIsLoader(false);
        addToast("Successfully registered", {
          appearance: 'success',
          autoDismiss: true,
          placement: "bottom-center"
        });

        fetchUsers('user_role', 'ADMIN', 'company_name', 'ASC', 5, 0);

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

  const uploadBanner = async (event) => {
    event.preventDefault();
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

  const deleteBanner = async (event) => {
    event.preventDefault();
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

  const fetchUsers = async (key, value, order_by, direction, limit, offset) => {
    try {
      const result = await getUserDetailsByKey(key, value, order_by, direction, limit, offset);
      result.length < 5 ? setLoadBtn(false) : setLoadBtn(true);
      setIsLoader(true);
      setAdmins(result);
      setOffset(5);
      //console.log(result);
      setIsLoader(false);
      window.addEventListener('load', checkAll, false);
    } catch (error) {
      console.log(error);
      setIsLoader(false);
    }
  }

  const loadmore = async () => {
    setIsLoader(true);
    let newArr = admins;
    try {
      const result = await getUserDetailsByKey('user_role', 'ADMIN', 'company_name', orderByRequest, 5, offsetValue);
      result.length < 5 ? setLoadBtn(false) : setLoadBtn(true);
      result.forEach((el) => {
        newArr.push(el);
      });
      setAdmins(newArr);
      //console.log(result);
      const o = offsetValue;
      setOffset(o + 5);
      setIsLoader(false);
      window.addEventListener('load', checkAll, false);
    } catch (err) {
      console.log(err);
      setIsLoader(false);
    }
  }

  const deleteUserById = async (event, id) => {
    event.preventDefault();
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

  // const dynamicSort = (property, order) => {
  //   var sortOrder = 1;
  //   if (property[0] === "-") {
  //     sortOrder = -1;
  //     property = property.substr(1);
  //   }
  //   return function (a, b) {
  //     /* next line works with strings and numbers, 
  //      * and you may want to customize it to your needs
  //      */
  //     if (order == 'ASC' || null) {
  //       var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
  //       return result * sortOrder;

  //     } else if (order == 'DESC') {
  //       var result = (a[property].toLowerCase() > b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() < b[property].toLowerCase()) ? 1 : 0;
  //       return result * sortOrder;
  //     }

  //   }
  // }

  const sortAdmins = (event) => {
    const order = event.target.value;
    fetchUsers('user_role', 'ADMIN', 'company_name', order, 5, 0);
    setOrder(order);
  }

  const filterData = async (event) => {
    if (!admins) {
      addToast("There is no data to search from", {
        appearance: 'error',
        autoDismiss: true,
        placement: "bottom-center"
      });
    } else {
      try {
        let result = await filterFromData('users', event.target.value.toLowerCase());
        if (event.target.value !== "") {
          setAdmins(result);
        } else if (event.target.value == "") {
          fetchUsers('user_role', 'ADMIN', 'company_name', 'ASC', 5, 0);
        }
        //console.log(result);
      } catch (err) {
        console.log(err);
      }
    }
  }

  const deleteSelectedUsers = (e, id) => {
    if (e.target.checked) {
      if (selectedData.indexOf(id) == -1) {
        selectedData.push(id);
      }
    } else if (!e.target.checked) {
      const index = selectedData.indexOf(id);
      selectedData.splice(index, 1);
    }
  }

  const deleteBulk = async (event) => {
    event.preventDefault();
    try {
      window.addEventListener('load', checkAll, false);
      if (selectedData.length == 0) {
        addToast("No Admin Selected", {
          appearance: 'error',
          autoDismiss: true,
          placement: "bottom-center"
        });
      } else {
        const result = await deleteUsersBySelection(selectedData);
        //console.log(result);
        addToast(result.message, {
          appearance: 'success',
          autoDismiss: true,
          placement: "bottom-center"
        });
        fetchUsers('user_role', 'ADMIN');
      }
    } catch (err) {
      console.log(err);
    }
  }

  const selectAll = () => {
    selectedData = [];
    const ele = document.getElementsByName('check');
    for (let i = 0; i < ele.length; i++) {
      if (ele[i].type == 'checkbox') {
        if (!check) {
          ele[i].checked = true;
          setCheck(true);
          selectedData.push(admins[i].id);
        } else {
          ele[i].checked = false;
          setCheck(false);
        }
      }
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

        <div className={classes.sortDiv}>

          <Input
            label="Filter By "
            input={{
              type: "text",
              placeholder: "Company Name",
              onChange: filterData
            }}
          />

          <span>
            <label>Sort By: </label>
            <select onChange={sortAdmins}>
              <option value="ASC">A - Z</option>
              <option value="DESC">Z - A</option>
            </select>

            <i className="fa fa-check-square-o" aria-hidden="true" onClick={selectAll} data-tip data-for="selectTip" />
            <ReactTooltip id="selectTip" place="top" effect="solid">
              Select / Deselect All
              </ReactTooltip>

            <i className="fa fa-trash-o" aria-hidden="true" onClick={deleteBulk} data-tip data-for="deleteTip" />
            <ReactTooltip id="deleteTip" place="top" effect="solid">
              Deleted Selected Admins
              </ReactTooltip>
          </span>
        </div>

        <div>
          {!admins ? <h1>No Admins</h1> :
            admins.map((admin, index) => {
              return <Fragment key={admin.uuid}>
                <div className={classes.content}>
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
                    <div className={classes.selection}>
                      <Input
                        input={{
                          type: "checkbox",
                          name: "check",
                          onChange: (e) => deleteSelectedUsers(e, admin.id)
                        }}
                      />
                      <span>Select</span>
                    </div>

                    <Link to={`/adminProfile/${admin.id}`}>
                      <button>Edit / Detail</button>
                    </Link>
                    <button onClick={(event) => deleteUserById(event, admin.id)}>Delete</button>
                  </span>
                </div>
              </Fragment>
            })};
            {showLoadBtn &&
            <button onClick={loadmore}>Load More Admin...</button>
          }
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
