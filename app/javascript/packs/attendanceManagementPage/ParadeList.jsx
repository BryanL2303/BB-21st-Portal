import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import useCookies from '../general/useCookies'
import { handleServerError } from '../general/handleServerError'
import { HandleDownloadWithExcelJS } from './AnnualAttendanceExcel'

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

    function changeYear(direction) {
        if (currentYear + parseInt(direction) < 1984 || currentYear + parseInt(direction) > (new Date().getFullYear())) return
        setCurrentYear(currentYear + parseInt(direction))
    }

    return (
        <div className='parade-list'>
            <div>
                <div>
                    <div>
                        <button onClick={() => {changeYear("-1")}} aria-label='Previous Year'>
                            <i className='fa-solid fa-chevron-left'></i>
                        </button>
                        <h1>{currentYear}</h1>
                        <button onClick={() => {changeYear("1")}} aria-label='Next Year'>
                            <i className='fa-solid fa-chevron-right'></i>
                        </button>
                    </div>
                    <div>
                        {(cookies.get('Type') == 'Admin' || cookies.get('Type') == 'Officer' || cookies.get('Type') == 'Primer' ||
                        cookies.get('Appointment') == 'CSM' || cookies.get('Appointment') == 'DY CSM' ||
                        cookies.get('Appointment') == 'Admin Sergeant') &&
                        <button onClick={showNewParadeForm}><i className='fa-solid fa-plus'></i>New Parade</button>
                        }
                        <HandleDownloadWithExcelJS key={currentYear} year={currentYear}/>
                    </div>
                </div>
                <div>
                    {parades.slice().reverse().map((parade) => {
                    return(
                        <button key={parade.id} className={parade.id} onClick={showParadeInformation}>{parade.date.split('T')[0]}</button>
                    )
                    })}
                </div>
            </div>
        </div>
    )
}

ParadeList.propTypes = {
    setPageState: PropTypes.func.isRequired,
    reload: PropTypes.bool.isRequired
}

export { ParadeList }