import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import useCookies from '../general/useCookies'
import { handleServerError } from '../general/handleServerError'

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
    }

    function showParadeInformation(e) {
        setPageState(e.target.className)
    }

    return (
        <div className='parade-list'>
            <div>
                <button onClick={() => {setCurrentYear(currentYear - 1)}} aria-label='Previous Year'>
                    <i className='fa-solid fa-chevron-left'></i>
                </button>
                <h1>{currentYear}</h1>
                <button onClick={() => {setCurrentYear(currentYear + 1)}} aria-label='Next Year'>
                    <i className='fa-solid fa-chevron-right'></i>
                </button>
                {(cookies.get('Type') == 'Admin' || cookies.get('Type') == 'Officer' || cookies.get('Type') == 'Primer' ||
                cookies.get('Appointment') == 'CSM' || cookies.get('Appointment') == 'DY CSM' ||
                cookies.get('Appointment') == 'Admin Sergeant') &&
                <button onClick={showNewParadeForm}>Add Parade</button>
                }
            </div>
            <br/>
            <div>
                {parades.slice().reverse().map((parade) => {
                return(
                    <button key={parade.id} className={parade.id} onClick={showParadeInformation}>{parade.date.split('T')[0]}</button>
                )
                })}
            </div>
        </div>
    )
}

ParadeList.propTypes = {
    setPageState: PropTypes.func.isRequired,
    reload: PropTypes.bool.isRequired
}

export { ParadeList }