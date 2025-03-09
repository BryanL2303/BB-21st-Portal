import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useCookies from '../general/useCookies'
import { PendingTasks } from './pendingTasks'
import { handleServerError } from '../general/handleServerError'

const DashboardPage = () => {
    const cookies = useCookies()
    const [userId, setUserId] = useState(null)
    const [paradesAfterToday, setParadesAfterToday] = useState([])
    const [account, setAccount] = useState(null)

    useEffect(() => {
        axios.post("/application/0/check_session", {}, { withCredentials: true })
        .then(() => {
            axios.get("/api/parade/0/parades_after_today", {}, { withCredentials: true })
            .then(resp => {
                setParadesAfterToday(resp.data)
            })
            .catch(resp => handleServerError(resp.response.status))

            axios.post('/api/account/0/get_own_account', {}, { withCredentials: true })
            .then(resp => {
                setAccount(resp.data)
                setUserId(resp.data.id)
            })
            .catch(resp => {handleServerError(resp.response.status)})
        })
        .catch(() => {window.location.href = '/'})
    }, [setAccount])

    function goTo(url) {
        window.location.href = url
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
		setLoggedIn(false)
	}

    return (
        <div className='dashboard'>
            <h2>Hello, {!account ? "" : `${account.rank == null ? account.honorifics : account.rank} ${account.account_name}`}</h2>

            <div className='dashboard-routes'>
                {cookies.get("Type") == "Admin" &&
                <div onClick={() => goTo('/admin_page')}>
                    <i className='fa-solid fa-gear'></i>
                    <p>Admin Page</p>
                </div>}

                {cookies.get("Type") != "Boy" || cookies.get("Appointment") != null &&
                <div onClick={() => goTo('/user_management')}>
                    <i className='fa-solid fa-users'></i>
                    <p>User Management</p>
                </div>}

                <div onClick={() => goTo('/attendance_management')}>
                    <i className='fa-solid fa-file'></i>
                    <p>Parade & Attendance</p>
                </div>

                {(cookies.get("Type") != "Boy" || cookies.get("Appointment") != null) &&
                <div onClick={() => goTo('/awards')}>
                    <i className='fa-solid fa-award'></i>
                    <p>Awards</p>
                </div>}

                {(cookies.get("Type") != "Boy" || cookies.get("Appointment") != null) &&
                <div onClick={() => goTo('/results_generation')}>
                    <i className='fa-solid fa-file-invoice'></i>
                    <p>Results Generation</p>
                </div>}

                {cookies.get("Type") != "Boy" &&
                <div onClick={() => goTo('/uniform_inspection_results')}>
                    <i className='fa-solid fa-shirt-long-sleeve'></i>
                    <p>Uniform Inspection</p>
                </div>}

                <div onClick={() => goTo('/reset_password')}>
                    <i className='fa-solid fa-rotate-right'></i>
                    <p>Reset Log In Information</p>
                </div>

                <div onClick={logOut}>
                    <i className='fa-solid fa-lock'></i>
                    <p>Log Out</p>
                </div>
            </div>

            <PendingTasks userId={userId} paradesAfterToday={paradesAfterToday} />
        </div>
    )
}

export { DashboardPage }

// Note to Developer: To add stats and pending tasks to the dashboard