import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie';
import axios from 'axios'
import { errorMessage } from '../general/functions';

const DatabaseTable = ({table_name}) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [editData, setEditData] = useState([]);

  useEffect(() => {
    axios.post('/api/admin/0/get_table', {
        table_name: table_name
    }, {
      withCredentials: true  // Include credentials (cookies)
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
    .catch(resp => errorMessage(resp.response.statusText))
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
      withCredentials: true  // Include credentials (cookies)
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
    .catch(resp => errorMessage(resp.response.statusText))
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
      withCredentials: true  // Include credentials (cookies)
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
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function deleteRow(id) {
    axios.post('/api/admin/' + id + '/delete_data', {
      table_name: table_name
    }, {
      withCredentials: true  // Include credentials (cookies)
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
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <table>
      <thead>
        <tr>
          {columns.map((column) => {
            if (column['name'] != 'created_at' && column['name'] != 'updated_at') {
              return(
                <td>
                  {column['name']}
                </td>
              )
            }
          })}
          <td></td>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          if (editData[row['id']]) {
            return(
                <tr>
                  {columns.map((column) => {
                    if (column['name'] != 'created_at' && column['name'] != 'updated_at') {
                      if (column['name'] == 'id') {
                        return (<td>{row[column['name']]}</td>)
                      }
                      else {
                        return(
                            <td>
                              <input className={row['id'] + '-' + column['name'] + '-edit'} defaultValue={row[column['name']]}></input>
                            </td>
                        )
                      }
                    }
                  })}
                  <td>
                    <button onClick={() => {toggleEdit(row['id'])}}>Undo Changes</button>
                    <button onClick={() => {updateRow(row['id'])}}>Save Changes</button>
                  </td>
                </tr>
            )
          }
          else {
            return(
                <tr>
                  {columns.map((column) => {
                    if (column['name'] != 'created_at' && column['name'] != 'updated_at') {
                      return(
                        <td>
                          {row[column['name']]}
                        </td>
                      )
                    }
                  })}
                  <td>
                    <button onClick={() => {toggleEdit(row['id'])}}>Edit Row</button>
                    <button onClick={() => {deleteRow(row['id'])}}>Delete Row</button>
                  </td>
                </tr>
            )
          }
        })}
        <tr>
          {columns.map((column) => {
            if (column['name'] != 'created_at' && column['name'] != 'updated_at') {
                if (column['name'] == 'id') {
                    return (<td></td>)
                }
                else {
                    return(
                        <td>
                            <input className={table_name+ '-' + column['name'] + '-' + 'form'}></input>
                        </td>
                    )
                }
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

export { DatabaseTable }