// Displays an error message when the json response from
// the backend is an error
function handleServerError(status) {
	if (status == 401) {
		alert("Unable to verify user. Please login again.");  
	} else if (status == 406) {
		alert('One of the fields provided is incorrect! \nPlease try again.')
	} else if (status == 306) {
		alert('One of the fields has already been taken! \nPlease check the existing list.')
	} else {
		alert("Something went wrong on our end. Please try again later.");
	}
}

const addError = (message) => {
	const newError = document.createElement('div');
	newError.classList.add('error');
	newError.textContent = message;
	document.querySelector('.error-container').appendChild(newError);

	setTimeout(() => { 
		newError.remove();
	}, 5300);
}

export { handleServerError, addError }