import React from 'react'
import { Outlet } from "react-router-dom";
import Header from "./general/Header";
import Footer from "./general/Footer";

const Layout = () => {
	return (
		<div className="layout-div">
			{/* Error container */}
			<div className='error-container'></div>

			<Header />
			<main>
				<Outlet /> 
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
