import React, { useState, useEffect, useRef } from "react";
import Input from "../../UI/Input";
import classes from './Admin.module.scss';
import { Fragment } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { getUserDetailsByKey } from "../../services/authService";
import { getProductsBySellerid, deleteProductsBySelection } from "../../services/productService";
import configData from "../../config/config.json";
import {formattedDate} from "../../Utils/Utils";
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import ReactTooltip from "react-tooltip";
import emailjs from 'emailjs-com';

const AdminDetail = () => {
  const { addToast } = useToasts();
  const isEmpty = (value) => value.trim() === '';
  const [isLoader, setIsLoader] = useState(true);
  const [adminDetail, setAdminDetail] = useState({});
  const [productDetail, setAdminProduct] = useState([]);
  const [check, setCheck] = useState(false);
  const [isGrid, setIsGrid] = useState(true);
  let { id } = useParams();
  let data = new FormData();
  let image = "";
  let selectedData = [];

  const titleRef = useRef();
  const priceRef = useRef();
  const qtyRef = useRef();
  const avlRef = useRef();
  const colorRef = useRef();
  const offerRef = useRef();
  const spriceRef = useRef();
  const categoryRef = useRef();
  const detailRef = useRef();
  const sizeRef = useRef();

  const emailRef = useRef();
  const fnameRef = useRef();
  const lnameRef = useRef();
  const addressRef = useRef();
  const phoneRef = useRef();
  const cnameRef = useRef();
  const dateRef = useRef();


  useEffect(() => {
    fetchUsers('id', id);
  }, [0]);

  const checkAll = () => {
    var inputs = document.querySelectorAll('.check');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].checked = true;
    }
  }

  const fetchUsers = async (key, value) => {
    window.addEventListener('load', checkAll, false);
    const result = await getUserDetailsByKey(key, value);
    setAdminDetail(result[0]);
    fetchProducts(result[0].uuid);
  }

  const changeitem = (e) => {
    image = e.target.files[0];
  }

  const addProduct = async (event) => {
    event.preventDefault();
    setIsLoader(true);
    const product = {
      title: titleRef.current.value,
      price: priceRef.current.value,
      quantity: qtyRef.current.value,
      availiblity: avlRef.current.value,
      color: colorRef.current.value,
      offer: offerRef.current.value ? offerRef.current.value : '',
      shipping_price: spriceRef.current.value,
      category: categoryRef.current.value,
      detail: detailRef.current.value,
      size: sizeRef.current.value,
      pic: image
    }

    data.append("title", product.title);
    data.append("price", product.price);
    data.append("quantity", product.quantity);
    data.append("availiblity", product.availiblity);
    data.append("color", product.color);
    data.append("seller_id", adminDetail.uuid);
    data.append("offer", product.offer);
    data.append("shipping_price", product.shipping_price);
    data.append("category", product.category);
    data.append("detail", product.detail);
    data.append("brand", adminDetail.company_name);
    data.append("size", product.size);
    data.append("pic", product.pic);

    if (!product.pic) {
      addToast("Please upload the pic again if already uploaded", {
        appearance: 'error',
        autoDismiss: true,
        placement: "bottom-center"
      });
    }

    if (isEmpty(product.title || product.price || product.quantity || product.size || product.availiblity || product.color || product.offer || product.shipping_price || product.category || product.detail)) {
      addToast("Data is not properly filled up!", {
        appearance: 'error',
        autoDismiss: true,
        placement: "bottom-center"
      });
    } else {
      await axios.post(`${configData.BASEURL}addProduct`, data).then(res => {
        location.reload();
        setIsLoader(false);
        //console.log('register', res);
        addToast(`Successfully uploaded details of ${product.title}`, {
          appearance: 'success',
          autoDismiss: true,
          placement: "bottom-center"
        });

        //fetchUsers('user_role', 'ADMIN');

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

  const fetchProducts = async (id) => {
    try {
      const result = await getProductsBySellerid('seller_id', id);
      setAdminProduct(result);
      setIsLoader(false);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteSelectedProducts = (e, id) => {
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
        addToast("No Product Selected", {
          appearance: 'error',
          autoDismiss: true,
          placement: "bottom-center"
        });
      } else {
        const result = await deleteProductsBySelection(selectedData);
        //console.log(result);
        addToast(result.message, {
          appearance: 'success',
          autoDismiss: true,
          placement: "bottom-center"
        });
        fetchUsers('id', id);
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
          selectedData.push(productDetail[i].id);
        } else {
          ele[i].checked = false;
          setCheck(false);
        }
      }
    }
  }

  const filterData = async (event) => {
    // if (!admins) {
    //   addToast("There is no data to search from", {
    //     appearance: 'error',
    //     autoDismiss: true,
    //     placement: "bottom-center"
    //   });
    // } else {
    //   try{
    //     let result = await filterFromData('users', event.target.value.toLowerCase());
    //     if (event.target.value !== ""){
    //       setAdmins(result);
    //     } else if (event.target.value == "") {
    //       fetchUsers('user_role', 'ADMIN', 'company_name', 'ASC', 5, 0);
    //     }
    //     //console.log(result);
    //   } catch (err){
    //     console.log(err);
    //   }
    // }
  }

  const updateDetails = async () => {
    const updatedAdmin = {
      email: emailRef.current.value,
      first_name: fnameRef.current.value,
      last_name: lnameRef.current.value,
      address: addressRef.current.value,
      phone: phoneRef.current.value,
      company_name: cnameRef.current.value,
      created_on: dateRef.current.value
    }
    console.log(updatedAdmin);
  }

  return (
    <Fragment>
      {isLoader && <Loader />}
      <div key={adminDetail.uuid} className={classes.detailContainer}>
        <span className={classes.head}>
          <h1>{adminDetail.company_name}'s Profile</h1>
          <button onClick={updateDetails}>Update</button>
        </span>
        <div className={classes.detailContent}>
          <img src={`${configData.BASEURL}userImageByUuid?field=uuid&value=${adminDetail.uuid}`} width="300px" height="300px" />
          <div className={classes.overlay}>
            <Input
              input={{
                type: "file"
              }}
            />
          </div>
          <form className={classes.editProfile}>
            <Input
              label="Company Name:"
              input={{
                type: "text",
                defaultValue: adminDetail.company_name,
                ref: cnameRef
              }}
            />
            <Input
              label="First Name:"
              input={{
                type: "text",
                defaultValue: adminDetail.first_name,
                ref: fnameRef
              }}
            />
            <Input
              label="Last Name:"
              input={{
                type: "text",
                defaultValue: adminDetail.last_name,
                ref: lnameRef
              }}
            />
            <Input
              label="Phone Number:"
              input={{
                type: "number",
                defaultValue: adminDetail.phone,
                ref: phoneRef
              }}
            />
            <Input
              label="Email Address:"
              input={{
                type: "email",
                defaultValue: adminDetail.email,
                ref: emailRef
              }}
            />
            <Input
              label="Address:"
              input={{
                type: "text",
                defaultValue: adminDetail.address,
                ref: addressRef
              }}
            />
            <Input
              label="Created On:"
              input={{
                type: "text",
                defaultValue: formattedDate(adminDetail.created_on),
                ref: dateRef,
                disabled: true
              }}
            />
          </form>
        </div>
      </div>

      {/* Form for adding products */}
      <div className={classes.productContainer}>
        <form className={classes.form}>
          <Input
            input={{
              type: "text",
              placeholder: "Product Title",
              ref: titleRef
            }}
          />

          <Input
            input={{
              type: "number",
              placeholder: "Price",
              ref: priceRef
            }}
          />

          <Input
            input={{
              type: "number",
              placeholder: "Quantity",
              ref: qtyRef
            }}
          />

          <Input
            input={{
              type: "text",
              placeholder: "Availibility",
              ref: avlRef
            }}
          />

          <Input
            input={{
              type: "text",
              placeholder: "Color",
              ref: colorRef
            }}
          />

          <Input
            input={{
              type: "text",
              placeholder: "Offer",
              ref: offerRef
            }}
          />

          <Input
            input={{
              type: "number",
              placeholder: "Shipping Price",
              ref: spriceRef
            }}
          />

          <Input
            input={{
              type: "text",
              placeholder: "Categories separated by comma",
              ref: categoryRef
            }}
          />

          {/* <Input
            input={{
              type: "text",
              placeholder: "Description",
              ref: detailRef
            }}
          /> */}
          <textarea placeholder="Description" ref={detailRef}></textarea>

          <Input
            input={{
              type: "text",
              placeholder: "Size",
              ref: sizeRef
            }}
          />

          <Input
            input={{
              type: "file",
              onChange: changeitem
            }}
          />

          <button onClick={addProduct}>Add Product</button>
        </form>
      </div>

      <div className={classes.productHeader}>
        <Input
          label="Filter By "
          input={{
            type: "text",
            placeholder: "Company Name",
            onChange: filterData
          }}
        />

        <div className={classes.icons}>
          <label>Sort By: </label>
          <select>
            <option value="ASC">A - Z</option>
            <option value="DESC">Z - A</option>
          </select>

          <i className="fa fa-check-square-o" aria-hidden="true" onClick={selectAll} data-tip data-for="selectTip" />
          <ReactTooltip id="selectTip" place="top" effect="solid">
            Select / Deselect All
              </ReactTooltip>

          <i className="fa fa-trash-o" aria-hidden="true" onClick={deleteBulk} data-tip data-for="deleteTip" />
          <ReactTooltip id="deleteTip" place="top" effect="solid">
            Deleted Selected Products
              </ReactTooltip>

          {isGrid &&
            <Fragment>
              <i className="fa fa-list-ul" aria-hidden="true" onClick={() => setIsGrid(false)} data-tip data-for="listTip" />
              <ReactTooltip id="listTip" place="top" effect="solid">
                List View
              </ReactTooltip>
            </Fragment>
          }

          {!isGrid &&
            <Fragment>
              <i className="fa fa-th-large" aria-hidden="true" onClick={() => setIsGrid(true)} data-tip data-for="gridTip" />
              <ReactTooltip id="gridTip" place="top" effect="solid">
                Grid View
              </ReactTooltip>
            </Fragment>
          }

        </div>
      </div>

      {/* Products details */}
      {/* grid view */}
      {isGrid &&
        <div className={classes.productDetailContainer}>
          {productDetail.length == 0 ? <h1>No Products</h1> :
            productDetail.map((product) => {
              return <div className={classes.products} key={product.id}>
                <Fragment>
                  <img src={`${configData.BASEURL}productImageByid?field=id&value=${product.id}`} alt={product.title} />
                  <Input
                    input={{
                      type: "checkbox",
                      name: "check",
                      onChange: (e) => deleteSelectedProducts(e, product.id)
                    }}
                  />
                  <div className={classes.productContent}>
                    <p>{product.title}</p>
                    <small>Rs {product.price}</small>
                    <span>
                      <button>Edit</button>
                      <button>Delete</button>
                    </span>
                  </div>
                </Fragment>
              </div>
            })}
        </div>
      }

      {/* list view */}
      {!isGrid &&
        <div className={classes.listContainer}>
          {productDetail.length == 0 ? <h1>No Products</h1> :
            productDetail.map((product) => {
              return <div className={classes.products} key={product.id}>
                <Fragment>
                  <img src={`${configData.BASEURL}productImageByid?field=id&value=${product.id}`} alt={product.title} />

                  <div className={classes.productContent}>
                    <p className={classes.ptitle}>{product.title}</p>
                    <p>{product.detail}</p>
                    <p>Quantity: {product.quantity}</p>
                    <p>Offer: {product.offer}</p>
                    <p>Tags: {product.category}</p>
                    <small>Rs {product.price}</small>
                  </div>

                  <span className={classes.btns}>
                    <div className={classes.selection}>

                      <Input
                        input={{
                          type: "checkbox",
                          name: "check",
                          onChange: (e) => deleteSelectedProducts(e, product.id)
                        }}
                      />
                      <span>Select</span>
                    </div>

                    <button>Edit / Detail</button>
                    <button>Delete</button>
                  </span>
                </Fragment>
              </div>
            })}
        </div>
      }
    </Fragment>
  )
};

export default AdminDetail;