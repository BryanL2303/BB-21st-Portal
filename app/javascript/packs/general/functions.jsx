import React from 'react'

/*General functions for the website
*/

//Displays an error message when the json response from
//  the backend is an error
function errorMessage(statusText) {
  if (statusText == "Unauthorized") {
    alert(
      'Unable to verify user...\nPlease try to log out and log in again.'
    );    
  } else {
    alert(
      'Something went wrong...\nPlease try refreshing the page and trying again.')
  }
}

export {errorMessage}