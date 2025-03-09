import React from "react";
import PropTypes from "prop-types";
import useCookies from '../general/useCookies'

const PendingTasks = ({ userId, paradesAfterToday }) => {
    const cookies = useCookies();

    function daysUntilSaturday() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysToSaturday = (6 - dayOfWeek + 7) % 7;
        return {days: (daysToSaturday === 0 ? 'Today' : daysToSaturday), lessThanTwoDays: daysToSaturday < 2};
    }

    return (
        <div className="pending-tasks">
            <h2>Pending Tasks</h2>

            <div className="tasks">
                {paradesAfterToday.length > 0 && <ol>
                    {/* Check if there is an upcoming parade */}
                    {paradesAfterToday.length > 0 && paradesAfterToday.map(parade => 
                        <li key={parade.id + "upcoming"}>There is an upcoming Parade on {new Date(parade.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</li>
                    )}

                    {/* Check if the user has any roles in the parade */} 
                    {paradesAfterToday.length > 0 && paradesAfterToday.map(parade => {
                        return ["do", "dt", "flag_bearer", "cos"].map(role => {
                            if (parade[`${role}_id`] && parade[`${role}_id`] == userId) {
                                return (
                                    <li key={parade.id + role}>You are the <strong>{role === "flag_bearer" ? "Flag Bearer" : role.toUpperCase()}</strong> for the upcoming {new Date(parade.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} Parade</li>
                                )
                            }
                        })
                    })}

                    {/* Check if there is no parade notice and that there is < 2 days to sat */}
                    {paradesAfterToday.length === 0 && daysUntilSaturday().lessThanTwoDays && (['Admin', 'Officer'].includes(cookies.get('Type')) || ['CSM', 'DY CSM', 'Admin Sergeant'].includes(cookies.get('Appointment'))) &&
                        <li>The Parade Notice for this coming Saturday has not been created. Days to Saturday: {daysUntilSaturday().days}</li>
                    }
                </ol>}

                {paradesAfterToday.length === 0 &&
                <div>
                    <i className="fa-solid fa-party-horn"></i>
                    <p>No Pending Tasks</p>
                </div>}
            </div>
        </div>
    )
};

PendingTasks.propTypes = {
    userId: PropTypes.number,
    paradesAfterToday: PropTypes.array
};

export { PendingTasks };