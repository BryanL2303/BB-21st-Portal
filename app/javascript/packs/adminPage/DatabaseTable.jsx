import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError';

const DatabaseTable = ({ table_name }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [editData, setEditData] = useState([]);

  useEffect(() => {
    axios.post('/api/admin/0/get_table', {
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
  }, [])

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
    axios.post('/api/admin/0/add_data', {
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

  function toggleEdit(id) {
    let currentEdit = {...editData}
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

  return(
    <table>
      <thead>
        <tr>
          {columns.map((column, index) => {
            if (column['name'] != 'created_at' && column['name'] != 'updated_at') 
              return(<td key={column['name'] + index}>{column['name']}</td>)
          })}
          <td></td>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          if (editData[row['id']]) return(
            <tr key={row['id']}>
              {columns.map((column) => {
                if (column['name'] != 'created_at' && column['name'] != 'updated_at') {
                  if (column['name'] == 'id') return (<td key={column['name']}>{row[column['name']]}</td>)
                  else return(
                    <td key={column['name'] + index}>
                      <textarea className={row['id'] + '-' + column['name'] +'-edit'} defaultValue={row[column['name']]}/>
                    </td>
                  )
                }
              })}
              <td>
                <button onClick={() => {toggleEdit(row['id'])}}>Undo Changes</button>
                <button onClick={() => {updateRow(row['id'])}}>Save Changes</button>
              </td>
            </tr>
          )
          else return(
            <tr key={row['id']}>
              {columns.map((column) => {
                if (column['name'] != 'created_at' && column['name'] != 'updated_at') 
                  return(<td key={column['name'] + index}>{row[column['name']]}</td>)
              })}
              <td>
                <button onClick={() => {toggleEdit(row['id'])}}>Edit Row</button>
                <button onClick={() => {deleteRow(row['id'])}}>Delete Row</button>
              </td>
            </tr>
          )
        })}
        <tr>
          {columns.map((column) => {
            if (column['name'] != 'created_at' && column['name'] != 'updated_at') {
                if (column['name'] == 'id') return (<td key={`${table_name}-${column['name']}`}></td>)
                else return(
                  <td key={`${table_name}-${column['name']}`}>
                    <input className={table_name+ '-' + column['name'] + '-' + 'form'}></input>
                  </td>
                )
            }
          })}
          <td>
            <button onClick={addRow}>Add Row</button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

DatabaseTable.propTypes = {
  table_name: PropTypes.string.isRequired
}

export { DatabaseTable }