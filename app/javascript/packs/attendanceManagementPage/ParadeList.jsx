import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import useCookies from '../general/useCookies'
import { handleServerError } from '../general/handleServerError'
import PropTypes from 'prop-types'

const ParadeList = ({setPageState, reload}) => {
    const cookies = useCookies()
    const [parades, setParades] = useState([])
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

    useEffect(() => {
        axios.post("/api/parade/0/get_parades_by_year", {
            year: currentYear
        }, {withCredentials: true})
        .then((resp) => setParades([...resp.data.parades]))
        .catch(resp => handleServerError(resp.response.status))
    }, [currentYear, reload])

    function showNewParadeForm() {
        setPageState('form')
        let list = document.getElementsByClassName('parade-list')[0]
        list.style.width = '15vw'
        let mainBlock = document.getElementsByClassName('main-block')[0]
        mainBlock.style.width = '70vw'
    }

    function showParadeInformation(e) {
        let list = document.getElementsByClassName('parade-list')[0]
        list.style.width = '15vw'
        let mainBlock = document.getElementsByClassName('main-block')[0]
        mainBlock.style.width = '70vw'
        setPageState(e.target.className)
    }

    return (
        <div className='parade-list'>
            <button onClick={() => {setCurrentYear(currentYear - 1)}}>prev year</button>
            <button onClick={() => {setCurrentYear(currentYear + 1)}}>next year</button>
            <h1>{currentYear} Parades</h1>
            {(cookies.get('Type') == 'Admin' || cookies.get('Type') == 'Officer' || cookies.get('Type') == 'Primer' ||
            cookies.get('Appointment') == 'CSM' || cookies.get('Appointment') == 'DY CSM' ||
            cookies.get('Appointment') == 'Admin Sergeant') &&
            <button onClick={showNewParadeForm}>Add Parade</button>
            }
            <br/>
            {parades.map((parade) => {
            return(
                <button key={parade.id} className={parade.id} onClick={showParadeInformation}>{parade.date.split('T')[0]}</button>
            )
            })}
        </div>
    )
}

ParadeList.propTypes = {
    setPageState: PropTypes.func.isRequired,
    reload: PropTypes.bool.isRequired
}

export { ParadeList }