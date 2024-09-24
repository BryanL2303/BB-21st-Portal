import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as xlsx from 'xlsx';

/*To show boys progression towards IPA/SPA/Founders
*/
const AwardTracker = () => {
  const [boys, setBoys] = useState([])
  const [boyNames, setBoyNames] = useState({})
  const [boyIds, setBoyIds] = useState({})
  const regularMasteries = {1: "Basic", 2: "Advanced", 3: "Master"}
  const specialMasteries = {"Total Defence": {1: "Bronze", 2: "Silver", 3: "Gold"}}
  const electiveAwards = ["Adventure", "Drill", "Arts & Crafts", "Athletics", "First Aid", "Hobbies", "Kayaking", "Musketry", "Sailing", "Sportsman", "Swimming"]
  const electiveMasteries = {"Adventure": ["Advanced"], "Drill": ["Advanced"], "Arts & Crafts": ["Basic", "Advanced"], "Athletics": ["Basic", "Advanced"], "First Aid": ["Basic", "Advanced"], "Hobbies": ["Basic", "Advanced"], "Kayaking": ["Basic", "Advanced"], "Musketry": ["Basic", "Advanced"], "Sailing": ["Basic", "Advanced"], "Sportsman": ["Basic", "Advanced"], "Swimming": ["Basic", "Advanced"]}
  // Only for elective badges that gives more than 1 point
  const electiveSpecialPoints = {"Adventure Advanced": 2, 'Drill Advanced': 2}
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
  const [changeLog, setChangeLog] = useState({})
  const [checked, setChecked] = useState({})

  useEffect(() => {
    // Get information to load page
    axios.post('/api/account/0/get_accounts', {
        account_type: "Boy"
      }, {
        withCredentials: true  // Include credentials (cookies)
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
        setElectivePoints(initialElectives)
        setIpaAttained(initialAttained)
        setSpaAttained(initialAttained)
        setFoundersAttained(initialAttained)
        axios.post('/api/award_tracker/0/get_attainments', {}, {
          withCredentials: true  // Include credentials (cookies)
        })
        .then(resp => {
          setAttained(resp.data)
          setChangeLog({})
        })
        .catch(resp => console.log(resp.response.statusText))
      })
      .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  useEffect(() => {
    checkMilestones()
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

  function checkMilestones() {
    setCheckingMilestone(true)
    let newElectivePoints = {...electivePoints}
    let newIpaAttained = {...ipaAttained}
    let newSpaAttained = {...spaAttained}
    let newFoundersAttained = {...foundersAttained}
    let specialAwards = [ipaAwards, spaAwards, foundersAwards]
    let specialMasteries = [ipaMasteries, spaMasteries, foundersMasteries]
    let newAttained = [newIpaAttained, newSpaAttained, newFoundersAttained]
    let milestones = ["IPA", "SPA", "Founders"]
    let defaultChecked = {}
    boys.map((boy) => {
      let electivePoint = 0
      electiveAwards.map((elective) => {
        if (elective in electiveMasteries) {
          electiveMasteries[elective].map((mastery) => {
            if (boy.id in attained) {
              if (elective in attained[boy.id]) {
                if (mastery in attained[boy.id][elective]) {
                  defaultChecked[boy.id + "-" + elective + '-' + mastery] = true
                  if (elective + " " + mastery in electiveSpecialPoints) {
                    electivePoint += electiveSpecialPoints[elective + " " + mastery]
                  } else {
                    electivePoint += 1
                  }
                } else {
                  defaultChecked[boy.id + "-" + elective + '-' + mastery] = false
                }
              }
            }
          })
        } else {
          if (boy.id in attained) {
            if (elective in attained[boy.id]) {
              defaultChecked[boy.id + "-" + elective + '-' + mastery] = true
              if (elective + " " + mastery in electiveSpecialPoints) {
                electivePoint += electiveSpecialPoints[elective + " " + mastery]
              } else {
                electivePoint += 1
              }
            } else {
              defaultChecked[boy.id + "-" + elective + '-' + mastery] = false
            }
          }
        }
      })
      newElectivePoints[boy.id] = electivePoint

      specialAwards.forEach((specialAward, count) => {
        let specialAttained = true
        if (milestones[count] in fixedRequirements) {
          fixedRequirements[milestones[count]].map((requirementDict) => {
            if (!requirementDict["requirements"](boy)) {
              specialAttained = false
            }
          })
        }
        for (let i = 0; i < specialAward.length; i++) {
          let award = specialAward[i]
          let awardAttained = false
          if (award in specialMasteries[count]) {
            specialMasteries[count][award].map((mastery) => {
              if (boy.id in attained) {
                if (award in attained[boy.id]) {
                  if (mastery in attained[boy.id][award]) {
                    defaultChecked[boy.id + "-" + award + '-' + mastery] = true
                    awardAttained = true
                  } else {
                    defaultChecked[boy.id + "-" + award + '-' + mastery] = false
                  }
                }
              }
            })
          } else {
            if (boy.id in attained) {
              if (award in attained[boy.id]) {
                defaultChecked[boy.id + "-" + award] = true
                awardAttained = true
              } else {
                defaultChecked[boy.id + "-" + award] = false
              }
            }
          } 
          if (awardAttained == false) {
            specialAttained = false
            //break
          }
        }
        newAttained[count][boy.id] = specialAttained
      })
    })
    setChecked(defaultChecked)
    setElectivePoints(newElectivePoints)
    setIpaAttained(newAttained[0])
    setSpaAttained(newAttained[1])
    setFoundersAttained(newAttained[2])
    setTimeout(() => {
      setCheckingMilestone(false)
    }, 1000)
  }

  function readUploadFile(e) {
    let boyToAttained = {}
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = xlsx.read(data, {type: "array"})
      const sheetNames = workbook.SheetNames;
      sheetNames.map((sheetName) => {
        let sheetOfInterest = workbook["Sheets"][sheetName]
        delete sheetOfInterest['C1']
        const json = xlsx.utils.sheet_to_json(workbook["Sheets"][sheetName]);
        let colToAward = {}
        Object.entries(json[0]).map(([key, award]) => {
          if (electiveAwards.includes(award) || ipaAwards.includes(award) || spaAwards.includes(award) || foundersAwards.includes(award)) {
            colToAward[key.split("_")[3]] = award
          }
        })
        json.map((boyData, index) => {
          if (index != 0 && index != 1) {
            let boyName = boyData["__EMPTY_1"]
            if (Object.values(boyNames).includes(boyName)) {
              if (!(boyIds[boyName] in boyToAttained)) {
                boyToAttained[boyIds[boyName]] = {}
              }
              let currentAward = ""
              let currentMastery = 1
              Object.entries(boyData).map(([key, attainment], index) => {
                if (index != 0 && index != 1) {
                  let col = key.split("_")[3]
                  if (col in colToAward) {
                    currentAward = colToAward[col]
                    currentMastery = 1
                    boyToAttained[boyIds[boyName]][currentAward] = {}
                  }
                  if (currentAward != "" && currentMastery <=3) {
                    if (currentAward in specialMasteries) {
                      boyToAttained[boyIds[boyName]][currentAward][specialMasteries[currentAward][currentMastery]] = (attainment == "Attained")
                    } else {
                      boyToAttained[boyIds[boyName]][currentAward][regularMasteries[currentMastery]] = (attainment == "Attained")
                    }
                    currentMastery += 1
                  }
                }
              })
            }
          }
        })
      })
      // Process boyToAttained
      Object.entries(boyToAttained).map(([id, awardDict]) => {
        Object.entries(awardDict).map(([awardName, masteryDict]) => {
          Object.entries(masteryDict).map(([masteryName, attainment]) => {
            let element = document.getElementsByClassName(id + "-" + awardName + "-" + masteryName)
            if (element.length != 0) {
              element = element[0]
              if (element.checked != attainment) {
                element.checked = attainment
                toggleAttainment({target: element})
              }
            } else if (masteryName == "Basic") {
              try {
                element = document.getElementsByClassName(id + "-" + awardName)[0]
                if (element.checked != attainment) {
                  console.log("Toggle " + awardName)
                  element.checked = attainment
                  console.log(element.checked)
                  toggleAttainment({target: element})
                }                
              } catch (error) {console.log(awardName)}
            }
          })
        })
      })
    }
    reader.readAsArrayBuffer(e.target.files[0]);
  }

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
      }, {
        withCredentials: true  // Include credentials (cookies)
      })
      .then(resp => {
        setAttained(resp.data)
        checkMilestones()
      })
      .catch(resp => console.log(resp))
    }
  }

  function addAttainedAward(e) {
    let target = e.target.className
    setChangeLog((prevLog) => {
      let currentLog = { ...prevLog };
      if (target in currentLog) {
        delete currentLog[target];
      } else {
        currentLog[target] = "add";
      }
      return currentLog;
    });
  }

  function deleteAttainedAward(e) {
    let target = e.target.className
    setChangeLog((prevLog) => {
      let currentLog = { ...prevLog };
      if (target in currentLog) {
        delete currentLog[target];
      } else {
        currentLog[target] = "delete";
      }
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
                                  <td><input className={boy.id + "-" + award + '-' + mastery} type='checkbox' checked={checked[boy.id + "-" + award + '-' + mastery]} onChange={toggleAttainment}></input></td>
                                ))
                              } else {
                                  return (
                                      <td><input className={boy.id + "-" + award} type='checkbox' checked={checked[boy.id + "-" + award]} onChange={toggleAttainment}></input></td>
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
      <label>Upload award trackers from BB Members Portal here:</label>
      <br/>
      <input type="file" onChange={readUploadFile}></input>
      <div>
        {Object.entries(changeLog).map(([award, change]) => {
          let target = award.split("-")
          return(
            <p>{boyNames[target[0]]}: {change} {target.length === 2 ? target[1] : target[1] + " " + target[2]}</p>
          )
        })}
        {Object.keys(changeLog).length != 0 && <button onClick={saveChanges}>Save Changes</button>}
      </div>
      {["Electives", "IPA", "SPA", "Founders"].map((special_award) => {
        return (
          <div style={{width: "100%"}}>{!checkingMilestone && <AwardAttainmentTable award_name={special_award}/>}</div>
        )
      })}
    </div>
  )
}

export { AwardTracker }