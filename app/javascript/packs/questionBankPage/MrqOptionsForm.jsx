import React, { useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import Cookies from 'universal-cookie'
import axios from 'axios'

/*To create new questions and add them into the question bank
*/
const MrqOptionsForm = () => {
  const cookies = new Cookies()
  const [number, setNumber] = new useState(2)

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  function increaseOptionsNumber(e) {
    e.preventDefault()
    setNumber(number + 1)
  }

  function decreaseOptionsNumber(e) {
    e.preventDefault()
    setNumber(number - 1)
  }

  return(
    <div className='mrq-options-segment'>
      <label>Add in up to 8 options and set the correct answers</label>
      <br/>
      <input type='checkbox' value='1' name='option'></input>
      <input className='create-question-form__option' placeholder='Option 1'></input>
      <br/>
      <input type='checkbox' value='2' name='option'></input>
      <input className='create-question-form__option' placeholder='Option 2'></input>
      <br/>
      {number >= 3 && <input type='checkbox' value='3' name='option'></input>}
      {number >= 3 && <input className='create-question-form__option' placeholder='Option 3'></input>}
      {number == 3 && <button onClick={decreaseOptionsNumber}>Delete Option</button>}
      {number >= 3 && <br/>}
      {number >= 4 && <input type='checkbox' value='4' name='option'></input>}
      {number >= 4 && <input className='create-question-form__option' placeholder='Option 4'></input>}
      {number == 4 && <button onClick={decreaseOptionsNumber}>Delete Option</button>}
      {number >= 4 && <br/>}
      {number >= 5 && <input type='checkbox' value='5' name='option'></input>}
      {number >= 5 && <input className='create-question-form__option' placeholder='Option 5'></input>}
      {number == 5 && <button onClick={decreaseOptionsNumber}>Delete Option</button>}
      {number >= 5 && <br/>}
      {number >= 6 && <input type='checkbox' value='6' name='option'></input>}
      {number >= 6 && <input className='create-question-form__option' placeholder='Option 6'></input>}
      {number == 6 && <button onClick={decreaseOptionsNumber}>Delete Option</button>}
      {number >= 6 && <br/>}
      {number >= 7 && <input type='checkbox' value='7' name='option'></input>}
      {number >= 7 && <input className='create-question-form__option' placeholder='Option 7'></input>}
      {number == 7 && <button onClick={decreaseOptionsNumber}>Delete Option</button>}
      {number >= 7 && <br/>}
      {number >= 8 && <input type='checkbox' value='8' name='option'></input>}
      {number >= 8 && <input className='create-question-form__option' placeholder='Option 8'></input>}
      {number >= 8 && <br/>}
      {number == 8 && <button onClick={decreaseOptionsNumber}>Delete Option</button>}
      {number < 8 && <button onClick={increaseOptionsNumber}>Add Option</button>}
    </div>
  )
}

export { MrqOptionsForm }