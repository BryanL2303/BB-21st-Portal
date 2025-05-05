import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError';

const DatabaseTable = ({ table_name }) => {
	const [data, setData] = useState([]);
	const [columns, setColumns] = useState([]);
	const [editData, setEditData] = useState([]);

	useEffect(() => {
		if (table_name) {
			axios.post('/api/admin/0/get_table', { table_name: table_name }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
			.then(resp => {
				setData(resp.data['data'])
				setColumns(resp.data['columns'])
				let initialEdit = {}
				resp.data['data'].map((row) => initialEdit[row['id']] = false)
				setEditData(initialEdit)
			})
			.catch(resp => handleServerError(resp.response.status))
		} 
	}, [table_name])

	function addRow() {
		let new_data = {}
		let changed_columns = []
		columns.map((column) => {
			if (column['name'] != 'created_at' && column['name'] != 'updated_at' && column['name'] != 'id') {
				let input = document.getElementsByClassName(table_name + '-' + column['name'] + '-form')[0]
				if (input.value != null) {
					new_data[column['name']] = input.value
					changed_columns.push(column['name'])
				}
			}
		})
		axios.post('/api/admin/0/add_data', { table_name: table_name, columns: changed_columns, data: new_data }, { withCredentials: true })
		.then(resp => {
			setData(resp.data['data'])
			setColumns(resp.data['columns'])
			let initialEdit = {}
			resp.data['data'].map((row) => {
				initialEdit[row['id']] = false
			})
			setEditData(initialEdit)
		})
		.catch(resp => handleServerError(resp.response.status))
	}

	function toggleEdit(id) {
		let currentEdit = { ...editData }
		currentEdit[id] = !currentEdit[id]
		setEditData(currentEdit)
	}

	function updateRow(id) {
		let new_data = {}
		let changed_columns = []
		columns.map((column) => {
			if (column['name'] != 'created_at' && column['name'] != 'updated_at' && column['name'] != 'id') {
				let input = document.getElementsByClassName(id + '-' + column['name'] + '-edit')[0]
				if (input.value != null) {
					new_data[column['name']] = input.value
					changed_columns.push(column['name'])
				}
			}
		})
		axios.post('/api/admin/' + id + '/update_data', {
			table_name: table_name,
			columns: changed_columns,
			data: new_data
		}, {
			withCredentials: true
		})
			.then(resp => {
				setData(resp.data['data'])
				setColumns(resp.data['columns'])
				let initialEdit = {}
				resp.data['data'].map((row) => {
					initialEdit[row['id']] = false
				})
				setEditData(initialEdit)
			})
			.catch(resp => handleServerError(resp.response.status))
	}

	function deleteRow(id) {
		axios.post('/api/admin/' + id + '/delete_data', {
			table_name: table_name
		}, {
			withCredentials: true
		})
			.then(resp => {
				setData(resp.data['data'])
				setColumns(resp.data['columns'])
				let initialEdit = {}
				resp.data['data'].map((row) => {
					initialEdit[row['id']] = false
				})
				setEditData(initialEdit)
			})
			.catch(resp => handleServerError(resp.response.status))
	}

	return (
		<table>
			<thead>
				<tr>
					{columns.map((column, index) => {
						if (!['created_at', 'updated_at'].includes(column['name'])) return (<th key={column['name'] + index} className={column['name'] == 'id' ? 'id_column' : ''}>{column['name']}</th>)
					})}
					<th colSpan={2}></th>
				</tr>
			</thead>
			<tbody>
				{data.map((row, index) => {
					if (editData[row['id']]) return (
						<tr key={row['id']}>
							{columns.map((column) => {
								if (column['name'] != 'created_at' && column['name'] != 'updated_at') {
									if (column['name'] == 'id') return (<td key={column['name']}>{row[column['name']]}</td>)
									else return (
										<td key={column['name'] + index}>
											<textarea className={row['id'] + '-' + column['name'] + '-edit'} defaultValue={row[column['name']]} name={row['id'] + '-' + column['name'] + '-edit'} />
										</td>
									)
								}
							})}
							<td>
								<button onClick={() => { toggleEdit(row['id']) }}>Undo Changes</button>
							</td>
							<td>
								<button onClick={() => { updateRow(row['id']) }}>Save Changes</button>
							</td>
						</tr>
					)
					else return (
						<tr key={row['id']}>
							{columns.map((column) => {
								if (column['name'] != 'created_at' && column['name'] != 'updated_at')
									return (
										<td 
											key={column['name'] + index} 
											style={{ textAlign: (typeof row[column['name']] === 'string' && row[column['name']].length >= 50) ? 'left' : 'center'}}>
												{((typeof row[column['name']] !== 'string' && typeof row[column['name']] !== 'number') || row[column['name']] === "") ? "-" : String(row[column['name']]).slice(0, 300)}
										</td>
									)
							})}
							<td>
								<button onClick={() => { toggleEdit(row['id']) }}>Edit</button>
							</td>
							<td>
								<button onClick={() => { deleteRow(row['id']) }}>Delete</button>
							</td>
						</tr>
					)
				})}
				<tr>
					{columns.map((column) => {
						if (column['name'] != 'created_at' && column['name'] != 'updated_at') {
							if (column['name'] == 'id') return (<td key={`${table_name}-${column['name']}`}></td>)
							else return (
								<td key={`${table_name}-${column['name']}`}>
									<input className={table_name + '-' + column['name'] + '-' + 'form'} type="text" placeholder={`Enter ${column['name']}`} name={`${table_name}-${column['name']}`} />
								</td>
							)
						}
					})}
					<td colSpan={2}>
						<button onClick={addRow}>Add Row</button>
					</td>
				</tr>
			</tbody>
		</table>
	)
}

DatabaseTable.propTypes = {
	table_name: PropTypes.string
}

export { DatabaseTable }