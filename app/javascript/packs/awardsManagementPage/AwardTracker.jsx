import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types'
import axios from 'axios'
import { checkMilestones } from './functions'
import { AwardFileReader } from './AwardFileReader'
import { AwardAttainmentTable } from './AwardAttainmentTable'
import { handleServerError } from '../general/handleServerError'

// To show boys progression towards IPA/SPA/Founders
const AwardTracker = () => {
  const [boys, setBoys] = useState([])
  const [boyNames, setBoyNames] = useState({})
  const [boyIds, setBoyIds] = useState({})
  const [selectedBoys, setSelectedBoys] = useState([])
  const [attained, setAttained] = useState({})
  const [electivePoints, setElectivePoints] = useState({})
  const [ipaAttained, setIpaAttained] = useState({})
  const [spaAttained, setSpaAttained] = useState({})
  const [foundersAttained, setFoundersAttained] = useState({})
  const [checkingMilestone, setCheckingMilestone] = useState(false)
  const milestones = ["IPA", "SPA", "Founders"]
  const milestonesAttained = {"IPA": ipaAttained, "SPA": spaAttained, "Founders": foundersAttained}
  const [changeLog, setChangeLog] = useState({})
  const [checked, setChecked] = useState({})

  useEffect(() => {
    // Get information to load page
    axios.post('/api/account/0/get_accounts_by_type', {
        account_type: "Boy"
      }, {
        withCredentials: true
      })
      .then(resp => {
        setBoys(resp.data)
        let initialElectives = {}
        let initialAttained = {}
        let tempBoyNames = {}
        let tempBoyIds = {}
        resp.data.map((boy) => {
          initialElectives[boy.id] = 0
          initialAttained[boy.id] = false
          tempBoyNames[boy.id] = boy.account_name
          tempBoyIds[boy.account_name] = boy.id
        })
        setBoyNames(tempBoyNames)
        setBoyIds(tempBoyIds)
        setSelectedBoys(resp.data)
        setElectivePoints(initialElectives)
        setIpaAttained(initialAttained)
        setSpaAttained(initialAttained)
        setFoundersAttained(initialAttained)
        axios.post('/api/award_tracker/0/get_attainments', {}, {
          withCredentials: true
        })
        .then(resp => {
          setAttained(resp.data)
          setChangeLog({})
        })
        .catch(resp => handleServerError(resp.response.status))
      })
      .catch(resp => handleServerError(resp.response.status))
  }, [])

  useEffect(() => {
    checkMilestones(boys, attained, setCheckingMilestone, electivePoints, ipaAttained, spaAttained, foundersAttained, setElectivePoints, setIpaAttained, setSpaAttained, setFoundersAttained, setChecked)
    setChangeLog({})
  }, [boys, attained])

  useEffect(() => {
    if (!checkingMilestone) {
      milestones.forEach((milestone) => {
        boys.forEach((boy) => {
          if (boy.id in milestonesAttained[milestone] && milestonesAttained[milestone][boy.id]) {
            let element = document.getElementsByClassName(boy.id + "-" + milestone)[0]
            element.style.backgroundColor = "lightgreen"
          }
        })
      })
    }
  }, [checkingMilestone, checked])

  function saveChanges() {
    if (confirm("This will save the following changes:" + Object.entries(changeLog).map(([target, change]) => {
      target = target.split("-")
      return("\n" + boyNames[target[0]] + ": " +  change + " " + (target.length === 2 ? target[1] : target[1] + " " + target[2]))
    }))) {
      let addList = []
      let deleteList = []
      Object.entries(changeLog).map(([target, change]) => {
        target = target.split('-')
        if (target.length == 3) {
          let info = {account_id: target[0], award_name: target[1], mastery_name: target[2]}
          if (change == 'add') {
            addList = [...addList, info]
          } else if (change == 'delete') {
            deleteList = [...deleteList, info]
          }
        } else if (target.length == 2) {
          let info = {account_id: target[0], award_name: target[1]}
          if (change == 'add') {
            addList = [...addList, info]
          } else if (change == 'delete') {
            deleteList = [...deleteList, info]
          }
        }
      })
      axios.post('/api/award_tracker/0/process_changes', {
        add: addList,
        delete: deleteList
      }, {withCredentials: true})
      .then(resp => {
        setAttained(resp.data)
        checkMilestones(boys, attained, setCheckingMilestone, electivePoints, ipaAttained, spaAttained, foundersAttained, setElectivePoints, setIpaAttained, setSpaAttained, setFoundersAttained, setChecked)
      })
      .catch(resp => handleServerError(resp.response.status))
    }
  }

  function selectBoy() {
    let newSelectedBoys = []
    boys.map((boy, index) => {
      let input = document.getElementsByClassName('boy-account-selector-' + index)[0]
      if (input.checked) {
        newSelectedBoys.push(boy)
      }
    })
    setSelectedBoys(newSelectedBoys)
  }

  function selectAllBoys() {
    setSelectedBoys(boys)
    boys.map((_, index) => {
      let input = document.getElementsByClassName('boy-account-selector-' + index)[0]
      input.checked = true
    })
  }

  function unSelectAllBoys() {
    setSelectedBoys([])
    boys.map((_, index) => {
      let input = document.getElementsByClassName('boy-account-selector-' + index)[0]
      input.checked = false
    })
  }

  function addAttainedAward(e) {
    let target = e.target.className
    setChangeLog((prevLog) => {
      let currentLog = { ...prevLog };
      if (target in currentLog) delete currentLog[target];
      else currentLog[target] = "add";
      return currentLog;
    });
  }

  function deleteAttainedAward(e) {
    let target = e.target.className
    setChangeLog((prevLog) => {
      let currentLog = { ...prevLog };
      if (target in currentLog) delete currentLog[target];
      else currentLog[target] = "delete";
      return currentLog;
    });
  }

  function toggleAttainment(e) {
    setChecked((prevChecked) => {
      let newChecked = { ...prevChecked };
      newChecked[e.target.className] = !newChecked[e.target.className];
      return newChecked;
    });
    if (e.target.checked == true) {
        addAttainedAward(e)
    } else {
        deleteAttainedAward(e)
    }
  }

  return(
    <div className='award-tracker'>
      <AwardFileReader boyIds={boyIds} boyNames={boyNames} toggleAttainment={toggleAttainment} />
      <div>
        {Object.entries(changeLog).map(([award, change]) => {
          let target = award.split("-")
          return(
            <p key={award}>{boyNames[target[0]]}: {change} {target.length === 2 ? target[1] : target[1] + " " + target[2]}</p>
          )
        })}
        {Object.keys(changeLog).length != 0 && <button onClick={saveChanges}>Save Changes</button>}
      </div>
      <div>
        <Popup className='account-filter-popup' trigger={<button className="img-button"><img className="filter-account-img" src="/packs/media/packs/general/filter-line-icon-75b677be9dfe5ecb38441d43e9bed3d6.png" alt='Filter'></img></button>} position="bottom left">
          <button onClick={selectAllBoys}>Select All</button>
          <button onClick={unSelectAllBoys}>Unselect All</button>
          {boys.map((boy, index) => {
            return(
              <div key={boy.id + "-checkbox"} className='account-display'>
                <input type='checkbox' className={'boy-account-selector-' + index} id={index} onChange={selectBoy} defaultChecked={selectedBoys.includes(boy)}></input>
                <label> Sec {boy.level} {boy.rank} {boy.account_name}</label>
              </div>
            )
          })}
        </Popup>
      </div>
      {["Electives", "IPA", "SPA", "Founders"].map((special_award) => {
        return (
          <div key={special_award} style={{width: "100%"}}>{!checkingMilestone && <AwardAttainmentTable award_name={special_award} boys={selectedBoys} checked={checked} toggleAttainment={toggleAttainment} electivePoints={electivePoints} ipaAttained={ipaAttained} spaAttained={spaAttained} />}</div>
        )
      })}
    </div>
  )
}

AwardTracker.propTypes = {
  award_name: PropTypes.string
}

export { AwardTracker }