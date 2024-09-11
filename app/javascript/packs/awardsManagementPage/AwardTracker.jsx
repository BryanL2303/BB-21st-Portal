import React, { useEffect, useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import Cookies from 'universal-cookie'
import axios from 'axios'

/*To show boys progression towards IPA/SPA/Founders
*/
const AwardTracker = ({awardId}) => {
  const cookies = new Cookies()
  const [boys, setBoys] = useState([])
  const electiveAwards = ["Arts & Crafts", "Athletics", "First Aid", "Hobbies", "Kayaking", "Musketry", "Sailing", "Sportsman", "Swimming"]
  const electiveMasteries = {"Arts & Crafts": ["Basic", "Advanced"], "Athletics": ["Basic", "Advanced"], "First Aid": ["Basic", "Advanced"], "Hobbies": ["Basic", "Advanced"], "Kayaking": ["Basic", "Advanced"], "Musketry": ["Basic", "Advanced"], "Sailing": ["Basic", "Advanced"], "Sportsman": ["Basic", "Advanced"], "Swimming": ["Basic", "Advanced"]}
  const ipaAwards = ["Target", "Adventure", "Drill", "Community Spiritedness", "Global Awareness", "Leadership"]
  const ipaMasteries = {"Adventure": ["Basic"], "Drill": ["Basic"], "Community Spiritedness": ["Advanced"], "Global Awareness": ["Basic"], "Leadership": ["Basic"]}
  const ipaFixedRequirements = [{'name': "1 Elective Points", 'requirements': (boy) => {return (electivePoints[boy.id] >= 1)}}]
  const spaAwards = ["Total Defence", "Global Awareness", "Leadership"]
  const spaMasteries = {"Total Defence": ["Silver"], "Global Awareness": ["Advanced"], "Leadership": ["Advanced"]}
  const spaFixedRequirements = [{'name': "IPA", 'requirements': (boy) => {return(ipaAttained[boy.id])}}, {'name': "4 Elective Points", 'requirements': (boy) => {return (electivePoints[boy.id] >= 4)}}]
  const foundersAwards = ["Christian Education", "Community Spiritedness", "Global Awareness", "Leadership"]
  const foundersMasteries = {"Community Spiritedness": ["Master"], "Global Awareness": ["Master"], "Leadership": ["Master"]}
  const foundersFixedRequirements = [{'name': "SPA", 'requirements': (boy) => {return(spaAttained[boy.id])}}, {'name': "6 Elective Points", 'requirements': (boy) => {return (electivePoints[boy.id] >= 6)}}]
  const awards = {"Electives": electiveAwards, "IPA": ipaAwards, "SPA": spaAwards, "Founders": foundersAwards}
  const masteries = {"Electives": electiveMasteries, "IPA": ipaMasteries, "SPA": spaMasteries, "Founders": foundersMasteries}
  const fixedRequirements = {"IPA": ipaFixedRequirements, "SPA": spaFixedRequirements, "Founders": foundersFixedRequirements}
  const [attained, setAttained] = useState({})
  const [electivePoints, setElectivePoints] = useState({})
  const [ipaAttained, setIpaAttained] = useState({})
  const [spaAttained, setSpaAttained] = useState({})
  const [foundersAttained, setFoundersAttained] = useState({})
  const [checkingMilestone, setCheckingMilestone] = useState(false)
  const milestones = ["IPA", "SPA", "Founders"]
  const milestonesAttained = {"IPA": ipaAttained, "SPA": spaAttained, "Founders": foundersAttained}

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  useEffect(() => {
    // Get information to load page
    axios.post('/api/account/0/get_accounts', {
        account_type: "Boy"
      })
      .then(resp => {
        setBoys(resp.data)
        let initialElectives = {}
        let initialAttained = {}
        resp.data.map((boy) => {
          initialElectives[boy.id] = 0
          initialAttained[boy.id] = false
        })
        setElectivePoints(initialElectives)
        setIpaAttained(initialAttained)
        setSpaAttained(initialAttained)
        setFoundersAttained(initialAttained)
        axios.post('/api/award_tracker/0/get_attainments', {})
        .then(resp => {
          setAttained(resp.data)
        })
        .catch(resp => console.log(resp.response.statusText))
      })
      .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  useEffect(() => {
    checkMilestones()
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
  }, [checkingMilestone])

  function checkMilestones() {
    setCheckingMilestone(true)
    let newElectivePoints = {...electivePoints}
    let newIpaAttained = {...ipaAttained}
    let newSpaAttained = {...spaAttained}
    let newFoundersAttained = {...foundersAttained}
    let specialAwards = [ipaAwards, spaAwards, foundersAwards]
    let specialMasteries = [ipaMasteries, spaMasteries, foundersMasteries]
    let newAttained = [newIpaAttained, newSpaAttained, newFoundersAttained]
    boys.map((boy) => {
      let electivePoint = 0
      electiveAwards.map((elective) => {
        if (elective in electiveMasteries) {
          electiveMasteries[elective].map((mastery) => {
            if (boy.id in attained) {
              if (elective in attained[boy.id]) {
                if (mastery in attained[boy.id][elective]) {
                  electivePoint += 1
                  console.log(boy.account_name)
                  console.log(elective)
                  console.log(mastery)
                }
              }
            }
          })
        } else {
          if (boy.id in attained) {
            if (elective in attained[boy.id]) {
              electivePoint += 1
            }
          }
        }
      })
      newElectivePoints[boy.id] = electivePoint

      specialAwards.forEach((specialAward, count) => {
        let specialAttained = true
        for (let i = 0; i < specialAward.length; i++) {
          let award = specialAward[i]
          let awardAttained = false
          if (award in specialMasteries[count]) {
            specialMasteries[count][award].map((mastery) => {
              if (boy.id in attained) {
                if (award in attained[boy.id]) {
                  if (mastery in attained[boy.id][award]) {
                    awardAttained = true
                  }
                }
              }
            })
          } else {
            if (boy.id in attained) {
              if (award in attained[boy.id]) {
                awardAttained = true
              }
            }
          } 
          if (awardAttained == false) {
            specialAttained = false
            break
          }
        }
        newAttained[count][boy.id] = specialAttained
      })
    })
    setElectivePoints(newElectivePoints)
    setIpaAttained(newAttained[0])
    setSpaAttained(newAttained[1])
    setFoundersAttained(newAttained[2])
    setTimeout(() => {
      setCheckingMilestone(false)
    }, 1000)
  }

  function addAttainedAward(e) {
    let target = e.target.className
    target = target.split('-')
    if (target.length == 3) {
        axios.post('/api/award_tracker/0/add_attainment', {
            account_id: target[0],
            award_name: target[1],
            mastery_name: target[2]
        })
        .then(resp => {
          setAttained(resp.data)
          checkMilestones()
        })
        .catch(resp => console.log(resp))
    } else if (target.length == 2) {
        axios.post('/api/award_tracker/0/add_attainment', {
            account_id: target[0],
            award_name: target[1]
        })
        .then(resp => {
          setAttained(resp.data)
          checkMilestones()
        })
        .catch(resp => errorMessage(resp.response.statusText))
    }
  }

  function deleteAttainedAward(e) {
    let target = e.target.className
    target = target.split('-')
    if (target.length == 3) {
        axios.post('/api/award_tracker/0/delete_attainment', {
            account_id: target[0],
            award_name: target[1],
            mastery_name: target[2]
        })
        .then(resp => {
          setAttained(resp.data)
          checkMilestones()
        })
        .catch(resp => errorMessage(resp.response.statusText))
    } else if (target.length == 2) {
        axios.post('/api/award_tracker/0/delete_attainment', {
            account_id: target[0],
            award_name: target[1]
        })
        .then(resp => {
          setAttained(resp.data)
          checkMilestones()
        })
        .catch(resp => errorMessage(resp.response.statusText))
    }
  }

  function toggleAttainment(e) {
    if (e.target.checked == true) {
        addAttainedAward(e)
    } else {
        deleteAttainedAward(e)
    }
  }

  const AwardAttainmentTable = ({award_name}) => {
    return (
      <div style={{width: "100%"}}>
        <h1>{award_name}</h1>
        <table className="award-table">
          <thead>
              <tr>
                  <td rowSpan="2">Boy</td>
                  {award_name in fixedRequirements && fixedRequirements[award_name].map((requirement) => {
                    return(
                      <td rowSpan="2">{requirement["name"]}</td>
                    )
                  })}
                  {awards[award_name].map((award) => {
                      if (award in masteries[award_name]) {
                          return (
                              <td colSpan={masteries[award_name][award].length}>{award}</td>
                          )
                      } else {
                          return (
                              <td rowSpan="2">{award}</td>
                          )
                      }
                  })}
                  
              </tr>
              <tr>
                {awards[award_name].map((award) => {
                  if (award in masteries[award_name]) {
                    return masteries[award_name][award].map((mastery) => (
                      <td>{mastery}</td>
                    ))
                  }
                })}
              </tr>
          </thead>
          <tbody>
              {boys.map((boy) => {
                  return (
                      <tr>
                          <td className={boy.id + '-' + award_name}>{boy.account_name}</td>
                          {award_name in fixedRequirements && fixedRequirements[award_name].map((requirement) => {
                            return(
                              <td><input type='checkbox' disabled={true} checked={requirement['requirements'](boy)}></input></td>
                            )
                          })}
                          {awards[award_name].map(award => {
                              if (award in masteries[award_name]) {
                                return masteries[award_name][award].map((mastery) => (
                                  <td><input className={boy.id + "-" + award + '-' + mastery} type='checkbox' defaultChecked={boy.id in attained && award in attained[boy.id] && mastery in attained[boy.id][award]} onChange={toggleAttainment}></input></td>
                                ))
                              } else {
                                  return (
                                      <td><input className={boy.id + "-" + award} type='checkbox' defaultChecked={boy.id in attained && award in attained[boy.id]} onChange={toggleAttainment}></input></td>
                                  )
                              }
                          })}
                      </tr>
                  )
              })}
          </tbody>
        </table>
      </div>
    )
  }

  return(
    <div className='award-tracker'>
      {["Electives", "IPA", "SPA", "Founders"].map((special_award) => {
        return (
          <div style={{width: "100%"}}>{!checkingMilestone && <AwardAttainmentTable award_name={special_award}/>}</div>
        )
      })}
    </div>
  )
}

export { AwardTracker }