import React from "react";
import { Fragment } from "react";
import classes from "./Header.module.css";
import ReactTooltip from "react-tooltip";
import { NavLink } from "react-router-dom";

const Footer = props => {
  return (
    <Fragment>
      <footer>
        <div className={classes.content}>
          <div>
            <p>Online Shopping</p>
            <ul>
              <li><NavLink activeClassName={classes.active} to="/products">Products</NavLink></li>
              <li><NavLink activeClassName={classes.active} to="/orders">My Orders</NavLink></li>
              <li><NavLink activeClassName={classes.active} to="/offers">Offers</NavLink></li>
              <li><NavLink activeClassName={classes.active} to="/personal-designer">Personal Designer</NavLink></li>
              <li><NavLink activeClassName={classes.active} to="/wishlist">Wishlist</NavLink></li>
              <li><NavLink activeClassName={classes.active} to="/cart">Checkout</NavLink></li>
            </ul>
          </div>
          <div>
            <p>Useful Links</p>
            <ul>
              <li><NavLink activeClassName={classes.active} to="/products">Contact Us</NavLink></li>
              <li><NavLink activeClassName={classes.active} to="/orders">Track Orders</NavLink></li>
              <li><NavLink activeClassName={classes.active} to="/profile">Profile</NavLink></li>
            </ul>
          </div>
          <div>
            <p>Social Details</p>
            <ul>
              <li>
                <NavLink activeClassName={classes.active} to="/profile">
                  <i
                    className="fa fa-facebook"
                    aria-hidden="true"
                  />
                  Facebook
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName={classes.active} to="/profile">
                  <i
                    className="fa fa-twitter"
                    aria-hidden="true"
                  />
                  Twitter
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName={classes.active} to="/profile">
                  <i
                    className="fa fa-instagram"
                    aria-hidden="true"
                  />
                  Instagram
                </NavLink>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li><strong>100% ORIGINAL</strong> guarantee <br/> for all products at ecommerce.com</li><br/>
              <li><strong>Return within 30days</strong> of <br/> receiving your order</li><br/>
              <li><strong>Get free delivery</strong> for every <br/> order above Rs. 799</li>
            </ul>
          </div>
        </div>
      </footer>
    </Fragment>
  )
}

export default Footer;