import React, { useState, useEffect } from "react";
import axios from 'axios'
import ExcelJS from 'exceljs'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AnnualAttendanceExcel = ({year}) => {
	const [updatedDate, setUpdatedDate] = useState()
	const [tableData, setTableData] = useState({'Sec 1': {}, 'Sec 2': {}, 'Sec 3': {}, 'Sec 4 and 5': {}, 'Primers': {}, 
		'Officers and Volunteers': {}});
	const [idOrder, setIdOrder] = useState({'1': [], '2': [], '3': [], '4/5': [], 'Primer': [], 
		'Volunteer': []})
	const [talliedAttendance, setTalliedAttendance] = useState({'1': {}, '2': {}, '3': {}, '4/5': {}, 'Primer': {}, 
		'Volunteer': {}})

	useEffect(() => {
		axios.post('/api/account/0/get_accounts_by_type', {
			account_type: "Boy"
		  }, {
			withCredentials: true
		  })
		  .then(resp => {
			let sec1Rows = []
			let sec2Rows = []
			let sec3Rows = []
			let sec45Rows = []
			let newIdOrder = {...idOrder}
			resp.data.map((boy) => {
				if (boy.level == 1) {
					sec1Rows.push([
						{ value: "", colSpan: 1, rowSpan: 1},
						{ value: sec1Rows.length + 1, colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 }, //Member ID
						{ value: boy.account_name, colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 }, //Class
						{ value: boy.rank, colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 }, //Percentage Attendance
					])
					newIdOrder['1'].push(boy.id)
				}
				if (boy.level == 2) {
					sec2Rows.push([
						{ value: "", colSpan: 1, rowSpan: 1},
						{ value: sec2Rows.length + 1, colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 }, //Member ID
						{ value: boy.account_name, colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 }, //Class
						{ value: boy.rank, colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 }, //Percentage Attendance
					])
					newIdOrder['2'].push(boy.id)
				}
				if (boy.level == 3) {
					sec3Rows.push([
						{ value: "", rowSpan: 1},
						{ value: sec3Rows.length + 1, rowSpan: 1 },
						{ value: "", rowSpan: 1 }, //Member ID
						{ value: boy.account_name, rowSpan: 1 },
						{ value: "", rowSpan: 1 }, //Class
						{ value: boy.rank, rowSpan: 1 },
						{ value: "", rowSpan: 1 }, //Percentage Attendance
					])
					newIdOrder['3'].push(boy.id)
				}
				if (boy.level == 4 || boy.level == 5) {
					sec45Rows.push([
						{ value: "", rowSpan: 1},
						{ value: sec45Rows.length + 1, rowSpan: 1 },
						{ value: "", rowSpan: 1 }, //Member ID
						{ value: boy.account_name, rowSpan: 1 },
						{ value: "", rowSpan: 1 }, //Class
						{ value: boy.rank, rowSpan: 1 },
						{ value: "", rowSpan: 1 }, //Percentage Attendance
					])
					newIdOrder['4/5'].push(boy.id)
				}
			})

			let tables = [sec1Rows, sec2Rows, sec3Rows, sec45Rows]
			tables.map((table) => {
				table.push([
					{ value: "", rowSpan: 1},
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1},
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "Total Boys:", rowSpan: 1 },
					{ value: table.length - 1, rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1},
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "Total Parades/Meetings:", rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1},
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1},
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
				])
				table.push([
					{ value: "", colSpan: 1, rowSpan: 1},
					{ value: "", colSpan: 1, rowSpan: 1 },
					{ value: "", colSpan: 1, rowSpan: 1 },
					{ value: "", colSpan: 1, rowSpan: 1 },
					{ value: "LEGEND", colSpan: 2, rowSpan: 1 },
					{ value: "", colSpan: 1, rowSpan: 1 },
					{ value: "", colSpan: 1, rowSpan: 1 },
					{ value: "1", colSpan: 1, rowSpan: 1 },
					{ value: "Present", colSpan: 2, rowSpan: 1 },
					{ value: "", colSpan: 1, rowSpan: 1 },
					{ value: "0", colSpan: 1, rowSpan: 1 },
					{ value: "Absent", colSpan: 2, rowSpan: 1 },
					{ value: "", colSpan: 1, rowSpan: 1 },
					{ value: "E", colSpan: 1, rowSpan: 1 },
					{ value: "Excused", colSpan: 2, rowSpan: 1 },
					{ value: "", colSpan: 1, rowSpan: 1 },
					{ value: "S", colSpan: 1, rowSpan: 1 },
					{ value: "Sick", colSpan: 1, rowSpan: 1 },
					{ value: "NA", colSpan: 1, rowSpan: 1 },
					{ value: "Not Applicable", colSpan: 1, rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1},
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
				])
			})

			setTableData((prev) => {
				let next = {...prev}
				next['Sec 1']['rows'] = sec1Rows
				next['Sec 2']['rows'] = sec2Rows
				next['Sec 3']['rows'] = sec3Rows
				next['Sec 4 and 5']['rows'] = sec45Rows
				console.log(next)
				return next
			})
			setIdOrder(newIdOrder)
		  })
		  //.catch(resp => handleServerError(resp.response.status))
		
		axios.post('/api/account/0/get_accounts_by_type', {
			  account_type: "Primer"
		  }, {
			withCredentials: true
		  })
		  .then(resp => {
			let primerRows = []
			let newIdOrder = {...idOrder}
			resp.data.map((primer) => {
				primerRows.push([
					{ value: "", rowSpan: 1},
					{ value: primerRows.length + 1, rowSpan: 1 },
					{ value: primer.account_name, rowSpan: 1 },
					{ value: "POLY", rowSpan: 1 },
					{ value: primer.rank, rowSpan: 1 },
					{ value: "", rowSpan: 1 }, //Percentage Attendance
				])
				idOrder['Primer'].push(primer.id)
			})

			let tables = [primerRows]
			tables.map((table) => {
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "Total Primers:", rowSpan: 1 },
					{ value: table.length - 1, rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "Total Parades/Meetings:", rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "LEGEND", colSpan: 2, rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "1", rowSpan: 1 },
					{ value: "Present", colSpan: 2, rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "0", rowSpan: 1 },
					{ value: "Absent", colSpan: 2, rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "E", rowSpan: 1 },
					{ value: "Excused", colSpan: 2, rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "S", rowSpan: 1 },
					{ value: "Sick", colSpan: 1, rowSpan: 1 },
					{ value: "NA", rowSpan: 1 },
					{ value: "Not Applicable", colSpan: 1, rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
				])
			})

			setTableData((prev) => {
				let next = {...prev}
				next['Primers']['rows'] = primerRows
				return next
			})
			setIdOrder(newIdOrder)
		  })
		  .catch(resp => handleServerError(resp.response.status))
		
		axios.post('/api/account/0/get_accounts_by_type', {
			account_type: "Officer"
		  }, {
			withCredentials: true
		  })
		  .then(resp => {
			let officerRows = []
			let newIdOrder = {...idOrder}
			resp.data.map((officer) => {
				officerRows.push([
					{ value: "", rowSpan: 1},
					{ value: officerRows.length + 1, rowSpan: 1 },
					{ value: officer.account_name, rowSpan: 1 },
					{ value: "VAL", rowSpan: 1 },
					{ value: officer.rank, rowSpan: 1 },
					{ value: "", rowSpan: 1 }, //Percentage Attendance
				])
				idOrder['Volunteer'].push(officer.id)
			})

			let tables = [officerRows]
			tables.map((table) => {
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "Total Officers:", rowSpan: 1 },
					{ value: table.length - 1, rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "Total Parades/Meetings:", rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "LEGEND", colSpan: 2, rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "1", rowSpan: 1 },
					{ value: "Present", colSpan: 2, rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "0", rowSpan: 1 },
					{ value: "Absent", colSpan: 2, rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "E", rowSpan: 1 },
					{ value: "Excused", colSpan: 2, rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "S", rowSpan: 1 },
					{ value: "Sick", colSpan: 1, rowSpan: 1 },
					{ value: "NA", rowSpan: 1 },
					{ value: "Not Applicable", colSpan: 1, rowSpan: 1 },
				])
				table.push([
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
					{ value: "", rowSpan: 1 },
				])
			})

			setTableData((prev) => {
				let next = {...prev}
				next['Officers and Volunteers']['rows'] = officerRows
				return next
			})
			setIdOrder(newIdOrder)
		  })
		  .catch(resp => handleServerError(resp.response.status))

		axios.post('/api/parade/0/get_parades_by_year', {
			year: year,
			}, {
			withCredentials: true
			})
			.then((resp) => {
				let date = new Date(resp.data.parades[resp.data.parades.length - 1]?.date);
				setUpdatedDate(date)
				date = date.toLocaleDateString('en-GB', {
					day: 'numeric',
					month: 'short',
					year: '2-digit',
				});

				let headerData = {}

				let levels = ['1', '2', '3', '4/5']
				levels.map((level, index) => {
					headerData[level] = [
						[
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "SEC " + level + " PLATOON ATTENDANCE", colSpan: 6, rowSpan: 1 },
						],
						[],
						[
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "Date Updated:", colSpan: 1, rowSpan: 1 },
							{ value: date, colSpan: 1, rowSpan: 1 },
						],
						[
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "YEAR " + year, colSpan: 3, rowSpan: 1 },
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "(Batch " + (parseInt(year) - index) + ")", colSpan: 2, rowSpan: 1 },
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "TOTAL %\n(weighted)", colSpan: 1, rowSpan: 3 },
						],
						[
							{ value: "", colSpan: 1, rowSpan: 2 },
							{ value: "NO.", colSpan: 1, rowSpan: 2 },
							{ value: "MEMBER ID", colSpan: 1, rowSpan: 2 },
							{ value: "BOYS' NAME", colSpan: 1, rowSpan: 2 },
							{ value: "CLASS", colSpan: 1, rowSpan: 2 },
							{ value: "RANK", colSpan: 1, rowSpan: 2 },
							{ value: "", colSpan: 1, rowSpan: 1 },
						],
						[
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "", colSpan: 1, rowSpan: 1 },
							{ value: "", colSpan: 1, rowSpan: 1 },
						]
					]
				})

				levels.push('Primer')
				levels.push('Volunteer')

				headerData['Primer'] = [
					[
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "PRIMERS' ATTENDANCE", colSpan: 5, rowSpan: 1 },
					],
					[],
					[
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "Date Updated:", colSpan: 1, rowSpan: 1 },
						{ value: date, colSpan: 1, rowSpan: 1 },
					],
					[
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "YEAR " + year, colSpan: 4, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "TOTAL %\n(weighted)", colSpan: 1, rowSpan: 3 },
					],
					[
						{ value: "", colSpan: 1, rowSpan: 2 },
						{ value: "NO.", colSpan: 1, rowSpan: 2 },
						{ value: "PRIMER'S NAME", colSpan: 1, rowSpan: 2 },
						{ value: "CLASS", colSpan: 1, rowSpan: 2 },
						{ value: "RANK", colSpan: 1, rowSpan: 2 },
						{ value: "", colSpan: 1, rowSpan: 1 },
					],
					[
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
					]
				]

				headerData['Volunteer'] = [
					[
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "VOLUNTEERS' ATTENDANCE", colSpan: 5, rowSpan: 1 },
					],
					[],
					[
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "Date Updated:", colSpan: 1, rowSpan: 1 },
						{ value: date, colSpan: 1, rowSpan: 1 },
					],
					[
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "YEAR " + year, colSpan: 4, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "TOTAL %\n(weighted)", colSpan: 1, rowSpan: 3 },
					],
					[
						{ value: "", colSpan: 1, rowSpan: 2 },
						{ value: "NO.", colSpan: 1, rowSpan: 2 },
						{ value: "VOLUNTEER'S NAME", colSpan: 1, rowSpan: 2 },
						{ value: "CLASS", colSpan: 1, rowSpan: 2 },
						{ value: "RANK", colSpan: 1, rowSpan: 2 },
						{ value: "", colSpan: 1, rowSpan: 1 },
					],
					[
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
						{ value: "", colSpan: 1, rowSpan: 1 },
					]
				]

				let sheets = ['Sec 1', 'Sec 2', 'Sec 3', 'Sec 4 and 5', 'Primers', 'Officers and Volunteers']
				let newTableData = {...tableData}
				let newLevelTotalParades = {'1': 0, '2': 0, '3': 0, '4/5': 0, 'Primer': 0, 'Volunteer': 0}
				let newTalliedAttendance = {...talliedAttendance}

				levels.map((level) => {
					idOrder[level].map((accountId) => {
						newTalliedAttendance[level][accountId] = {'1': 0, '0': 0, 'E': 0, 'S': 0}
					})
				})

				resp.data.parades.map((parade) => {
					date = new Date(parade.date);
					let dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)

					const options = { day: 'numeric', month: 'short' }
					const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(date)
					
					date = `${parts[0].value}/${parts[2].value}`

					let relevantLevels = []
					levels.map((level) => {
						idOrder[level].map((accountId) => {
							if (resp.data.parade_attendance[parade.id][accountId] != null) {
								if (!relevantLevels.includes(level)) {
									relevantLevels.push(level)
									newLevelTotalParades[level] += 1
								}
							}
						})
					})
				
					relevantLevels.map((level) => {
						headerData[level][2].push({ value: dayOfWeek, colSpan: 1, rowspan: 1 })
						headerData[level][3].push({ value: date, colSpan: 1, rowspan: 1 })
						headerData[level][4].push({ value: parade.parade_type, colSpan: 1, rowspan: 1 })
					})

					relevantLevels.map((level, index) => {
						let paradeAttendance = 0
						idOrder[level].map((accountId, row) => {
							newTableData[sheets[index]]['rows'][row].push(
								{ value: resp.data.parade_attendance[parade.id][accountId], colSpan: 1, rowspan: 1 }
							)
							if (resp.data.parade_attendance[parade.id][accountId] == '1') {
								paradeAttendance += 1
							}
							newTalliedAttendance[level][accountId][resp.data.parade_attendance[parade.id][accountId]] += 1
						})
						newTableData[sheets[index]]['rows'][newTableData[sheets[index]]['rows'].length - 7].push(
							{ value: paradeAttendance, colSpan: 1, rowspan: 1 }
						)
					})
				})
				setTalliedAttendance(newTalliedAttendance)

				levels.map((level, index) => {
					// Add total % attendance and total parade count per boy
					idOrder[level].map((accountId, row) => {
						newTableData[sheets[index]]['rows'][row][level.includes('e')?5 : 6].value =
						 Math.fround(newTalliedAttendance[level][accountId]['1'] * 100 / (newTalliedAttendance[level][accountId]['1'] + newTalliedAttendance[level][accountId]['0']))
					})

					// Add total parades/meetings for the year
					newTableData[sheets[index]]['rows'][newTableData[sheets[index]]['rows'].length - 5].push(
						{ value: newLevelTotalParades[level], colSpan: 1, rowspan: 1 }
					)

					// Add new column for actual percentage
					headerData[level][2].push({ value: "ACTUAL TOTAL %", colSpan: 1, rowSpan: 3 })
					// headerData[level][3].push({ value: "", colSpan: 1, rowSpan: 1 })
					// headerData[level][4].push({ value: "", colSpan: 1, rowSpan: 1 })
					idOrder[level].map((accountId, row) => {
						newTableData[sheets[index]]['rows'][row].push(
							{ value: Math.fround(newTalliedAttendance[level][accountId]['1'] * 100 / newLevelTotalParades[level]), colSpan: 1, rowspan: 1 }
						)
					})

					// Add new column for total number of parades attended
					headerData[level][2].push({ value: "TOTAL PARADES ATTENDED", colSpan: 1, rowSpan: 3 })
					// headerData[level][3].push({ value: "", colSpan: 1, rowSpan: 1 })
					// headerData[level][4].push({ value: "", colSpan: 1, rowSpan: 1 })
					idOrder[level].map((accountId, row) => {
						newTableData[sheets[index]]['rows'][row].push(
							{ value: newTalliedAttendance[level][accountId]['1'], colSpan: 1, rowspan: 1 }
						)
					})
				})

				newTableData['Sec 1']['headers'] = headerData['1']
				newTableData['Sec 2']['headers'] = headerData['2']
				newTableData['Sec 3']['headers'] = headerData['3']
				newTableData['Sec 4 and 5']['headers'] = headerData['4/5']
				newTableData['Primers']['headers'] = headerData['Primer']
				newTableData['Officers and Volunteers']['headers'] = headerData['Volunteer']

				setTableData(newTableData)
			})
			//.catch(resp => handleServerError(resp.response.status))
	}, [])

  // Function to download the Excel file
  const handleDownload = () => {
	// Create a workbook and append the worksheet
	const workbook = XLSX.utils.book_new();
	Object.keys(tableData).map((level, index) => {
		const { headers, rows } = tableData[level];
		// Convert table data to a 2D array for Excel
		const excelData = [];

		// Process headers
		headers.forEach((row) => {
			const excelRow = [];
			row.forEach((cell) => {
				excelRow.push(cell.value);
			});
			excelData.push(excelRow);
		});

		// Track the starting row index for rows (below headers)
		const startRowIndex = headers.length;

		// Process rows
		rows.forEach((row) => {
		  const excelRow = [];
		  row.forEach((cell) => {
			excelRow.push(cell.value);
		  });
		  excelData.push(excelRow);
		});
	  
		// Generate worksheet and workbook
		const worksheet = XLSX.utils.aoa_to_sheet(excelData);
	  
		// Apply merges for colSpan and rowSpan (both headers and rows)
		const merges = [];
	  
		// Process header merges
		headers.forEach((row, rowIndex) => {
		  row.forEach((cell, colIndex) => {
			if (cell.colSpan && cell.colSpan > 1) {
			  merges.push({
				s: { r: rowIndex, c: colIndex },
				e: { r: rowIndex, c: colIndex + cell.colSpan - 1 },
			  });
			}
			if (cell.rowSpan && cell.rowSpan > 1) {
			  merges.push({
				s: { r: rowIndex, c: colIndex },
				e: { r: rowIndex + cell.rowSpan - 1, c: colIndex },
			  });
			}
		  });
		});
	  
		// Process row merges
		rows.forEach((row, rowIndex) => {
		  row.forEach((cell, colIndex) => {
			if (cell.colSpan && cell.colSpan > 1) {
			  merges.push({
				s: { r: startRowIndex + rowIndex, c: colIndex },
				e: { r: startRowIndex + rowIndex, c: colIndex + cell.colSpan - 1 },
			  });
			}
			if (cell.rowSpan && cell.rowSpan > 1) {
			  merges.push({
				s: { r: startRowIndex + rowIndex, c: colIndex },
				e: { r: startRowIndex + rowIndex + cell.rowSpan - 1, c: colIndex },
			  });
			}
		  });
		});

		worksheet["!merges"] = merges;
		worksheet["!gridlines"] = false; // This property mimics gridlines turned off
		worksheet["G3"].s = {
			alignment: {
				wrapText: true,
				vertical: "center",
				horizontal: "center",
			},
		};

		if (level.includes("Sec")) {
			worksheet["!cols"] = [
				{ wch: 4 },
				{ wch: 6 },
				{ wch: 13 },
				{ wch: 40 },
				{ wch: 10 },
				{ wch: 10 },
				{ wch: 20 },
			];
			worksheet["!rows"] = [
				{ hpx: 64 },
				{ hpx: 16 },
				{ hpx: 16 },
				{ hpx: 40 },
				{ hpx: 22 },
				{ hpx: 16 },
			];
		} else {
			worksheet["!cols"] = [
				{ wch: 4 },
				{ wch: 6 },
				{ wch: 40 },
				{ wch: 10 },
				{ wch: 10 },
				{ wch: 20 },
			];
			worksheet["!rows"] = [
				{ hpx: 64 },
				{ hpx: 16 },
				{ hpx: 16 },
				{ hpx: 40 },
				{ hpx: 22 },
				{ hpx: 16 },
			];
		}
		
		Object.values(idOrder)[index].map((accountId) => {
			worksheet["!rows"].push({ hpx: 22 })
		})

		XLSX.utils.book_append_sheet(workbook, worksheet, level + " (" + year + ")");
	})    

	let date = updatedDate.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});

    // Write workbook to a Blob and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "BB Attendance updated on " + date + ".xlsx");
  };

  const handleDownloadWithExcelJS = () => {
	// Create a new workbook
	const workbook = new ExcelJS.Workbook();
  
	// Loop through tableData
	Object.keys(tableData).forEach((level, index) => {
	  const { headers, rows } = tableData[level];
  
	  // Add a worksheet
	  const worksheet = workbook.addWorksheet(level + " (" + year + ")", {
		views: [{ showGridLines: false }], // Disable gridlines
	  });
  
	  // Add headers
	  headers.forEach((row, rowIndex) => {
		const headerRow = worksheet.addRow(row.map((cell) => cell.value));
	  });
	  headers.forEach((row, rowIndex) => {
		row.forEach((cell, colIndex) => {
		  const { colSpan, rowSpan } = cell;
		  const cellAddress = worksheet.getCell(rowIndex + 1, colIndex + 1);
  
		  if ((colSpan && colSpan > 1) || (rowSpan && rowSpan > 1)) {
			worksheet.mergeCells(
			  rowIndex + 1,
			  colIndex + 1,
			  rowIndex + (rowSpan?rowSpan: 1),
			  colIndex + (colSpan?colSpan: 1)
			);
		  }
		});
	  });
  
	  // Add rows
	  rows.forEach((row, rowIndex) => {
		const dataRow = worksheet.addRow(row.map((cell) => cell.value));
	  });
	  rows.forEach((row, rowIndex) => {
		row.forEach((cell, colIndex) => {
		  const { colSpan, rowSpan } = cell;
		  const cellAddress = worksheet.getCell(rowIndex + 1, colIndex + 1);
  
		  if ((colSpan && colSpan > 1) || (rowSpan && rowSpan > 1)) {
			worksheet.mergeCells(
			  rowIndex + 1,
			  colIndex + 1,
			  rowIndex + (rowSpan?rowSpan: 1),
			  colIndex + (colSpan?colSpan: 1)
			);
		  }
		});
	  });
  
	  // Set column widths
	  if (level.includes("Sec")) {
		worksheet.columns = [
		  { width: 4 },
		  { width: 6 },
		  { width: 13 },
		  { width: 40 },
		  { width: 10 },
		  { width: 10 },
		  { width: 20 },
		];
	  } else {
		worksheet.columns = [
		  { width: 4 },
		  { width: 6 },
		  { width: 40 },
		  { width: 10 },
		  { width: 10 },
		  { width: 20 },
		];
	  }
  
	  // Set row heights
	  const defaultRowHeights = [
		64, // Header row height
		16,
		16,
		40,
		22,
		16,
	  ];
  
	  defaultRowHeights.forEach((height, rowIndex) => {
		const row = worksheet.getRow(rowIndex + 1);
		row.height = height;
	  });
  
	  // Additional rows based on idOrder
	  Object.values(idOrder)[index].forEach(() => {
		const row = worksheet.addRow([]);
		row.height = 22;
	  });
	});
  
	// Save the workbook
	workbook.xlsx.writeBuffer().then((buffer) => {
	  const blob = new Blob([buffer], { type: "application/octet-stream" });
	  saveAs(blob, "GeneratedExcel.xlsx");
	});
  };

  return (
    <div>
      <button onClick={handleDownloadWithExcelJS}>Download Excel</button>
    </div>
  );
};

export { AnnualAttendanceExcel };