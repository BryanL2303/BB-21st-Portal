import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie';
import axios from 'axios'
import { NavigationBar } from '../general/NavigationBar'
import { DatabaseTable } from './DatabaseTable';
import { errorMessage } from '../general/functions';

/*Only meant for admin to initialise the page
*/
const AdminPage = () => {
  const cookies = new Cookies()
  const [tableNames, setTableNames] = useState([]);
  const [tableVisible, setTableVisible] = useState({});

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  useEffect(() => {
    axios.post('/api/admin/0/get_table_names', {})
    .then(resp => {
      setTableNames(resp.data)
      let initialVisbility = {}
      resp.data.map((table_name) => {
        initialVisbility[table_name] = false
      })
      setTableVisible(initialVisbility)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  function toggleTableVisibility(table_name) {
    let currentTable = {...tableVisible}
    currentTable[table_name] = !currentTable[table_name]
    setTableVisible(currentTable)
  }

  return(
    <div className='admin-page'>
      <NavigationBar/>
      <div className='page-container'>
        {tableNames.map((table_name) => {
          return(
            <div className = "database-table">
              <h1>{table_name}</h1>
              <button onClick={() => {toggleTableVisibility(table_name)}}>Show Table</button>
              {tableVisible[table_name] && <DatabaseTable table_name={table_name}/>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { AdminPage }