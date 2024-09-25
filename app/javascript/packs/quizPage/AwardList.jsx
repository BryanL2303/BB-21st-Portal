import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AwardContext } from '../context/AwardContext'
import { errorMessage } from '../general/functions'

/*To access quizes and create new ones
*/
const AwardList = () => {
  const [_, setAward] = useContext(AwardContext)
  const [awards, setAwards] = useState([])

  useEffect(() => {
    axios.post('/api/award/0/get_awards', {}, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setAwards(resp.data['awards'])
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  //Switch to another topic
  function viewAward(e) {
    e.preventDefault()
    setAward({awardId: e.target.className, masteryId: '0'})
  }

  return(
    <div className='award-list'>
      <h1>Awards</h1>
      {awards.map((award) => {
        return(
          <button key={award.id} className={award.id} onClick = {viewAward}>{award.badge_name}</button>
        )
      })}
    </div>
  )
}

export { AwardList }