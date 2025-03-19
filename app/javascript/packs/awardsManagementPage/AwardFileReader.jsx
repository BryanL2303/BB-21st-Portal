import React from 'react'
import PropTypes from 'prop-types'
import * as xlsx from 'xlsx';

const AwardFileReader = ({ boyIds, boyNames, toggleAttainment }) => {
	const regularMasteries = { 1: "Basic", 2: "Advanced", 3: "Master" }
	const specialMasteries = { "Total Defence": { 1: "Bronze", 2: "Silver", 3: "Gold" } }
	const electiveAwards = ["Adventure", "Drill", "Arts & Crafts", "Athletics", "First Aid", "Hobbies", "Kayaking", "Musketry", "Sailing", "Sportsman", "Swimming"]
	const ipaAwards = ["Target", "Adventure", "Drill", "Community Spiritedness", "Global Awareness", "Leadership"]
	const spaAwards = ["Intermediary Proficiency Award", "Total Defence", "Global Awareness", "Leadership"]
	const foundersAwards = ["Senior Proficiency Award", "Christian Education", "Community Spiritedness", "Global Awareness", "Leadership"]
	const serviceAwards = ["Link Badge", "1 Year Service (First Year)", "1 Year Service (Second Year)", "1 Year Service (Third Year)", "3 Year Service", "National Event"]

	function readUploadFile(e) {
		let boyToAttained = {}
		const reader = new FileReader();
		reader.onload = (e) => {
			const data = e.target.result;
			const workbook = xlsx.read(data, { type: "array" })
			const sheetNames = workbook.SheetNames;
			sheetNames.map((sheetName) => {
				let sheetOfInterest = workbook["Sheets"][sheetName]
				delete sheetOfInterest['C1']
				const json = xlsx.utils.sheet_to_json(workbook["Sheets"][sheetName]);
				let colToAward = {}
				Object.entries(json[0]).map(([key, award]) => {
					if (electiveAwards.includes(award) || ipaAwards.includes(award) || spaAwards.includes(award) || foundersAwards.includes(award) || serviceAwards.includes(award)) {
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
									if (currentAward != "" && currentMastery <= 3) {
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
								toggleAttainment({ target: element })
							}
						} else if (masteryName == "Basic") {
							try {
								element = document.getElementsByClassName(id + "-" + awardName)[0]
								if (element.checked != attainment) {
									element.checked = attainment
									toggleAttainment({ target: element })
								}
							} catch (error) { console.log(awardName + ": " + error) }
						}
					})
				})
			})
		}
		reader.readAsArrayBuffer(e.target.files[0]);
	}

	return (
		<div className='award-file-reader'>
			<label htmlFor='award-file'>Upload Award Trackers from Members Portal</label>
			<input type="file" onChange={readUploadFile} accept=".xls" id='award-file' />
		</div>
	)
}

AwardFileReader.propTypes = {
	boyIds: PropTypes.shape({
		account_name: PropTypes.number,
	}),
	boyNames: PropTypes.shape({
		id: PropTypes.string,
	}),
	toggleAttainment: PropTypes.func.isRequired,
}

export { AwardFileReader }