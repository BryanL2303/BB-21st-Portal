import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'
import { ParadeNoticePDF } from './ParadeNoticePDF'

const ParadeNoticePage = () => {
    const [nearestParade, setnearestParade] = useState(null)

    useEffect(() => {
        axios.get("/api/parade/0/parades_after_today", {}, { withCredentials: true })
        .then(resp => {
            axios.post('/api/parade/' + resp.data[0].id + '/get_parade', {}, {withCredentials: true})
            .then(resp => {
                setnearestParade(resp.data)
            })
            .catch(resp => console.log(resp.response.status))
        })
        .catch(resp => console.log(resp.response.status))
    }, [])

    return (
        <div className="parade-notice-page">
            {nearestParade ? 
                <ParadeNoticePDF parade={nearestParade} />
            : 
                <div>
                    <p>The Parade Notice has not been released</p>
                </div>
            }
        </div>
    )

}

export { ParadeNoticePage }