// Displays an error message when the json response from
// the backend is an error
function handleServerError(status) {
    if (status == 401) {
      alert(
        'Unable to verify user...\nPlease try to log out and log in again.'
      );    
    } else if (status == 406) {
      alert(
        'One of the fields provided is incorrect! \nPlease try again.'
      )
    } else if (status == 306) {
      alert(
        'One of the fields has already been taken! \nPlease check the existing list.'
      )
    } else {
      alert(
        'Something went wrong...\nPlease try refreshing the page and trying again.')
    }
  }

  export { handleServerError }