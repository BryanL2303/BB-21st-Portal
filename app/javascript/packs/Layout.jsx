import React from 'react'
import { Outlet } from "react-router-dom";
import Header from "./general/Header";
import Footer from "./general/Footer";

const Layout = () => {
// Add in the logic to switch between logged in / logged out for header
  return (
    <div className="layout-div">
      <Header />
      <main>
        <Outlet /> {/* This will render the current route's component */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
