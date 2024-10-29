import React from 'react'
import useCookies from './useCookies'
import axios from 'axios'

//The functions within the usermenu
const UserMenu = () => {
    const cookies = useCookies()

    function toUrl(url) {
        window.location.href = url
    }

    //Logout the user by removing the token issued to the user
    function logOut () {
        cookies.remove('Name',{path:'/'});
        cookies.remove('Type',{path:'/'});
        axios.post("/application/0/log_out", {}, {
            withCredentials: true
        })
        .then(() => window.location.href = '/')
        .catch()
    }

    return(
      <div className='user-menu'>
        {cookies.get("Type") == "Admin" &&
         <button className="admin--button" onClick={() => {toUrl('/admin')}}>Admin Page</button>}
        {cookies.get("Type") != "Boy" &&
         <button className="user-management--button" onClick={() => {toUrl('/user_management')}}>Users Management</button>}
        {cookies.get("Type") != "Boy" &&
         <button className="award-management--button" onClick={() => {toUrl('/awards')}}>Awards</button>}
        {cookies.get("Type") != "Boy" &&
         <button className="result-generation--button" onClick={() => {toUrl('/generate_result')}}>Result Generation</button>}
        {cookies.get("Type") != "Boy" &&
         <button className="uniform-inspection--button" onClick={() => {toUrl('/uniform_inspection_results')}}>Uniform Inspection</button>}
        {cookies.get("Type") != "Boy" &&
         <button className="help--button" onClick={() => {toUrl('/help')}}>Help</button>}
        {cookies.get("Name") != "John Doe" && <button onClick={resetPasswordPage}>Reset Password</button>}
        <button className="log-out--button" onClick={logOut}>Log Out</button>
      </div>
    )
}

export { UserMenu }
// Removed until further decision is made
// {false && cookies.get("Type") == "Boy" && <button className="quiz--button" onClick={quizPage}>Quizzes</button>}
// {false && cookies.get("Type") != "Boy" && <button className="question-bank--button" onClick={questionBankPage}>Questions</button>}
// {false && cookies.get("Type") != "Boy" && <button className="quiz-bank--button" onClick={quizBankPage}>Quizzes</button>}