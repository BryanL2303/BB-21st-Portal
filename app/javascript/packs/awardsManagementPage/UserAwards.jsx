import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

const UserAwards = () => {
    const [awards, setAwards] = useState({})
    const [attained, setAttained] = useState({})
    
    useEffect(() => {
        axios.post("/application/0/check_session", {}, { withCredentials: true })
        .then(response => {
            if (response.data.user?.account_type != "Boy") window.location.href = '/home'

            axios.get('/api/award_tracker/0/user_awards')
            .then(response => setAttained(response.data.map(award => `${award.award_id}-${award.mastery_id}`)))
            .catch(error => handleServerError(error.response?.status))

            axios.get('/api/award_tracker/0/all_awards')
            .then(response => setAwards(response.data))
            .catch(error => handleServerError(error.response?.status))
        })
        .catch(() => { window.location.href = '/' })
    }, [])

    return (
        <div className='user-awards'>
            <h2>User Awards</h2>

            <div className='awards-list'>
                {Object.entries(awards).map(([badge_name, { award, masteries, image_url }]) => {
                    return <div key={badge_name} className='award'>
                        <img src={image_url} alt={badge_name} />

                        <div>
                            <h3>{badge_name}</h3>
                            {award.has_mastery ? masteries.map(mastery => (
                                <div key={`${badge_name}-${mastery.id}`}>
                                    <p>{mastery.name}</p>
                                    <i className={attained.includes(`${award.id}-${mastery.id}`) ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}></i>
                                </div>
                            )) : 
                            <div>
                                <p>Core</p>
                                <i className={attained.includes(`${award.id}-null`) ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}></i>   
                            </div>}
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export { UserAwards }