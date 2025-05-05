import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { handleServerError } from './handleServerError'

const Header = () => {
	const [loggedIn, setLoggedIn] = useState(false)
	const [navigationViewable, setNavigationViewable] = useState(false)
	const [buttons, setButtons] = useState(2);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [user, setUser] = useState({});

	useEffect(() => {
		axios.post("/application/0/check_session", {}, { withCredentials: true })
		.then(response => {
			setUser(response.data.user)
			setLoggedIn(!!response.data.user)

			if (response.data.user) {
				let count = 4;
				if (response.data.user.account_type == "Boy") count += 1
				if (response.data.user.account_type == "Admin") count += 1;
				if ((response.data.user.account_type != "Boy") || (response.data.user.account_type == "Boy" && response.data.user.appointment != null)) count += 3
				if (response.data.user.account_type != "Boy") count += 1
				setButtons(count);
			}
		})
		.catch(resp => {
			if (resp.response.status != 401) handleServerError(resp.response.status)
		})
	}, [])

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
		axios.post("/application/0/log_out", {}, {
			withCredentials: true
		})
		.then(() => {
			setLoggedIn(false)
			window.location.href = '/'
		}) 
		.catch()
	}

	return (
		<header>
			<div>
				<button className="menu-button" onClick={toggleUserMenu} aria-label='Menu'> 
					<i className="fa-solid fa-bars"></i>
				</button>

				<img src="/assets/coy logo-9045c6ee2f3bfcea2b14a1e4c8a6586a5542c17289ec5cd76a7b2d653a295abe.webp" alt='BB Logo' width={"90px"} height={"90px"} onClick={() => { toUrl('/home') }} />
			</div>

			<div data-state={navigationViewable} style={{ height: (40 * buttons) + "px" }} data-header-type={loggedIn ? "home" : "public" }>
				{!loggedIn && <>
					<button className="log-in--button" onClick={() => { toUrl('/parade_notice') }}>Parade Notice</button>
					<button className="log-in--button" onClick={() => { toUrl('/log_in') }}>Members Log In</button>
				</>}

				{loggedIn &&
					<>
					{user.account_type == "Admin" &&
						<button className="admin--button" onClick={() => { toUrl('/admin') }}>Admin Page</button>}

					{(user.account_type != "Boy" || user.appointment != null) &&
						<button className="user-management--button" onClick={() => { toUrl('/user_management') }}>Users Management</button>}
					
					{(user.account_type == "Officer" || user.appointment?.toLowerCase().includes("tech")) &&
						<button className="award-management--button" onClick={() => { toUrl('/home_editor') }}>Home Page Editor</button>}

					<button className="attendance-management--button" onClick={() => { toUrl('/attendance_management') }}>Parades & Attendance</button>

					{(user.account_type == "Boy") &&
						<button className="user-management--button" onClick={() => { toUrl('/user_awards') }}>My Awards</button>}

					{(user.account_type == "Boy") &&
						<button className="user-management--button" onClick={() => { toUrl('/user_inspections') }}>My Inspection Results</button>}

					{(user.account_type != "Boy" || user.appointment != null) &&
						<button className="award-management--button" onClick={() => { toUrl('/awards') }}>Award Management</button>}

					{(user.account_type != "Boy" || user.appointment != null) &&
						<button className="result-generation--button" onClick={() => { toUrl('/generate_result') }}>Result Generation</button>}

					{user.account_type != "Boy" &&
						<button className="uniform-inspection--button" onClick={() => { toUrl('/uniform_inspection_results') }}>Uniform Inspection</button>}
					
					<button onClick={() => { toUrl('/reset_password') }}>Reset Log In Information</button>
					<button onClick={() => { toUrl('/help') }}>Help</button>
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
					{!loggedIn ? <>
						<button onClick={() => toUrl('/parade_notice')}>Parade Notice</button>
						<button onClick={() => toUrl('/log_in')}>Members Log In</button>
					</> : <>
						{user.account_type == "Admin" &&
						<button onClick={() => toUrl('/admin')}>
							<i className='fa-solid fa-gear'></i>
							Admin Page
						</button>}

						{(user.account_type != "Boy" || user.appointment != null) &&
						<button onClick={() => toUrl('/user_management')}>
							<i className='fa-solid fa-users'></i>
							Users Management
						</button>}
						
						{(user.account_type == "Officer" || user.appointment?.toLowerCase().includes("tech")) &&
						<button onClick={() => toUrl('/home_editor')}>
							<i className='fa-solid fa-edit'></i>
							Home Page Editor
						</button>}

						<button onClick={() => toUrl('/attendance_management')}>
							<i className='fa-solid fa-file'></i>
							Parades & Attendance
						</button>

						{(user.account_type == "Boy") && <>
						<button onClick={() => toUrl('/user_awards')}>
							<i className='fa-solid fa-award'></i>
							My Awards
						</button>
						<button onClick={() => toUrl('/user_inspections')}>
							<i className='fa-solid fa-shirt-long-sleeve'></i>
							My Inspection Results
						</button>
						</>}

						{(user.account_type != "Boy" || user.appointment != null) && <>
						<button onClick={() => toUrl('/awards')}>
							<img src="assets/awards_tracker-27eebc7c26359df7efb6e2ac54d10547b766b986e0b4923657d4f07c0543251c.webp" alt="Awards Management Icon" />
							Awards Management
						</button>
						<button onClick={() => toUrl('/generate_result')}>
							<i className='fa-solid fa-file-invoice'></i>
							Result Generation
						</button>
						</>}
						
						{user.account_type != "Boy" &&
						<button onClick={() => toUrl('/uniform_inspection_results')}>
							<i className='fa-solid fa-shirt-long-sleeve'></i>
							Uniform Inspection
						</button>}
						
						<button onClick={() => toUrl('/reset_password')}>
							<i className='fa-solid fa-rotate-right'></i>
							Reset Log In Information
						</button>
						<button onClick={() => toUrl('/help')}>
							<i className='fa-solid fa-question'></i>
							Help
						</button>
						<button onClick={logOut}>
							<i className='fa-solid fa-lock'></i>
							Log Out
						</button>
					</>}
				</div>
			</div>
		</header>
	)
}

export default Header
