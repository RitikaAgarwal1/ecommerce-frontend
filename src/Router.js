import React from "react";
import { Route, Switch, BrowserRouter as Hash } from "react-router-dom";
import Cart from "./components/Cart/Cart";
import Admin from "./components/Admin/Admin";
import Password from "./components/Auth/Password";
import Verify from "./components/Auth/EmailVerify";
import AdminDetail from "./components/Admin/AdminDetail";
import Product from "./components/Product/Product";
import Orders from "./components/Orders/Orders";
import Offers from "./components/Offers/Offers";
import Designer from "./components/Designer/Designer";
import Profile from "./components/Profile/Profile";
import Wishlist from "./components/Wishlist/Wishlist";
import LoginSection from "./components/Login/LoginSection";
import "./style.scss";
import "./fonts/Raleway_200.scss";
import "./fonts/Raleway_300.scss";

const Router = () => {
  return (
   <Route>
    <Switch>
      <Route exact path="/">
        <LoginSection />
      </Route>

       <Route exact path="/admin">
        <Admin />
      </Route>

      <Route exact path="/forgot-password/:email">
        <Password />
      </Route>

      <Route exact path="/verify-email">
        <Verify />
      </Route>

      <Route exact path="/products">
        <Product />
      </Route>

      <Route exact path="/orders">
        <Orders />
      </Route>

      <Route exact path="/offers">
        <Offers />
      </Route>

      <Route exact path="/personal-designer">
        <Designer />
      </Route>

      <Route exact path="/profile">
        <Profile />
      </Route>

      <Route exact path="/wishlist">
        <Wishlist />
      </Route>

       <Route exact path="/cart">
        <Cart />
      </Route>

      <Route exact path="/adminProfile/:id">
        <AdminDetail />
      </Route>
    </Switch>
  </Route>
  )};

export default Router;
