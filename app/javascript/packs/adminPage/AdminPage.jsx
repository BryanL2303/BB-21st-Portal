import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError';
import { DatabaseTable } from './DatabaseTable';

// Only meant for admin to initialise the page
const AdminPage = () => {
	const [tableNames, setTableNames] = useState([]);
	const [tableVisible, setTableVisible] = useState();
	const tableRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);

	useEffect(() => {
		axios.post("/application/0/check_session", {}, { withCredentials: true })
		.then(resp => {
			if (resp.data.user?.account_type != 'Admin') window.location.href = '/'
		})
		.catch(err => handleServerError(err.response.status))

		axios.post('/api/admin/0/get_table_names', {}, { withCredentials: true })
		.then(resp => {
			setTableNames(resp.data)
			setTableVisible(resp.data[0])
		})
		.catch(err => handleServerError(err.response.status))
	}, [])

	const onMouseDown = (e) => {
		setIsDragging(true);
		setStartX(e.clientX - tableRef.current.offsetLeft);
		setScrollLeft(tableRef.current.scrollLeft);
	};

	const onMouseLeave = () => {
		setIsDragging(false);
	};

	const onMouseUp = () => {
		setIsDragging(false);
	};

	const onMouseMove = (e) => {
		if (!isDragging) return;
		e.preventDefault();
		const x = e.clientX - tableRef.current.offsetLeft;
		const scroll = (startX - x) + scrollLeft;
		tableRef.current.scrollLeft = scroll;
	};

	return (
		<div className='admin-page'>
			<div className='admin-tables-list'>
				<div>
					{tableNames.map(tableName => (<React.Fragment key={tableName}>
						<input type='radio' onChange={(e) => setTableVisible(e.target.id.split('-')[2])} id={`db-radio-${tableName}`} name='tables' />
						<label htmlFor={`db-radio-${tableName}`}>
							<p>{tableName}</p>
						</label>
					</React.Fragment>))}
				</div>
			</div>
			<div className='page-container' ref={tableRef} onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp} onMouseMove={onMouseMove} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
				<DatabaseTable table_name={tableVisible} />
			</div>
		</div>
	)
}

export { AdminPage }