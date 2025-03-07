import React from 'react'
import PropTypes from 'prop-types'

// To show attainment status for each special award
const AwardAttainmentTable = ({ award_name, boys, checked, toggleAttainment, electivePoints, ipaAttained, spaAttained }) => {
    const electiveAwards = ["Adventure", "Drill", "Arts & Crafts", "Athletics", "First Aid", "Hobbies", "Kayaking", "Musketry", "Sailing", "Sportsman", "Swimming"]
    const electiveMasteries = {"Adventure": ["Advanced"], "Drill": ["Advanced"], "Arts & Crafts": ["Basic", "Advanced"], "Athletics": ["Basic", "Advanced"], "First Aid": ["Basic", "Advanced"], "Hobbies": ["Basic", "Advanced"], "Kayaking": ["Basic", "Advanced"], "Musketry": ["Basic", "Advanced"], "Sailing": ["Basic", "Advanced"], "Sportsman": ["Basic", "Advanced"], "Swimming": ["Basic", "Advanced"]}
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

    return (
      <div style={{width: "100%"}}>
        <h1>{award_name}</h1>
        <table className="award-table">
          <thead>
              <tr>
                  <td rowSpan="2">Boy</td>
                  {award_name in fixedRequirements && fixedRequirements[award_name].map((requirement) => {
                    return(
                      <td key={requirement["name"]} rowSpan="2">{requirement["name"]}</td>
                    )
                  })}
                  {awards[award_name].map((award) => {
                      if (award in masteries[award_name]) {
                          return (
                              <td key={award + "-label"} colSpan={masteries[award_name][award].length}>{award}</td>
                          )
                      } else return (<td key={award + "-label"} rowSpan="2">{award}</td>)
                  })}
              </tr>
              <tr>
                {awards[award_name].map((award) => {
                  if (award in masteries[award_name])
                    return masteries[award_name][award].map((mastery) => (<td key={award + " " + mastery}>{mastery}</td>))
                })}
              </tr>
          </thead>
          <tbody>
              {boys.map((boy) => {
                  return (
                      <tr key={boy.id}>
                          <td className={boy.id + '-' + award_name}>{boy.account_name}</td>
                          {award_name in fixedRequirements && fixedRequirements[award_name].map((requirement) => {
                            return(
                              <td key={requirement["name"]}><input type='checkbox' disabled={true} checked={requirement['requirements'](boy)}></input></td>
                            )
                          })}
                          {awards[award_name].map(award => {
                              if (award in masteries[award_name])
                                return masteries[award_name][award].map((mastery) => (
                                  <td key={award+"-"+mastery+"-checkbox"}><input className={boy.id + "-" + award + '-' + mastery} type='checkbox' checked={checked[boy.id + "-" + award + '-' + mastery]} onChange={toggleAttainment}></input></td>
                                ))
                              else
                                return <td key={award+"-checkbox"}><input className={boy.id + "-" + award} type='checkbox' checked={checked[boy.id + "-" + award]} onChange={toggleAttainment}></input></td>
                          })}
                      </tr>
                  )
              })}
          </tbody>
        </table>
      </div>
    )
}

AwardAttainmentTable.propTypes = {
  award_name: PropTypes.string,
  boys: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    account_name: PropTypes.string,
    level: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })),
  checked: PropTypes.shape({
    id: PropTypes.number,
    account_name: PropTypes.string,
    level: PropTypes.number
  }),
  toggleAttainment: PropTypes.func.isRequired,
  electivePoints: PropTypes.shape({
    id: PropTypes.number,
  }),
  ipaAttained: PropTypes.shape({
    id: PropTypes.bool,
  }),
  spaAttained: PropTypes.shape({
    id: PropTypes.bool,
  })
}

export { AwardAttainmentTable }