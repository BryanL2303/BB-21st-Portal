const electiveAwards = ["Adventure", "Drill", "Arts & Crafts", "Athletics", "First Aid", "Hobbies", "Kayaking", "Musketry", "Sailing", "Sportsman", "Swimming"]
const electiveMasteries = {"Adventure": ["Advanced"], "Drill": ["Advanced"], "Arts & Crafts": ["Basic", "Advanced"], "Athletics": ["Basic", "Advanced"], "First Aid": ["Basic", "Advanced"], "Hobbies": ["Basic", "Advanced"], "Kayaking": ["Basic", "Advanced"], "Musketry": ["Basic", "Advanced"], "Sailing": ["Basic", "Advanced"], "Sportsman": ["Basic", "Advanced"], "Swimming": ["Basic", "Advanced"]}
// Only for elective badges that gives more than 1 point
const electiveSpecialPoints = {"Adventure Advanced": 2, 'Drill Advanced': 2}
const ipaAwards = ["Target", "Adventure", "Drill", "Community Spiritedness", "Global Awareness", "Leadership"]
const ipaMasteries = {"Adventure": ["Basic"], "Drill": ["Basic"], "Community Spiritedness": ["Advanced"], "Global Awareness": ["Basic"], "Leadership": ["Basic"]}
const spaAwards = ["Total Defence", "Global Awareness", "Leadership"]
const spaMasteries = {"Total Defence": ["Silver"], "Global Awareness": ["Advanced"], "Leadership": ["Advanced"]}
const foundersAwards = ["Christian Education", "Community Spiritedness", "Global Awareness", "Leadership"]
const foundersMasteries = {"Community Spiritedness": ["Master"], "Global Awareness": ["Master"], "Leadership": ["Master"]}

function checkMilestones(boys, attained, setCheckingMilestone, electivePoints, ipaAttained, spaAttained, foundersAttained, setElectivePoints, setIpaAttained, setSpaAttained, setFoundersAttained, setChecked) {
    const ipaFixedRequirements = [{'name': "1 Elective Points", 'requirements': (boy, newElectivePoints) => {return (newElectivePoints[boy.id] >= 1)}}]
    const spaFixedRequirements = [{'name': "IPA", 'requirements': (boy, newIpaAttained) => {return(newIpaAttained[boy.id])}}, {'name': "4 Elective Points", 'requirements': (boy, newElectivePoints) => {return (newElectivePoints[boy.id] >= 4)}}]
    const foundersFixedRequirements = [{'name': "SPA", 'requirements': (boy, newSpaAttained) => {return(newSpaAttained[boy.id])}}, {'name': "6 Elective Points", 'requirements': (boy, newElectivePoints) => {return (newElectivePoints[boy.id] >= 6)}}]
    const fixedRequirements = {"IPA": ipaFixedRequirements, "SPA": spaFixedRequirements, "Founders": foundersFixedRequirements}

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
      if (boy.id in attained) {
        electiveAwards.map((elective) => {
          if (elective in electiveMasteries) {
            electiveMasteries[elective].map((mastery) => {
              if (elective in attained[boy.id]) {
                defaultChecked[boy.id + "-" + elective + '-' + mastery] = mastery in attained[boy.id][elective]
                if (mastery in attained[boy.id][elective])
                  electivePoint += (elective + " " + mastery) in electiveSpecialPoints
                   ? electiveSpecialPoints[elective + " " + mastery] : 1
              }
            })
          } else {
            defaultChecked[boy.id + "-" + elective] = elective in attained[boy.id]
            if (elective in attained[boy.id])
              electivePoint += elective in electiveSpecialPoints ? electiveSpecialPoints[elective] : 1
          }
        })
      }
      newElectivePoints[boy.id] = electivePoint

      specialAwards.forEach((specialAward, count) => {
        let specialAttained = true
        if (milestones[count] in fixedRequirements) {
          fixedRequirements[milestones[count]].map((requirementDict) => {
            let metRequirements
            if (requirementDict["name"].includes('Elective Points')) metRequirements = requirementDict["requirements"](boy, newElectivePoints)
            else metRequirements = requirementDict["requirements"](boy, newAttained[count - 1])
            if (!metRequirements) specialAttained = false
          })
        }
        for (let i = 0; i < specialAward.length; i++) {
          let award = specialAward[i]
          let awardAttained = false
          if (boy.id in attained) {
            if (award in specialMasteries[count]) {
              specialMasteries[count][award].map((mastery) => {
                if (award in attained[boy.id]) {
                  defaultChecked[boy.id + "-" + award + '-' + mastery] = mastery in attained[boy.id][award]
                  if (mastery in attained[boy.id][award]) awardAttained = true
                }
              })
            } else {
              defaultChecked[boy.id + "-" + award] = award in attained[boy.id]
              if (award in attained[boy.id]) awardAttained = true
            }
          }
          if (awardAttained == false) specialAttained = false
        }
        newAttained[count][boy.id] = specialAttained
      })
    })
    setChecked(defaultChecked)
    setElectivePoints(newElectivePoints)
    setIpaAttained(newAttained[0])
    setSpaAttained(newAttained[1])
    setFoundersAttained(newAttained[2])
    setTimeout(() => {setCheckingMilestone(false)}, 1000)
}

export { checkMilestones }