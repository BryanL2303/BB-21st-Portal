import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Cookies from 'universal-cookie'

export const AwardContext = createContext([[], function(){}])

export const AwardProvider = props => {
	const cookies = new Cookies()
	let stateOnRender = {awardId: '0', masteryId: '0'}
	if (cookies.get('award') != null) {
		stateOnRender = cookies.get('award')
	} else {
		cookies.set('award', "Award", {path: '/'})
	}
	
	const [award, setAward] = useState(stateOnRender)

	useEffect(() => {
		cookies.set('award', award, {path: '/'})
	}, [award])

	return(
		<AwardContext.Provider value={[award, setAward]}>
			{props.children}
		</AwardContext.Provider>
	)
}

AwardProvider.propTypes = {
	children: PropTypes.node.isRequired, // Specify that children is required
};