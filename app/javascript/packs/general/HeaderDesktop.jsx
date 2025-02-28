import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import useCookies from './useCookies'

const HeaderDesktop = () => {
	const cookies = useCookies()
	const popupRef = useRef(null)
	const [loggedIn, setLoggedIn] = useState(false)
	const [navigationViewable, setNavigationViewable] = useState(false)
	const [buttons, setButtons] = useState(3);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		setLoggedIn(cookies.get('Name') != null)

		if (!loggedIn) setButtons(1);
		if (loggedIn) {
			let count = 3;
			if (cookies.get("Type") == "Admin") count += 1;
			if (cookies.get("Type") != "Boy" || cookies.get("Appointment") != null) count += 3
			setButtons(count);
		}
	}, [cookies])

	// useEffect(() => {
	// 	const handleClickOutside = (event) => {
	// 		if (popupRef.current && !popupRef.current.contains(event.target)) {
	// 			toggleUserMenu(); // Close the menu
	// 		}
	// 	};

	// 	document.addEventListener("mousedown", handleClickOutside);
	// 	return () => document.removeEventListener("mousedown", handleClickOutside);
	// }, [navigationViewable]);

	// useEffect(() => {
	//   if (popupRef.current && navigationViewable) {
	//     popupRef.current.focus();
	//   }
	// }, [navigationViewable]);

	function toUrl(url) {
		window.location.href = url
	}

	const toggleUserMenu = () => {
		setNavigationViewable(prevState => !prevState);
	};

	const toggleSidebar = () => {
		setSidebarOpen(prevState => !prevState);
	}

	function logOut() {
		cookies.remove('Name', { path: '/' });
		cookies.remove('Type', { path: '/' });
		cookies.remove('Appointment', { path: '/' });
		axios.post("/application/0/log_out", {}, {
			withCredentials: true
		})
		.then(() => window.location.href = '/')
		.catch()
	}

	return (
		<header>
			<div>
				<button className="menu-button" onClick={toggleUserMenu} aria-label='Menu'>
					<i className="fa-solid fa-bars"></i>
				</button>

				<img src="/assets/coy logo-9c8cabf89b71a4b4554e2864db559572b3b21bb9be05fafabfc844e3a584b7e1.png" alt='BB Logo' width={"90px"} height={"90px"} />
			</div>

			<div data-state={navigationViewable} style={{ height: (40 * buttons) + "px" }} data-header-type={loggedIn ? "home" : "public" }>
				{!loggedIn &&
					// 1. Parade Notice - Uncomment after backend fetch is implemented */}

					<button className="log-in--button" onClick={() => { toUrl('/log_in') }}>Members Log In</button>
				}

				{loggedIn &&
					// 1. Parade Notice - Uncomment after backend fetch is implemented

					<>
					{cookies.get("Type") == "Admin" &&
						<button className="admin--button" onClick={() => { toUrl('/admin') }}>Admin Page</button>}

					{(cookies.get("Type") != "Boy" || cookies.get("Appointment") != null) &&
						<button className="user-management--button" onClick={() => { toUrl('/user_management') }}>Users Management</button>}
					
					<button className="attendance-management--button" onClick={() => { toUrl('/attendance_management') }}>Parades & Attendance</button>

					{(cookies.get("Type") != "Boy" || cookies.get("Appointment") != null) &&
						<button className="award-management--button" onClick={() => { toUrl('/awards') }}>Awards</button>}

					{(cookies.get("Type") != "Boy" || cookies.get("Appointment") != null) &&
						<button className="result-generation--button" onClick={() => { toUrl('/generate_result') }}>Result Generation</button>}
					
					<button onClick={() => { toUrl('/reset_password') }}>Reset Log In Information</button>
					<button className="log-out--button" onClick={logOut}>Log Out</button>

					<button aria-label='Open Sidebar' onClick={toggleSidebar}>
						<i className='fa-solid fa-bars'></i>
					</button>
					</>
				}
			</div>

			<div className='sidebar' data-open={sidebarOpen}>
				<div>
					<h2>Menu</h2>
					<button aria-label='Close Sidebar' onClick={toggleSidebar}>
						<i className='fa-solid fa-xmark'></i>
					</button>
				</div>

				<div>
					{!loggedIn &&
						// 1. Parade Notice - Uncomment after backend fetch is implemented */}

						<button className="log-in--button" onClick={() => { toUrl('/log_in') }}>Members Log In</button>
					}

					{loggedIn &&
						// 1. Parade Notice - Uncomment after backend fetch is implemented

						<>
						{cookies.get("Type") == "Admin" &&
							<button className="admin--button" onClick={() => { toUrl('/admin') }}>Admin Page</button>}

						{(cookies.get("Type") != "Boy" || cookies.get("Appointment") != null) &&
							<button className="user-management--button" onClick={() => { toUrl('/user_management') }}>Users Management</button>}
						
						<button className="attendance-management--button" onClick={() => { toUrl('/attendance_management') }}>Parades & Attendance</button>

						{(cookies.get("Type") != "Boy" || cookies.get("Appointment") != null) &&
							<button className="award-management--button" onClick={() => { toUrl('/awards') }}>Awards</button>}

						{(cookies.get("Type") != "Boy" || cookies.get("Appointment") != null) &&
							<button className="result-generation--button" onClick={() => { toUrl('/generate_result') }}>Result Generation</button>}
						
						<button onClick={() => { toUrl('/reset_password') }}>Reset Log In Information</button>
						<button className="log-out--button" onClick={logOut}>Log Out</button>
						</>
					}
				</div>
			</div>
		</header>
	)
}

export default HeaderDesktop

// <button className="parade-notice--button" onClick={() => {toUrl('/parade_notice')}}>Parade Notice</button>