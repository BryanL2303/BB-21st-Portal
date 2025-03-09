import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import axios from 'axios'
import useCookies from '../general/useCookies'
import { AccountCreationForm } from './AccountCreationForm'
import { UserInformation } from './UserInformation'

// To access current users and create new accounts
// This page should only be visible for mobile screens

const UserManagementSmallPage = () => {
    const cookies = useCookies()
    const { userId } = useParams();
    const [renderPage, setRenderPage] = useState(false)
    const [, setLoad] = useState(false);
    const [, setPageState] = useState("form");

    if (cookies.get('Type') == 'Boy' && cookies.get('Appointment') == null) {
        window.location.href = '/reset_password'
    }

    // Check if the screen is below 800px
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 800) {
                window.location.href = '/user_management'
            }
        };
    
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, []);

    // Session Authentication
    useEffect(() => {
        axios.post("/application/0/check_session", {}, { withCredentials: true })
        .then(() => setRenderPage(true))
        .catch(() => window.location.href = '/')
    }, [])

    // Return Back to the main user management page
    function returnBack() {
        window.location.href = '/user_management'
    }

    function reLoad() {
        setLoad((prevLoad) => {
            return !prevLoad
        })
    }

    function showForm() {
		setPageState("form");
	}

    if (!renderPage) return null

    return (
        <div className='user-management-page'>
            <div className='page-container'>
                <div className='users'>
                    <div className='main-block'>
                        <button aria-label='Go Back' onClick={returnBack} className='back-button'>
                            <i className='fa-solid fa-arrow-left'></i>
                            Back
                        </button>

                        {userId == 0 ? (
                            <AccountCreationForm reLoad={reLoad} />
                        ) : (
                            <UserInformation userId={userId} showForm={showForm} reLoad={reLoad} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export { UserManagementSmallPage }