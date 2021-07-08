import React, { useState, useEffect } from "react";
import Loader from "../../Loader/Loader";
import { getDetailsByKey } from "../../services/commonService";
import { Fragment } from "react";
import { useToasts } from 'react-toast-notifications';
import classes from './Product.module.scss';
import Input from "../../UI/Input";
import configData from "../../config/config.json";
import { titleCase, calcDays } from "../../Utils/Utils";

const Product = props => {
  const { addToast } = useToasts();
  const [isLoader, setIsLoader] = useState(true);
  const [products, setProduct] = useState([]);
  const [order, setOrder] = useState('ASC');
  const [orderBy, setOrderBy] = useState('title');
  const [showLoadBtn, setLoadBtn] = useState(true);
  const [offsetValue, setOffset] = useState(0);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
  const [color, setColor] = useState([]);
  const [offer, setOffer] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const size = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const price = ['Rs 500 - Rs 1000', 'Rs 1000 to Rs 2000', 'Rs 2000 to Rs 3000', 'Rs 3000 to Rs 4000'];

  const titleArr = [
    {
      title: "Brand",
      value: "brand"
    },
    {
      title: "Color",
      value: "color"
    },
    {
      title: "Size",
      value: "size"
    },
    {
      title: "Price-Range",
      value: "price"
    },
    {
      title: "Category",
      value: "category"
    },
    {
      title: "Offer",
      value: "offer"
    }
  ];

  useEffect(async () => {
    await fetchProducts('y', orderBy, order, 10, 0);
    await fetchAllProducts();
  }, [0]);

  const fetchProducts = async (availiblity, order_by, order, limit, offset) => {
    try {
      setIsLoader(true);
      const result = await getDetailsByKey('products', 'availiblity', availiblity, order_by, order, limit, offset);
      //console.log(result);
      setProduct(result);
      setOffset(10);
      setIsLoader(false);
      return result;
    } catch (error) {
      console.log(error);
      setIsLoader(false);
    }
  }

  const sortProducts = async (event) => {
    let setorder = '';
    let orderby = '';
    switch (event.target.value) {
      case 'DATE ASC':
        setorder = 'ASC';
        orderby = 'created_on';
        break;

      case 'PRICE ASC':
        setorder = 'ASC';
        orderby = 'price';
        break;

      case 'PRICE DESC':
        setorder = 'DESC';
        orderby = 'price';
        break;
    };
    setOrder(setorder);
    setOrderBy(orderby);
    await fetchProducts('y', orderby, setorder, 10, 0);
  }

  const loadmore = async () => {
    setIsLoader(true);
    let newArr = products;
    try {
      const result = await fetchProducts('y', orderBy, order, 10, offsetValue);
      result.length < 5 ? setLoadBtn(false) : setLoadBtn(true);
      result.forEach((el) => {
        newArr.push(el);
      });
      setProduct(newArr);
      const o = offsetValue;
      setOffset(o + 5);
      setIsLoader(false);
      window.addEventListener('load', checkAll, false);
    } catch (err) {
      console.log(err);
      setIsLoader(false);
    }
  }

  const scrollTop = () => {
    window.scrollTo(0, 0);
  }

  const filterByTitle = (value) => {
    switch (value.toLowerCase()) {
      case 'color':
        setFilterData(color);
        break;

      case 'category':
        setFilterData(category);
        break;

      case 'brand':
        setFilterData(brand);
        break;

      case 'size':
        setFilterData(size);
        break;

      case 'offer':
        setFilterData(offer);
        break;

      case 'price':
        setFilterData(price);
        break;
    }

    if (filterData.length == 0) {
      addToast("Please re-load", {
        appearance: 'error',
        autoDismiss: true,
        placement: "bottom-center"
      });
    }
  }

  const fetchAllProducts = async () => {
    const response = await getDetailsByKey('products');
    //console.log(response);
    let data = {
      brand: [],
      category: [],
      color: [],
      offer: []
    };
    for (let i in response) {
      data['brand'].push(titleCase(response[i]['brand']));
      data['category'].push(titleCase(response[i]['category']));
      data['color'].push(titleCase(response[i]['color']));
      data['offer'].push(titleCase(response[i]['offer']));
    }

    setBrand([...new Set(data.brand)]);
    setCategory([...new Set(data.category)]);
    setColor([...new Set(data.color)]);
    setOffer([...new Set(data.offer)]);
  }

  return (
    <Fragment>
      {isLoader && <Loader />}
      <div className={classes.productDetailContainer}>

        <div className={classes.actionBar}>

          <div className={classes.filterBox}>
            <h4>Filter By: </h4>
            <ul>

              {titleArr.map((filter, index) => (
                <li key={index} onClick={() => filterByTitle(filter.value)}>{filter.title}</li>
              ))}
            </ul>

            <div>
              {filterData.map((data, index) => (
                <Fragment key={index}>
                  <Input
                    input={{
                      type: "checkbox",
                      name: "check",
                      onChange: (e) => deleteSelectedUsers(e, admin.id)
                    }}
                  />
                  <label>{data}</label>
                </Fragment>
              ))}
            </div>
          </div>

          <div className={classes.sorting}>
            <label>Sort By: </label>
            <select onChange={sortProducts} defaultValue="">
              <option disabled value="">Select Option</option>
              <option value="DATE ASC">New to Old</option>
              <option value="PRICE ASC">Price: Low to High</option>
              <option value="PRICE DESC">Price: High to Low</option>
            </select>
          </div>

        </div>

        <div className={classes.productsContainer}>
          {products?.length == 0 ? <h1>No Products</h1> :
            products.map((product) => {
              return <div className={classes.products} key={product.id}>
                <Fragment>
                  <img src={`${configData.BASEURL}imageByid?tableName=products&field=id&value=${product.id}`} alt={titleCase(product.title)} />
                  {product.offer.toLowerCase() != 'na' && product.offer.toLowerCase() != 'no' && product.offer.toLowerCase() != 'no offer' && <div className={classes.offerContainer}><small className={classes.offer}>{product.offer}</small></div>}
                  {calcDays(product.created_on) < 30 && <span className={classes.new}>New</span>}
                  <div className={classes.productContent}>
                    <p>{titleCase(product.title)}</p>
                    <small className={classes.brand}>By {titleCase(product.brand)}</small>
                    <small>Rs {product.price}</small>
                    <span>
                      <button>Cart</button>
                      <button>Wishlist</button>
                    </span>
                  </div>
                </Fragment>
              </div>
            })
          }
        </div>

        {showLoadBtn && products.length >= 10 &&
          <button className={classes.loadmore} onClick={loadmore}>Load More Products...</button>
        }

      </div>
      <div onClick={scrollTop} className={classes.jumpTop}><i className="fa fa-angle-double-up" aria-hidden="true" /><small>Jump to top</small></div>
    </Fragment>
  )
}

export default Product;