import React, { useState, useEffect } from 'react'
import axios from 'axios'

/*To edit existing questions and update the database
*/
const OpenEndedRubricEditor = ({ question }) => {
  const [rubric, setRubric] = useState([])
  const [edit, setEdit] = useState('false')

  useEffect(() => {
    axios.post('/api/question/0/get_rubric', {
      question_id: question.id
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setRubric(resp.data.rubric)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  //Sends the information from the form to the backend to edit the options
  //Also delete the options deleted
  function submitForm(e) {
    e.preventDefault()
    axios.post('/api/question/0/edit_question', {
      question_id: question.id,
      question: e.target[0].value,
      marks: e.target[1].value,
      rubric: e.target[2].value
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(
      //Reset all the input fields
    )
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function setPermanent(e) {
    e.preventDefault()
    axios.post('/api/question/0/set_permanent', {
      question_id: question.id
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      question = resp.data
      alert("Refresh the page")
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }
 
  //Sends the information from the form to the backend to edit the options
  //Also delete the options deleted
  function deleteQuestion(e) {
    e.preventDefault()
    axios.post('/api/question/0/delete_question', {
      question_id: question.id
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(setEdit('deleted'))
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function showEdit(e) {
    e.preventDefault()
    setEdit('true')
  }

  function blurEdit(e) {
    e.preventDefault()
    setEdit('false')
  }

  return(
    <div>
      {edit == 'false' && <button className={question.id} onClick={showEdit}>{question.question}</button>}
    
      {edit == 'true' && <div className='question-editor'>
        <form onSubmit={ submitForm }>
        <label>Question: </label>
        <input defaultValue={question.question}></input>
        <label> Marks: </label>
        <input defaultValue={question.marks}></input>
        <label> Rubric: </label>
        <textarea defaultValue={rubric}></textarea>
        {!question.assigned && <button>Save Options</button>}
        </form>
        {!question.permanent && <button onClick={ setPermanent }>Make Question Permanent</button>}
        {!question.assigned && <button onClick={ deleteQuestion }>Delete Question</button>}
        <button onClick={ blurEdit }>Hide</button>
      </div>}
    </div>
  )
}

export { OpenEndedRubricEditor }