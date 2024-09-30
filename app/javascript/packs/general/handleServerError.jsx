// Displays an error message when the json response from
// the backend is an error
function handleServerError(status) {
    if (status == 401) {
      alert(
        'Unable to verify user...\nPlease try to log out and log in again.'
      );    
    } else {
      alert(
        'Something went wrong...\nPlease try refreshing the page and trying again.')
    }
  }

  export { handleServerError }