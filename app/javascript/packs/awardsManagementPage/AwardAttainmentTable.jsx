import React from 'react'
import PropTypes from 'prop-types'

// To show attainment status for each special award
const AwardAttainmentTable = ({ award_name, boys, checked, toggleAttainment, electivePoints, ipaAttained, spaAttained }) => {
	const electiveAwards = ["Adventure", "Drill", "Arts & Crafts", "Athletics", "First Aid", "Hobbies", "Kayaking", "Musketry", "Sailing", "Sportsman", "Swimming"]
	const electiveMasteries = { "Adventure": ["Advanced"], "Drill": ["Advanced"], "Arts & Crafts": ["Basic", "Advanced"], "Athletics": ["Basic", "Advanced"], "First Aid": ["Basic", "Advanced"], "Hobbies": ["Basic", "Advanced"], "Kayaking": ["Basic", "Advanced"], "Musketry": ["Basic", "Advanced"], "Sailing": ["Basic", "Advanced"], "Sportsman": ["Basic", "Advanced"], "Swimming": ["Basic", "Advanced"] }
	const ipaAwards = ["Target", "Adventure", "Drill", "Community Spiritedness", "Global Awareness", "Leadership"]
	const ipaMasteries = { "Adventure": ["Basic"], "Drill": ["Basic"], "Community Spiritedness": ["Advanced"], "Global Awareness": ["Basic"], "Leadership": ["Basic"] }
	const ipaFixedRequirements = [{ 'name': "1 Elective Points", 'requirements': (boy) => { return (electivePoints[boy.id] >= 1) } }]
	const spaAwards = ["Total Defence", "Global Awareness", "Leadership"]
	const spaMasteries = { "Total Defence": ["Silver"], "Global Awareness": ["Advanced"], "Leadership": ["Advanced"] }
	const spaFixedRequirements = [{ 'name': "IPA", 'requirements': (boy) => { return (ipaAttained[boy.id]) } }, { 'name': "4 Elective Points", 'requirements': (boy) => { return (electivePoints[boy.id] >= 4) } }]
	const foundersAwards = ["Christian Education", "Community Spiritedness", "Global Awareness", "Leadership"]
	const foundersMasteries = { "Community Spiritedness": ["Master"], "Global Awareness": ["Master"], "Leadership": ["Master"] }
	const foundersFixedRequirements = [{ 'name': "SPA", 'requirements': (boy) => { return (spaAttained[boy.id]) } }, { 'name': "6 Elective Points", 'requirements': (boy) => { return (electivePoints[boy.id] >= 6) } }]
	const awards = { "Electives": electiveAwards, "IPA": ipaAwards, "SPA": spaAwards, "Founders": foundersAwards }
	const masteries = { "Electives": electiveMasteries, "IPA": ipaMasteries, "SPA": spaMasteries, "Founders": foundersMasteries }
	const fixedRequirements = { "IPA": ipaFixedRequirements, "SPA": spaFixedRequirements, "Founders": foundersFixedRequirements }
	const numberColumns = { "Electives": 20, "IPA": 7, "SPA": 5, "Founders": 6 }

	return (
		<div className="award-attainment-table">
			<h1>{award_name}</h1>
			<div className="award-table" style={{ "--columns": numberColumns[award_name] }}>
				<p className='boy-header award-header'>Boy</p>
				{award_name in fixedRequirements && fixedRequirements[award_name].map((requirement) => {
					return (
						<p key={requirement["name"]} style={{ "--rowspan": "2" }} className='award-header'>{requirement["name"]}</p>
					)
				})}

				{awards[award_name].map((award) => {
					if (award in masteries[award_name]) {
						return (
							<p key={award + "-label"} style={{ "--colspan": masteries[award_name][award].length }} className='award-header'>{award}</p>
						)
					} else return (<p key={award + "-label"} style={{ "--rowspan": "2" }} className='award-header'>{award}</p>)
				})}
				{awards[award_name].map((award) => {
					if (award in masteries[award_name])
						return masteries[award_name][award].map((mastery) => (<p key={award + " " + mastery} className='award-header'>{mastery}</p>))
				})}

				{boys.map((boy) => {
					return (
						<React.Fragment key={boy.id}>
							<p className={`${boy.id}-${award_name} award-boy`}>{boy.account_name}</p>
							{award_name in fixedRequirements && fixedRequirements[award_name].map((requirement) => {
								return (
									<p key={requirement["name"]}>
										<input type='checkbox' disabled={true} checked={!!requirement['requirements'](boy)} />
									</p>
								)
							})}
							{awards[award_name].map(award => {
								if (award in masteries[award_name])
									return masteries[award_name][award].map((mastery) => (
										<p key={award + "-" + mastery + "-checkbox"}>
											<input className={boy.id + "-" + award + '-' + mastery} type='checkbox' checked={!!checked[boy.id + "-" + award + '-' + mastery]} onChange={toggleAttainment} name='award-tracker-checkbox' />
										</p>
									))
								else
									return (
										<p key={award + "-checkbox"}>
											<input className={boy.id + "-" + award} type='checkbox' checked={!!checked[boy.id + "-" + award]} onChange={toggleAttainment} name='award-tracker-checkbox' />
										</p>
									)
							})}
						</React.Fragment>
					)
				})}
			</div>
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