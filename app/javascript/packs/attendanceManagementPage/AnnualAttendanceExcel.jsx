import React from "react";
import axios from 'axios'
import ExcelJS from 'exceljs'
import PropTypes from 'prop-types'
import { saveAs } from "file-saver";

const HandleDownloadWithExcelJS = ({year}) => {
	function handleParadesData() {
		axios.post('/api/parade/0/get_annual_attendance_information', {
			year: year,
			}, {
			withCredentials: true
			})
			.then((resp) => {
                let sec1Rows = []
                let sec2Rows = []
                let sec3Rows = []
                let sec45Rows = []
                let idOrder = {'1': [], '2': [], '3': [], '4/5': [], 'Primer': [], 
                    'Volunteer': []}
                resp.data['sec_1'].map((boy) => {
                    sec1Rows.push([
                        { value: "", colSpan: 1, rowSpan: 1},
                        { value: sec1Rows.length + 1, colSpan: 1, rowSpan: 1 },
                        { value: "", colSpan: 1, rowSpan: 1 }, //Member ID
                        { value: boy.account_name.toUpperCase(), colSpan: 1, rowSpan: 1 },
                        { value: "", colSpan: 1, rowSpan: 1 }, //Class
                        { value: boy.rank_1, colSpan: 1, rowSpan: 1 },
                        { value: "", colSpan: 1, rowSpan: 1 }, //Percentage Attendance
                    ])
                    idOrder['1'].push(boy.id)
                })
                resp.data['sec_2'].map((boy) => {
                    sec2Rows.push([
                        { value: "", colSpan: 1, rowSpan: 1},
                        { value: sec2Rows.length + 1, colSpan: 1, rowSpan: 1 },
                        { value: "", colSpan: 1, rowSpan: 1 }, //Member ID
                        { value: boy.account_name.toUpperCase(), colSpan: 1, rowSpan: 1 },
                        { value: "", colSpan: 1, rowSpan: 1 }, //Class
                        { value: boy.rank_2, colSpan: 1, rowSpan: 1 },
                        { value: "", colSpan: 1, rowSpan: 1 }, //Percentage Attendance
                    ])
                    idOrder['2'].push(boy.id)
                })
                resp.data['sec_3'].map((boy) => {
                    sec3Rows.push([
                        { value: "", rowSpan: 1},
                        { value: sec3Rows.length + 1, rowSpan: 1 },
                        { value: "", rowSpan: 1 }, //Member ID
                        { value: boy.account_name.toUpperCase(), rowSpan: 1 },
                        { value: "", rowSpan: 1 }, //Class
                        { value: boy.rank_3, rowSpan: 1 },
                        { value: "", rowSpan: 1 }, //Percentage Attendance
                    ])
                    idOrder['3'].push(boy.id)
                })
                resp.data['sec_4_5'].map((boy) => {
                    sec45Rows.push([
                        { value: "", rowSpan: 1},
                        { value: sec45Rows.length + 1, rowSpan: 1 },
                        { value: "", rowSpan: 1 }, //Member ID
                        { value: boy.account_name.toUpperCase(), rowSpan: 1 },
                        { value: "", rowSpan: 1 }, //Class
                        { value: boy.rank, rowSpan: 1 },
                        { value: "", rowSpan: 1 }, //Percentage Attendance
                    ])
                    idOrder['4/5'].push(boy.id)
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
                        { value: null, rowSpan: 1},
                        { value: null, rowSpan: 1 },
                        { value: null, rowSpan: 1 },
                        { value: null, rowSpan: 1 },
                        { value: null, rowSpan: 1 },
                        { value: "Total Boys:", rowSpan: 1 },
                        { value: table.length - 1, rowSpan: 1 },
                    ])
                    table.push([
                        { value: null, rowSpan: 1},
                        { value: null, rowSpan: 1 },
                        { value: null, rowSpan: 1 },
                        { value: null, rowSpan: 1 },
                        { value: null, rowSpan: 1 },
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

                let tableData = {'Sec 1': {}, 'Sec 2': {}, 'Sec 3': {}, 'Sec 4 and 5': {}, 'Primers': {}, 
                'Officers and Volunteers': {}}
        
                tableData['Sec 1']['rows'] = sec1Rows
                tableData['Sec 2']['rows'] = sec2Rows
                tableData['Sec 3']['rows'] = sec3Rows
                tableData['Sec 4 and 5']['rows'] = sec45Rows

                //ORIGINAL HANDLE PRIMER DATA STARTING POINT

                let primerRows = []
                resp.data['primer'].map((primer) => {
                    primerRows.push([
                        { value: "", rowSpan: 1},
                        { value: primerRows.length + 1, rowSpan: 1 },
                        { value: primer.account_name.toUpperCase(), rowSpan: 1 },
                        { value: "POLY", rowSpan: 1 },
                        { value: primer.rank, rowSpan: 1 },
                        { value: "", rowSpan: 1 }, //Percentage Attendance
                    ])
                    idOrder['Primer'].push(primer.id)
                })
        
                primerRows.push([
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                ])
                primerRows.push([
                    { value: null, rowSpan: 1 },
                    { value: null, rowSpan: 1 },
                    { value: null, rowSpan: 1 },
                    { value: null, rowSpan: 1 },
                    { value: "Total Primers:", rowSpan: 1 },
                    { value: primerRows.length - 1, rowSpan: 1 },
                ])
                primerRows.push([
                    { value: null, rowSpan: 1 },
                    { value: null, rowSpan: 1 },
                    { value: null, rowSpan: 1 },
                    { value: null, rowSpan: 1 },
                    { value: "Total Parades/Meetings:", rowSpan: 1 },
                ])
                primerRows.push([
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                ])
                primerRows.push([
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                ])
                primerRows.push([
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
                primerRows.push([
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                ])
        
                tableData['Primers']['rows'] = primerRows

                //ORIGINAL HANDLE OFFICER DATA STARTING POINT

                let officerRows = []
                resp.data['officer'].map((officer) => {
                    officerRows.push([
                        { value: "", rowSpan: 1},
                        { value: officerRows.length + 1, rowSpan: 1 },
                        { value: officer.account_name.toUpperCase(), rowSpan: 1 },
                        { value: officer.class_1, rowSpan: 1 },
                        { value: officer.rank, rowSpan: 1 },
                        { value: "", rowSpan: 1 }, //Percentage Attendance
                    ])
                    idOrder['Volunteer'].push(officer.id)
                })
        
                officerRows.push([
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                ])
                officerRows.push([
                    { value: null, rowSpan: 1 },
                    { value: null, rowSpan: 1 },
                    { value: null, rowSpan: 1 },
                    { value: null, rowSpan: 1 },
                    { value: "Total Officers:", rowSpan: 1 },
                    { value: officerRows.length - 1, rowSpan: 1 },
                ])
                officerRows.push([
                    { value: null, rowSpan: 1 },
                    { value: null, rowSpan: 1 },
                    { value: null, rowSpan: 1 },
                    { value: null, rowSpan: 1 },
                    { value: "Total Parades/Meetings:", rowSpan: 1 },
                ])
                officerRows.push([
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                ])
                officerRows.push([
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                ])
                officerRows.push([
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
                officerRows.push([
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                    { value: "", rowSpan: 1 },
                ])
        
                tableData['Officers and Volunteers']['rows'] = officerRows

                //ORIGINAL HANDLE PARADES DATA STARTING POINT
				let updateDate = new Date(resp.data.parades[resp.data.parades.length - 1]?.date);
				let date = updateDate.toLocaleDateString('en-GB', {
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
							{ value: null, colSpan: 1, rowSpan: 1 },
							{ value: null, colSpan: 1, rowSpan: 1 },
							{ value: null, colSpan: 1, rowSpan: 1 },
							{ value: null, colSpan: 1, rowSpan: 1 },
							{ value: null, colSpan: 1, rowSpan: 1 },
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
						{ value: null, colSpan: 1, rowSpan: 1 },
						{ value: null, colSpan: 1, rowSpan: 1 },
						{ value: null, colSpan: 1, rowSpan: 1 },
						{ value: null, colSpan: 1, rowSpan: 1 },
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
						{ value: null, colSpan: 1, rowSpan: 1 },
						{ value: null, colSpan: 1, rowSpan: 1 },
						{ value: null, colSpan: 1, rowSpan: 1 },
						{ value: null, colSpan: 1, rowSpan: 1 },
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
				let newLevelTotalParades = {'1': 0, '2': 0, '3': 0, '4/5': 0, 'Primer': 0, 'Volunteer': 0}
				let talliedAttendance = {'1': {}, '2': {}, '3': {}, '4/5': {}, 'Primer': {}, 
                 	'Volunteer': {}}
	
				levels.map((level) => {
					idOrder[level].map((accountId) => {
						talliedAttendance[level][accountId] = {'1': 0, '0': 0, 'E': 0, 'S': 0}
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
						headerData[level][3].push({ value: dayOfWeek, colSpan: 1, rowspan: 1 })
						headerData[level][4].push({ value: date, colSpan: 1, rowspan: 1 })
						headerData[level][5].push({ value: parade.parade_type, colSpan: 1, rowspan: 1 })
					})
	
					relevantLevels.map((level, index) => {
						let paradeAttendance = 0
						idOrder[level].map((accountId, row) => {
							tableData[sheets[index]]['rows'][row].push(
								{ value: resp.data.parade_attendance[parade.id][accountId], colSpan: 1, rowspan: 1 }
							)
							if (resp.data.parade_attendance[parade.id][accountId] == '1') {
								paradeAttendance += 1
							}
							talliedAttendance[level][accountId][resp.data.parade_attendance[parade.id][accountId]] += 1
						})
						tableData[sheets[index]]['rows'][tableData[sheets[index]]['rows'].length - 7].push(
							{ value: paradeAttendance, colSpan: 1, rowspan: 1 }
						)
					})
				})
	
				levels.map((level, index) => {
					// Add total % attendance and total parade count per boy
					idOrder[level].map((accountId, row) => {
						tableData[sheets[index]]['rows'][row][level.includes('e')?5 : 6].value =
						 Math.fround(talliedAttendance[level][accountId]['1'] * 100 / (talliedAttendance[level][accountId]['1'] + talliedAttendance[level][accountId]['0']))
					})
	
					// Add total parades/meetings for the year
					tableData[sheets[index]]['rows'][tableData[sheets[index]]['rows'].length - 5].push(
						{ value: newLevelTotalParades[level], colSpan: 1, rowspan: 1 }
					)
	
					// Add new column for actual percentage
					headerData[level][3].push({ value: "ACTUAL TOTAL %", colSpan: 1, rowSpan: 3 })
					// headerData[level][3].push({ value: "", colSpan: 1, rowSpan: 1 })
					// headerData[level][4].push({ value: "", colSpan: 1, rowSpan: 1 })
					idOrder[level].map((accountId, row) => {
						tableData[sheets[index]]['rows'][row].push(
							{ value: Math.fround(talliedAttendance[level][accountId]['1'] * 100 / newLevelTotalParades[level]), colSpan: 1, rowspan: 1 }
						)
					})
	
					// Add new column for total number of parades attended
					headerData[level][3].push({ value: "TOTAL PARADES ATTENDED", colSpan: 1, rowSpan: 3 })
					// headerData[level][3].push({ value: "", colSpan: 1, rowSpan: 1 })
					// headerData[level][4].push({ value: "", colSpan: 1, rowSpan: 1 })
					idOrder[level].map((accountId, row) => {
						tableData[sheets[index]]['rows'][row].push(
							{ value: talliedAttendance[level][accountId]['1'], colSpan: 1, rowspan: 1 }
						)
					})
				})
	
				tableData['Sec 1']['headers'] = headerData['1']
				tableData['Sec 2']['headers'] = headerData['2']
				tableData['Sec 3']['headers'] = headerData['3']
				tableData['Sec 4 and 5']['headers'] = headerData['4/5']
				tableData['Primers']['headers'] = headerData['Primer']
				tableData['Officers and Volunteers']['headers'] = headerData['Volunteer']
				console.log(sec1Rows)
				console.log(sec2Rows)
				console.log(sec3Rows)
				console.log(sec45Rows)
				console.log(idOrder)
				console.log(resp.data)
				console.log(table.data)

				prepareWorkbook(updateDate, idOrder, tableData, newLevelTotalParades)
			})
//			.catch(resp => handleServerError(resp.response.status))
	}

	function prepareWorkbook(updateDate, idOrder, tableData, newLevelTotalParades) {
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
			headers.forEach((row) => {
				worksheet.addRow(row.map((cell) => cell.value));
			});
			headers.forEach((row, rowIndex) => {
				row.forEach((cell, colIndex) => {
				const { colSpan, rowSpan } = cell;
				worksheet.getCell(rowIndex + 1, colIndex + 1);

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
			rows.forEach((row) => {
				worksheet.addRow(row.map((cell) => cell.value));
			});
			rows.forEach((row, rowIndex) => {
				rowIndex += headers.length
				row.forEach((cell, colIndex) => {
				const { colSpan, rowSpan } = cell;
				worksheet.getCell(rowIndex + 1, colIndex + 1);

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

			worksheet.getCell("B1").font = {
				bold: true,
				size: 28,
				underline: true,
			};
			worksheet.getCell("B1").alignment = {
				vertical: "middle",
			};

			worksheet.getCell("B4").fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "153c7c" }, // Blue background
			};

			worksheet.getCell("B4").font = {
				bold: true,
				size: 28,
				color: { argb: "f7ff00" },
			};
			worksheet.getCell("B4").alignment = {
				vertical: "middle",
				horizontal: "center",
			};

			worksheet.getCell("B5").font = {
				bold: true,
			};
			worksheet.getCell("B5").alignment = {
				vertical: "middle",
				horizontal: "center",
			};

			worksheet.getCell("C5").font = {
				bold: true,
			};
			worksheet.getCell("C5").alignment = {
				vertical: "middle",
				horizontal: "center",
			};

			worksheet.getCell("D5").font = {
				bold: true,
			};
			worksheet.getCell("D5").alignment = {
				vertical: "middle",
			};

			worksheet.getCell("E5").font = {
				bold: true,
			};
			worksheet.getCell("E5").alignment = {
				vertical: "middle",
				horizontal: "center",
			};

			rows.map((row, index) => {
				index += headers.length + 1
				worksheet.getCell("B" + index).alignment = {
					vertical: "middle",
					horizontal: "center",
				};
				worksheet.getCell("C" + index).alignment = {
					vertical: "middle",
					horizontal: "center",
				};
				worksheet.getCell("D" + index).alignment = {
					vertical: "middle",
				};
				worksheet.getCell("E" + index).alignment = {
					vertical: "middle",
					horizontal: "center",
				};
				worksheet.getCell("F" + index).alignment = {
					vertical: "middle",
					horizontal: "center",
				};
			})

			let paradeCount = Object.values(newLevelTotalParades)[index]
			rows.map((row, rowIndex) => {
				rowIndex += headers.length - 3
				let colIndex = level.includes('Sec')? 8 : 7
				let colLimit = colIndex + paradeCount
				for (; colIndex <= colLimit + 1; colIndex += 1) {
					worksheet.getCell(rowIndex, colIndex).alignment = {
						vertical: "middle",
						horizontal: "center",
					}
				}
			})
			worksheet.getCell(headers.length - 2, (level.includes('Sec')? 8 : 7) + paradeCount).font = {
				bold: true,
			};
			worksheet.getCell(headers.length - 2, (level.includes('Sec')? 8 : 7) + paradeCount).alignment = {
				vertical: "middle",
				horizontal: "center",
				wrapText: true,
			}
			worksheet.getCell(headers.length - 2, (level.includes('Sec')? 8 : 7) + paradeCount).fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "cdcdcd" }, // Light grey background
			};
			worksheet.getCell(headers.length - 2, (level.includes('Sec')? 8 : 7) + paradeCount + 1).font = {
				bold: true,
			};
			worksheet.getCell(headers.length - 2, (level.includes('Sec')? 8 : 7) + paradeCount + 1).alignment = {
				vertical: "middle",
				horizontal: "center",
				wrapText: true,
			}
			worksheet.getCell(headers.length - 2, (level.includes('Sec')? 8 : 7) + paradeCount + 1).fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "cdcdcd" }, // Light grey background
			};
			worksheet.getColumn((level.includes('Sec')? 8 : 7) + paradeCount).width = 20
			worksheet.getColumn((level.includes('Sec')? 8 : 7) + paradeCount + 1).width = 20

			paradeCount = Object.values(newLevelTotalParades)[index]
			let rowIndex = headers.length - 2
			let rowLimit = headers.length + rows.length - 7
			for (; rowIndex <= rowLimit; rowIndex += 1) {
				let colIndex = level.includes('Sec')? 8 : 7
				let colLimit = colIndex + paradeCount
				colIndex = 2
				for (; colIndex <= colLimit + 1; colIndex += 1) {
					worksheet.getCell(rowIndex, colIndex).border = {
						top: { style: "thin", color: { argb: "000000" } }, // Black top border
						left: { style: "thin", color: { argb: "000000" } }, // Black left border
						bottom: { style: "thin", color: { argb: "000000" } }, // Black bottom border
						right: { style: "thin", color: { argb: "000000" } }, // Black right border
					}
				}
			}

			for (let rowIndex = 5; rowIndex < 7; rowIndex += 1) {
				let colIndex = level.includes('Sec')? 8 : 7
				let colLimit = colIndex + paradeCount
				for (; colIndex < colLimit; colIndex += 1) {
					worksheet.getCell(rowIndex, colIndex).fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: { argb: "3e629a" }, // Blue background
					};

					worksheet.getCell(rowIndex, colIndex).font = {
						color: { argb: "FFFFFF" }
					}
				}
			}

			for (let colIndex = 2; colIndex <= (level.includes('Sec')?7:6); colIndex += 1) {
				let rowIndex = (level.includes('Sec') && colIndex == 7) || (!level.includes('Sec') && colIndex == 6)? 4 : 5
				worksheet.getCell(rowIndex, colIndex).fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "cdcdcd" }, // Light grey background
				};
			}

			if (level.includes('Sec')) {
				worksheet.getCell("E4").fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "153c7c" }, // Blue background
				};

				worksheet.getCell("E4").font = {
					color: { argb: "FFFFFF" }
				}

				worksheet.getCell("F3").alignment = {
					horizontal: "right",
				};
				worksheet.getCell("E4").alignment = {
					vertical: "middle",
				};
				worksheet.getCell("G4").alignment = {
					vertical: "middle",
					horizontal: "center",
					wrapText: true,
				};
				worksheet.getCell("G4").font = {
					bold: true,
				};

				worksheet.getCell("F5").font = {
					bold: true,
				};
				worksheet.getCell("F5").alignment = {
					vertical: "middle",
					horizontal: "center",
				};

				rows.map((row, rowIndex) => {
					rowIndex += headers.length + 1
					worksheet.getCell("G" + rowIndex).alignment = {
						vertical: "middle",
						horizontal: "center",
					};
				})

				let lastRowIndex = headers.length + rows.length
				worksheet.getCell("F" + (lastRowIndex - 5)).alignment = {
					horizontal: "right",
				};
				worksheet.getCell("F" + (lastRowIndex - 4)).alignment = {
					horizontal: "right",
				};
			} else {
				worksheet.getCell("E3").alignment = {
					horizontal: "right",
				};
				worksheet.getCell("F4").alignment = {
					vertical: "middle",
					horizontal: "center",
					wrapText: true,
				};
				worksheet.getCell("F4").font = {
					bold: true,
					size: 14,
				};

				let lastRowIndex = headers.length + rows.length
				worksheet.getCell("E" + (lastRowIndex - 5)).alignment = {
					horizontal: "right",
				};
				worksheet.getCell("E" + (lastRowIndex - 4)).alignment = {
					horizontal: "right",
				};
			}
		});

		let date = updateDate.toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});

		// Save the workbook
		workbook.xlsx.writeBuffer().then((buffer) => {
		const blob = new Blob([buffer], { type: "application/octet-stream" });
		saveAs(blob, "BB Attendance updated on " + date + ".xlsx");
		});
	}
	return (
		<div>
		  <button onClick={handleParadesData}>Download {year} Attendance</button>
		</div>
	);
};

HandleDownloadWithExcelJS.propTypes = {
	year: PropTypes.number.isRequired
}

export { HandleDownloadWithExcelJS };