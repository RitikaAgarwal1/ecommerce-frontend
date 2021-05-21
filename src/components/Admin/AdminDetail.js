import React, { useState, useEffect, useRef } from "react";
import Input from "../../UI/Input";
import classes from './Admin.module.scss';
import { Fragment } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { getUserDetailsByKey } from "../../services/authService";
import { getProductsBySellerid } from "../../services/productService";
import configData from "../../config/config.json";
import formattedDate from "../../Utils/Utils";
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';

const AdminDetail = () => {
  const { addToast } = useToasts();
  const isEmpty = (value) => value.trim() === '';
  const [isLoader, setIsLoader] = useState(true);
  const [adminDetail, setAdminDetail] = useState([]);
  const [productDetail, setAdminProduct] = useState([]);
  let { id } = useParams();
  let data = new FormData();
  let image = "";

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


  useEffect(() => {
    fetchUsers('id', id);
  }, [0]);

  const fetchUsers = async (key, value) => {
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

  const updateDetails = () => {
    console.log(updateAdmin);
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
                value: adminDetail.company_name,
                onChange: (e) => setAdminDetail({ company_name: e.target.value})
              }}
            />
            <Input
              label="First Name:"
              input={{
                type: "text",
                value: adminDetail.first_name,
                onChange: (e) => setAdminDetail({ first_name: e.target.value})
              }}
            />
            <Input
              label="Last Name:"
              input={{
                type: "text",
                value: adminDetail.last_name,
                onChange: (e) => setAdminDetail({ last_name: e.target.value})
              }}
            />
            <Input
              label="Phone Number:"
              input={{
                type: "number",
                value: adminDetail.phone,
                onChange: (e) => setAdminDetail({ phone: e.target.value})
              }}
            />
            <Input
              label="Email Address:"
              input={{
                type: "email",
                value: adminDetail.email,
                onChange: (e) => setAdminDetail({ email: e.target.value})
              }}
            />
            <Input
              label="Address:"
              input={{
                type: "text",
                value: adminDetail.address,
                onChange: (e) => setAdminDetail({ address: e.target.value})
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

      {/* Products details */}
      <div className={classes.productDetailContainer}>
        {productDetail.length == 0 ? <h1>No Products</h1> :
          productDetail.map((product) => {
            return <div className={classes.products} key={product.id}>
              <img src={`${configData.BASEURL}productImageByid?field=id&value=${product.id}`} alt={product.title} />
              <input type="checkbox"/>
              <div className={classes.productContent}>
                <p>{product.title}</p>
                <small>Rs {product.price}</small>
                <span>
                  <button>Edit</button>
                  <button>Delete</button>
                </span>
              </div>
            </div>
          })}
      </div>
    </Fragment>
  )
};

export default AdminDetail;