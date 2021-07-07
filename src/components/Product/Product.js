import React, { useState, useEffect } from "react";
import Loader from "../../Loader/Loader";
import { getDetailsByKey, filterFromData } from "../../services/commonService";
import { Fragment } from "react";
import { useToasts } from 'react-toast-notifications';
import classes from './Product.module.scss';
import Input from "../../UI/Input";
import configData from "../../config/config.json";
import { titleCase } from "../../Utils/Utils";

const Product = props => {
  const { addToast } = useToasts();
  const [isLoader, setIsLoader] = useState(true);
  const [products, setProduct] = useState([]);
  const [order, setOrder] = useState('ASC');
  const [orderBy, setOrderBy] = useState('title');

  useEffect(() => {
    fetchProducts('y', orderBy, order, 10, 0);
  }, [0]);

  const fetchProducts = async (availiblity, order_by, order, limit, offset) => {
    try {
      setIsLoader(true);
      const result = await getDetailsByKey('products', 'availiblity', availiblity, order_by, order, limit, offset);
      //console.log(result);
      setProduct(result);
      setIsLoader(false);
      return result;
    } catch (error) {
      console.log(error);
      setIsLoader(false);
    }
  }

  const sortProducts = (event) => {
    const orderValue = event.target.value;
    setOrder(orderValue);
    fetchProducts(adminDetail.uuid, orderBy, order, 10, 0);
  }

  return (
    <Fragment>
      {isLoader && <Loader />}
      <h1>Welcome to product!</h1>
      <div className={classes.productHeader}>

        <div className={classes.icons}>
          <label>Sort By: </label>
          <select onChange={sortProducts}>
            <option value="ASC">A - Z</option>
            <option value="DESC">Z - A</option>
          </select>
        </div>

      </div>

      <div className={classes.productDetailContainer}>
        {products?.length == 0 ? <h1>No Products</h1> :
          products.map((product) => {
            return <div className={classes.products} key={product.id}>
              <Fragment>
                  <img src={`${configData.BASEURL}imageByid?tableName=products&field=id&value=${product.id}`} alt={titleCase(product.title)}/>
                  {product.offer.toLowerCase() != 'na' && product.offer.toLowerCase() != 'no' && product.offer.toLowerCase() != 'no offer' && <div className={classes.offerContainer}><small className={classes.offer}>{product.offer}</small></div>}
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
    </Fragment>
  )
}

export default Product;