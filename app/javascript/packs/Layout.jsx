import React, { useState } from 'react'
import { Outlet } from "react-router-dom";
import HeaderDesktop from "./general/HeaderDesktop";
import HeaderMobile from './general/HeaderMobile'
import Footer from "./general/Footer";

const Layout = () => {
//   Add in the logic to switch between mobile / desktop header and footer
const [isMobile,] = useState(window.innerWidth < 800);
// Add in the logic to switch between logged in / logged out for header
  return (
    <div className="layout-div">
      {isMobile ? <HeaderMobile /> : <HeaderDesktop />}
      <main>
        <Outlet /> {/* This will render the current route's component */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
