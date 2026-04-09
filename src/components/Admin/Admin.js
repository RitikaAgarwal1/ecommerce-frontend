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
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { registration } from "../../services/authService";
import formattedDate from "../../Utils/Utils";
import Loader from "../../Loader/Loader";
import ReactPaginate from 'react-paginate';
import ReactTooltip from "react-tooltip";

const Admin = props => {

  const { addToast } = useToasts();
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [admins, setAdmins] = useState(null);
  const [totalAdmins, setTotalAdmins] = useState(null);
  const [isLoader, setIsLoader] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [index, setIndex] = useState(0);
  const [showNext, setShowNext] = useState(true);
  const [showPrev, setShowPrev] = useState(false);
  const [size, setSize] = useState(0);
  const [orderByRequest, setOrder] = useState('');
  const [check, setCheck] = useState(false);

  useEffect(() => {
    fetchUsers('user_role', 'ADMIN');
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
    } else {
      await axios.post(`${configData.BASEURL}register`, data).then(res => {
        location.reload();
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
      window.addEventListener('load', checkAll, false);
      setIsLoader(true);
      setCurrentPage(1);
      const listArray = [];
      setShowNext(true);
      setShowPrev(false);
      const result = await getUserDetailsByKey(key, value);
      setTotalAdmins(result);
      //console.log(result);
      const total = Math.max(Math.ceil(result.length / 5), 1);
      setTotalPages(total);
      result.sort(dynamicSort("company_name", 'ASC'));
      for (let i = 0; i < result.length; i++) {
        listArray.push(result[i]);
        if (listArray.length == 5) {
          //console.log(listArray);
          setIndex(5);
          setIsLoader(false);
          setAdmins(listArray);
          return false;
        }
      }
      sortAdmins();
      setAdmins(result);
      setIsLoader(false);
    } catch (error) {
      console.log(error);
      setIsLoader(false);
    }
  }

  const next = () => {
    window.addEventListener('load', checkAll, false);
    if (currentPage != totalPages) {
      const pagenumber = currentPage + 1;
      setCurrentPage(pagenumber);
    }
    if (totalPages == currentPage + 1) {
      setIndex(totalAdmins.length);
      setShowNext(false);
      setShowPrev(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAdmins([]);
    const listArray = [];
    let i;
    totalAdmins.sort(dynamicSort('company_name', orderByRequest));
    for (i = index; i < totalAdmins.length; i++) {
      listArray.push(totalAdmins[i]);
      if (listArray.length == 5) {
        //console.log(listArray);
        setIndex(i + 1);
        setAdmins(listArray);
        return false;
      }
    }
    //console.log(listArray);
    setAdmins(listArray);
    const pagenumber = currentPage + 1;
    setCurrentPage(pagenumber);
    setSize(listArray.length);
  }

  const prev = () => {
    window.addEventListener('load', checkAll, false);
    if (currentPage >= 2) {
      const pagenumber = currentPage - 1;
      setCurrentPage(pagenumber);
    }
    if (currentPage <= 2) {
      setShowPrev(false);
    }
    setShowNext(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAdmins([]);
    const listArray = [];
    let i;
    totalAdmins.sort(dynamicSort('company_name', orderByRequest));
    for (i = index - (size + 1); i >= 0; i--) {
      listArray.push(totalAdmins[i]);
      if (listArray.length == 5) {
        //console.log(listArray);
        setAdmins(listArray.reverse());
        setShowPrev(false);
        if (i == 0) {
          setIndex(5);
        }
        return false;
      }
      setIndex(i);
    }
    //console.log(listArray);
    setAdmins(listArray.reverse());
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

  const dynamicSort = (property, order) => {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      if (order == 'ASC' || null) {
        var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
        return result * sortOrder;

      } else if (order == 'DESC') {
        var result = (a[property].toLowerCase() > b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() < b[property].toLowerCase()) ? 1 : 0;
        return result * sortOrder;
      }

    }
  }

  const sortAdmins = (event) => {
    setIsLoader(true);
    setCurrentPage(1);
    setShowNext(true);
    setShowPrev(false);
    const order = event.target.value;
    setOrder(order);
    totalAdmins.sort(dynamicSort("company_name", order));
    const listArray = [];
    for (let i = 0; i < totalAdmins.length; i++) {
      listArray.push(totalAdmins[i]);
      if (listArray.length == 5) {
        setIndex(5);
        setIsLoader(false);
        setAdmins(listArray);
        return listArray;
      }
    }
  }

  const filterData = (event) => {
    if (!totalAdmins) {
      addToast("There is no data to search from", {
        appearance: 'error',
        autoDismiss: true,
        placement: "bottom-center"
      });
    } else {
      let adminArray = totalAdmins.filter(x => x.company_name.toLowerCase().includes(event.target.value.toLowerCase()));

      if (event.target.value !== "") {
        setAdmins(adminArray);
        setShowPrev(false);
        setShowNext(false);
      } else if (event.target.value == "") {
        let listArray = [];
        for (let i = 0; i < totalAdmins.length; i++) {
          listArray.push(totalAdmins[i]);
          if (listArray.length == 5) {
            setIndex(5);
            setIsLoader(false);
            setShowNext(true);
            setAdmins(listArray);
            setCurrentPage(1);
            return listArray;
          }
        }
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

  const deleteBulk = async () => {
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
                    <button onClick={() => deleteUserById(admin.id)}>Delete</button>
                  </span>
                </div>
              </Fragment>
            })};
            <div className={classes.pagination}>
            {showPrev &&
              <span onClick={prev} className={classes.navigate}>Previous | </span>
            }
             Current Page: {currentPage} | Total Pages: {totalPages}

            {showNext &&
              <span onClick={next} className={classes.navigate}> | Next </span>
            }
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
