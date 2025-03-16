import React, { useEffect, useState } from "react";
import HelpPageSectionContent from "./HelpPageSectionContent";
import axios from "axios";
import { handleServerError } from '../general/handleServerError'

function HelpPage() {
    const [accountType, setAccountType] = useState(null);
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        axios.post("/application/0/check_session", {}, {
            withCredentials: true,
        })
        .then((resp) => {
            setAccountType(resp.data.user?.account_type);
            setAppointment(resp.data.user?.appointment);
        })
        .catch(() => {
            if (response.status === 401) {
                window.location.href = "/";
            } else {
                handleServerError(response.status);
            }
        })
    }, []);

    return (
        <div className="help-page">
            <div>
                <div>
                    <p>Overview</p>
                    <a href="#website-purpose">Website's purpose</a>
                    <a href="#features">Features</a>

                    <p>Home Page</p>
                    <a href="#routes">Routes</a>
                    <a href="#pending-tasks">Pending Tasks</a>

                    {(accountType !== "Boy" || appointment) && <>
                    <p>User Management</p>
                    <a href="#create-new-account">Create new account</a>
                    <a href="#update-existing-account">Update existing account</a>
                    <a href="#delete-existing-account">Delete existing account</a>
                    </>}
                    
                    <p>Parade &amp; Attendance</p>
                    {(accountType !== "Boy" || appointment) && <a href="#create-parade">Creating a parade</a>}
                    <a href="#view-existing-parade">Viewing existing parade</a>
                    {(accountType !== "Boy" || appointment) && <a href="#edit-existing-parade">Edit existing parade</a>}
                    <a href="#download-attendance-file">Download attendance file</a>
                    <a href="#update-parade-attendance">Update parade attendance</a>

                    {(accountType !== "Boy" || appointment) && <>
                    <p>Awards Management</p>
                    <a href="#updating-awards-tracker">Updating awards tracker</a>
                    <a href="#award-requirements">Award requirements</a>

                    <p>Results Generation</p>
                    <a href="#generate-32a-results">Generating 32A results</a>
                    </>}

                    {accountType !== "Boy" && <>
                    <p>Uniform Inspection</p>
                    <a href="#viewing-inspection-results">Viewing inspection results</a>
                    <a href="#conducting-inspection">Conducting inspection</a>
                    </>}

                    {accountType === "Boy" && <>
                    <p>Boys' Awards</p>
                    <a href="#viewing-boys-awards">Viewing Boys&#39; Awards</a>
                    </>}
                </div>
            </div>

            <HelpPageSectionContent accountType={accountType} appointment={appointment} />
        </div>
    );
}

export { HelpPage }