import React, { useState } from 'react'
import { Outlet } from "react-router-dom";
import HeaderDesktop from "./general/HeaderDesktop";
import HeaderMobile from './general/HeaderMobile'
import FooterDesktop from "./general/FooterDesktop";

const Layout = () => {
//   Add in the logic to switch between mobile / desktop header and footer
const [isMobile,] = useState(window.innerWidth < 800);
// Add in the logic to switch between logged in / logged out for header
  return (
    <>
      {isMobile ? <HeaderMobile /> : <HeaderDesktop />}
      <main>
        <Outlet /> {/* This will render the current route's component */}
      </main>
      <FooterDesktop />
    </>
  );
};

export default Layout;