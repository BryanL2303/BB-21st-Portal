import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleServerError } from "../general/handleServerError";

function UniformInspectionUser() {
    const [inspectionList, setInspectionList] = useState([]);
    const [selectedInspection, setSelectedInspection] = useState();
    const [checked, setChecked] = useState([]);

    useEffect(() => {
        axios.post("/application/0/check_session", {}, { withCredentials: true })
        .then(response => {
            if (response.data.user?.account_type != 'Boy') window.location.href = '/home'

            axios.get("/api/uniform_inspection/0/get_user_inspection_results", { withCredentials: true })
            .then(response => {
                setInspectionList(response.data)
            })
            .catch((response) => handleServerError(response.statusCode))
        })
        .catch(() => window.location.href = '/')
    }, []);

    const getInspection = (id) => {
        axios.post(`/api/uniform_inspection/0/get_user_inspection_results_simplified`, { inspection_id: id })
        .then(resp => {
            console.log(resp.data) 
            setSelectedInspection(resp.data)
            setChecked(Array.from(resp.data.checked).map(field => `${field.component_field_id}`))
        })
        .catch(resp => handleServerError(resp.response.status))
    }

    return (
        <div className="uniform-inspection-user">
            <h2>My Uniform Inspections Results</h2>

            <div>
                <section>
                    <div>
                        {inspectionList.length > 0 ? inspectionList.map(inspection => (
                        <React.Fragment key={inspection.id}>
                            <input type="radio" name="inspection_selection" id={inspection.id} onChange={() => getInspection(inspection.id)} />
                            <label htmlFor={inspection.id}>
                                <p title="Inspection Date">{inspection?.date}</p>
                                <p title="Inspection Score">{inspection?.total_score}</p>
                            </label>
                        </React.Fragment>)) : <p>No inspection results</p>}
                    </div>
                </section>

                <hr />

                <section>
                    {selectedInspection ? 
                        <>
                            <div>
                                <p>Date</p>
                                <p>{selectedInspection?.details?.date}</p>
                                <p>Assessor</p>
                                <p>{selectedInspection?.details?.assessor_name}</p>
                                <p>Score</p>
                                <p>{selectedInspection?.details?.total_score}</p>
                            </div>
                            
                            {selectedInspection?.headings.map(heading => (
                                <div key={heading.id}>
                                    <h3>{heading?.component_name}</h3>
                                    <ul>
                                    {Array.from(selectedInspection?.subheadings).filter(subheading => subheading.uniform_component_id == heading.id).map(subheading => (
                                        <li key={`${heading.id}-${subheading.id}`}>
                                            <input type="checkbox" disabled id={`sub-${subheading.id}`} checked={checked.includes(`${subheading.id}`)} className={`${subheading.description.toLowerCase().includes("missing") ? "field-missing" : ""}`} />
                                            <label htmlFor={`sub-${subheading.id}`}>{subheading?.description}</label>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                            ))}
                        </>
                    : <p>Click on an inspection to view results</p>}
                </section>
            </div>
        </div>
    )
}

export { UniformInspectionUser }