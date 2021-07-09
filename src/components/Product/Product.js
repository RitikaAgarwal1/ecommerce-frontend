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
  const [showFilter, setShowFilter] = useState(false);
  const [offsetValue, setOffset] = useState(0);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
  const [color, setColor] = useState([]);
  const [offer, setOffer] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [columnName, setColumnName] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

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

  const checkAll = () => {
    var inputs = document.querySelectorAll('.check');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].checked = true;
    }
  }

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
    switch (event.target.value) {
      case 'DATE DESC':
        setOrder('DESC');
        setOrderBy('created_on');
        await fetchProducts('y', 'created_on', 'DESC', 10, 0);
        break;

      case 'PRICE ASC':
        setOrder('ASC');
        setOrderBy('price');
        await fetchProducts('y', 'price', 'ASC', 10, 0);
        break;

      case 'PRICE DESC':
        setOrder('DESC');
        setOrderBy('price');
        await fetchProducts('y', 'price', 'DESC', 10, 0);
        break;
    };
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

    if (offer.length == 0 || category.length == 0 || color.length == 0 || brand.length == 0) {
      addToast("Please re-load and re-navigate the page", {
        appearance: 'warning',
        autoDismiss: true,
        placement: "bottom-center"
      });
      return false;
    }

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
    setShowFilter(true);
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
      data['brand'].push({key: titleCase(response[i]['brand']), "isCheck": false});
      data['category'].push(titleCase(response[i]['category']));
      data['color'].push(titleCase(response[i]['color']));
      if ((response[i]['offer'].toLowerCase() !== "na") && (response[i]['offer'].toLowerCase() !== "no offer")) {
        data['offer'].push(titleCase(response[i]['offer']));
      }
    }

    setBrand([...new Set(data.brand)]);
    setCategory([...new Set(data.category)]);
    setColor([...new Set(data.color)]);
    setOffer([...new Set(data.offer)]);
  }

  const selectFilterValues = async (e, data) => {
    //console.log(size, color, offer, category, brand, price);
    let columnname = columnName;

    if (offer.includes(data)) columnname = 'offer';
    if (brand.includes(data)) columnname = 'brand';
    if (category.includes(data)) columnname = 'category';
    if (color.includes(data)) columnname = 'color';
    if (size.includes(data)) columnname = 'size';
    if (price.includes(data)) columnname = 'price';

    setColumnName(columnname);

    if (e.target.checked) {
      if (!Object.keys(selectedData).includes(columnname)) selectedData[columnname] = [];
      selectedData[columnname].push(data);
    } else if (!e.target.checked){
      const index = selectedData[columnname].indexOf(data);
      selectedData[columnname].splice(index, 1);
    }
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
          </div>

          <div className={classes.sorting}>
            <label>Sort By: </label>
            <select onChange={sortProducts} defaultValue="">
              <option disabled value="">Select Option</option>
              <option value="DATE DESC">New to Old</option>
              <option value="PRICE ASC">Price: Low to High</option>
              <option value="PRICE DESC">Price: High to Low</option>
            </select>
          </div>

        </div>

        {showFilter &&
          <div className={classes.filterBar}>
            <div className={classes.filterContent}>{filterData.map((data, index) => (
              <Fragment key={index}>
                <div>
                  <Input
                    input={{
                      type: "checkbox",
                      name: "check",
                      onChange: (e) => selectFilterValues(e, data)
                    }}
                  />
                  <label>{data}</label>
                </div>
              </Fragment>
            ))}</div>

            <button>Apply</button>
          </div>
        }

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