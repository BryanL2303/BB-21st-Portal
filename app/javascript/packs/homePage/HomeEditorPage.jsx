import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleServerError } from "../general/handleServerError";
import HomeEditorText from "./HomeEditorText";
import { HomeEditorImage } from "./HomeEditorImage";

function HomeEditorPage() {
    const [, setUser] = useState({});
    const [pageType, setPageType] = useState('text');

    useEffect(() => {
        axios.post("/application/0/check_session", {}, { withCredentials: true })
        .then(response => {
            if (response.data.user?.account_type == 'Boy' && response.data.user?.appointment != "Admin") window.location.href = '/home'
            setUser(response.data.user)
        })
        .catch((err) => handleServerError(err.status))
    }, [])

    return (
        <div className="home-editor">
            <div>
                <h1>Home Page Editor</h1>

                <div className="editor-toggle">
                    <input type="radio" name="toggle" id="text" defaultChecked={true} onChange={(e) => setPageType(e.target.id)} />
                    <label htmlFor="text">Text</label>
                    <input type="radio" name="toggle" id="image" onChange={(e) => setPageType(e.target.id)} />
                    <label htmlFor="image">Images</label>
                </div>
            </div>

            {pageType == 'text' ? <HomeEditorText /> : <HomeEditorImage />}
        </div>
    )
}

export { HomeEditorPage }