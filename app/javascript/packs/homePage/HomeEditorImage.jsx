import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleServerError } from "../general/handleServerError";

function HomeEditorImage() {
    const [images, setImages] = useState([])

    useEffect(() => {
        axios.get('/api/home_editor/0/show_images', { headers: { "Content-Type": "application/json" }, withCredentials: true })
        .then(resp => {
            console.log(resp.data)
            setImages(resp.data)
        })
        .catch(resp => handleServerError(resp.response.status))
    }, [])

    return (
        <div className="home-editor-images">
            {images.map(image => <img src={`data:image/webp;base64,${image.image}`} alt="Image" />)} 
        </div>  
    )
}

export { HomeEditorImage }