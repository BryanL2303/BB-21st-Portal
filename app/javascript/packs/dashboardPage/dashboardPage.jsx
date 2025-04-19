import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PendingTasks } from './pendingTasks'
import { handleServerError } from '../general/handleServerError'

const DashboardPage = () => {
    const [userId, setUserId] = useState(null)
    const [paradesAfterToday, setParadesAfterToday] = useState([])
    const [account, setAccount] = useState(null)
    const [user, setUser] = useState({})

    useEffect(() => {
        axios.post("/application/0/check_session", {}, { withCredentials: true })
        .then(response => {
            setUser(response.data.user)

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
		axios.post("/application/0/log_out", {}, {
			withCredentials: true
		})
		.then(() => window.location.href = '/')
		.catch()
	}

    return (
        <div className='dashboard'>
            <h2>Hello, {!account ? "" : `${(account.account_type != "Admin" && account.rank == null) ? account.honorifics : (account.account_type == "Admin" ? "" : account.rank)} ${account.account_name}`}</h2>

            <div className='dashboard-routes'>
                {user?.account_type == "Admin" &&
                <div onClick={() => goTo('/admin')}>
                    <i className='fa-solid fa-gear'></i>
                    <p>Admin Page</p>
                </div>}

                {user?.account_type == "Boy" && <>
                <div onClick={() => goTo('/user_awards')}>
                    <i className='fa-solid fa-award'></i>
                    <p>My Awards</p>
                </div>
                <div onClick={() => goTo('/user_inspections')}>
                    <i className='fa-solid fa-shirt-long-sleeve'></i>
                    <p>My Inspections Results</p>
                </div>
                </>}

                {(user?.account_type != "Boy" || user?.appointment != null) && <>
                <div onClick={() => goTo('/user_management')}>
                    <i className='fa-solid fa-users'></i>
                    <p>User Management</p> 
                </div>
                <div onClick={() => goTo('/home_editor')}>
                    <i className='fa-solid fa-edit'></i>
                    <p>Home Page Editor </p> 
                </div>
                </>}

                <div onClick={() => goTo('/attendance_management')}>
                    <i className='fa-solid fa-file'></i>
                    <p>Parade & Attendance</p>
                </div>

                {(user?.account_type != "Boy" || user?.appointment != null) &&
                <div onClick={() => goTo('/awards')}>
                    <img src="assets/awards_tracker-27eebc7c26359df7efb6e2ac54d10547b766b986e0b4923657d4f07c0543251c.webp" alt="Awards Management Icon" />
                    <p>Awards Management</p>
                </div>}

                {(user?.account_type != "Boy" || user?.appointment != null) &&
                <div onClick={() => goTo('/generate_result')}>
                    <i className='fa-solid fa-file-invoice'></i>
                    <p>Results Generation</p>
                </div>}

                {user?.account_type != "Boy" &&
                <div onClick={() => goTo('/uniform_inspection_results')}>
                    <i className='fa-solid fa-shirt-long-sleeve'></i>
                    <p>Uniform Inspection</p>
                </div>}

                <div onClick={() => goTo('/reset_password')}>
                    <i className='fa-solid fa-rotate-right'></i>
                    <p>Reset Log In Information</p>
                </div>

                <div onClick={() => goTo('/help')}>
                    <i className='fa-solid fa-question'></i>
                    <p>Help</p>
                </div>

                <div onClick={logOut}>
                    <i className='fa-solid fa-lock'></i>
                    <p>Log Out</p>
                </div>
            </div>

            <PendingTasks accountType={user.account_type} appointment={user.appointment} userId={userId} paradesAfterToday={paradesAfterToday} />
        </div>
    )
}

export { DashboardPage }

// Note to Developer: To add stats and pending tasks to the dashboard