import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import classes from "./Header.module.scss";
import ReactTooltip from "react-tooltip";
import { NavLink } from "react-router-dom";
import { logout } from "../../services/authService";
import { Link } from "react-router-dom";

const Header = props => {

  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsLogin(localStorage.getItem('login') ? true : false);
    const adminTrue = isLogin? JSON.parse(localStorage.getItem('userDetails')).user_role : 'USER';
    setIsAdmin(adminTrue);
  });

  const signout = async () => {
    try {
      const response = await logout();
      setIsLogin(false);
      localStorage.removeItem('token');
      localStorage.removeItem('userDetails');
      localStorage.removeItem('login');
      window.location.reload();
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Fragment>
      <header>
        <h1><NavLink to="/">Ecommerce</NavLink></h1>

        <div>
          {isAdmin == 'SUPERADMIN' &&
            <p><NavLink to="/admin">Admin</NavLink></p>
          }

          <ul>
            <li><NavLink activeClassName={classes.active} to="/products">Products</NavLink></li>
            <li><NavLink activeClassName={classes.active} to="/orders">My Orders</NavLink></li>
            <li><NavLink activeClassName={classes.active} to="/offers">Offers</NavLink></li>
            <li><NavLink activeClassName={classes.active} to="/personal-designer">Personal Designer</NavLink></li>
            <li>
              <span className={classes.addon}>
                <i className="fa fa-search" aria-hidden="true" />
              </span>
              <input type="search" placeholder="Search" id="search" />
            </li>
            <li className={classes.icons}>
              <NavLink activeClassName={classes.active} to="/profile">
                <i
                  className="fa fa-user-o"
                  aria-hidden="true"
                  data-tip
                  data-for="profileTip"
                />

                <ReactTooltip id="profileTip" place="top" effect="solid">
                  Profile
              </ReactTooltip>
              </NavLink>
            </li>
            <li className={classes.icons}>
              <NavLink activeClassName={classes.active} to="/wishlist">
                <i
                  className="fa fa-heart-o"
                  aria-hidden="true"
                  data-tip
                  data-for="wishlistTip"
                />

                <ReactTooltip id="wishlistTip" place="top" effect="solid">
                  Wishlist
              </ReactTooltip>
              </NavLink>
            </li>
            <li className={classes.icons}>
              <NavLink activeClassName={classes.active} to="/cart">
                <i
                  className="fa fa-shopping-basket"
                  aria-hidden="true"
                  data-tip
                  data-for="cartTip"
                />

                <span className={classes.badge}>0</span>

                <ReactTooltip id="cartTip" place="top" effect="solid">
                  Cart
              </ReactTooltip>
              </NavLink>
            </li>
            {isLogin &&
              <Link to="/"><li onClick={signout}>Logout</li></Link>
            }

          </ul>
        </div>
      </header>

      <script src="https://use.fontawesome.com/3ee4625770.js" />
    </Fragment>
  );
};

export default Header;
