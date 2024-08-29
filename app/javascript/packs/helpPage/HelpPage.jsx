import React from 'react'
import {NavigationBar} from '../general/NavigationBar'

/*
Provide general assistance and link to user guide
*/
const HelpPage = () => {
  return(
    <div className='help-page'>
      <NavigationBar/>
      <div className='page-container'>
      <br/>
      <br/>
      <h1>About</h1>
      <br/>
      <br/>
      <text>
        This website currently contains functions to prepare results for 32a submission as well as conduct uniform inspections.
      </text>
      <br/>
      <br/>
      <p>Other features are a work in progress.</p>
      <br/>
      <p>The link below will bring you to the user guide which documents how to use the features on the site:</p>
      <br/>
      <a href="https://bryanl2303.github.io/BB-21st-Portal/UserGuide.html">https://bryanl2303.github.io/BB-21st-Portal/UserGuide.html</a>
      </div> 
    </div>
  )
}

export { HelpPage }