import React from "react";
import {Fragment} from 'react';
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Router from "./Router";
import "./style.scss";
import "./fonts/Raleway_200.scss";
import "./fonts/Raleway_300.scss";
import { ToastProvider } from 'react-toast-notifications';


const App = () => {
  return (
    <Fragment>
      <Header />

      <main>
      <ToastProvider>
        <Router/>
      </ToastProvider>
      </main>

      <Footer/>
    </Fragment>
  )
};

export default App;
