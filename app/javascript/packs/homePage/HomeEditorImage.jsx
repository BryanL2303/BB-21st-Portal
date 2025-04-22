import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleServerError } from "../general/handleServerError";

function HomeEditorImage() {
    const [images, setImages] = useState([]);
    const [dragItem, setDragItem] = useState(null);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        axios.get('/api/home_editor/0/show_images', { headers: { "Content-Type": "application/json" }, withCredentials: true })
        .then(resp => setImages(resp.data))
        .catch(resp => handleServerError(resp.response.status))
    }, [])

    const dragStart = (e) => {
        setDragItem(e.target.id);
        e.target.style.opacity = '0.5';
        if (e.type === "touchstart") setIsTouch(true);
    }

    const dragEnd = (e) => {
        e.target.style.opacity = '1';
        setDragItem(null);
    }

    const dragOver = (e) => {
        e.preventDefault();
    }

    const onDrop = (e) => {
        e.preventDefault();
        const draggedId = dragItem;
        const targetId = e.target.id;

        if (targetId !== "delete" && draggedId !== targetId) {
            const draggedImage = images.find(image => image.id == draggedId);
            const targetImage = images.find(image => image.id == targetId);

            const updatedImages = [...images];
            const draggedIndex = images.indexOf(draggedImage);
            const targetIndex = images.indexOf(targetImage);

            updatedImages[draggedIndex] = targetImage;
            updatedImages[targetIndex] = draggedImage;

            setImages(updatedImages);

            const newOrder = updatedImages.map(image => ({
                id: image.id,
                order: image.order,
            }));

            console.log(newOrder)
            axios.put("/api/home_editor/0/update_image", newOrder, { headers: { "Content-Type": "application/json" }, withCredentials: true })
            .then(resp => {
                if (resp.data == false) throw new Error("Failed to update images");
            })
            .catch(resp => handleServerError(resp.response.status))

        } else if (draggedId && targetId == "delete") {
            axios.post("/api/home_editor/0/delete_image", { image_id: draggedId }, { headers: { "Content-Type": "application/json" }, withCredentials: true })
            .then(resp => {
                if (resp.data != false) {
                    const updatedImages = images.filter(image => image.id != draggedId);
                    setImages(updatedImages);
                }
            })
            .catch(resp => handleServerError(resp.response.status))
        }
    };

    const uploadFile = (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        axios.post('/api/home_editor/0/upload_image', formData, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true })
        .then(resp => {
            const updatedImages = [...images, resp.data];
            setImages(updatedImages);
            alert("Image uploaded.");
        })
        .catch(resp => handleServerError(resp.response.status))
    }

    const handleTouchStart = (e) => {
        setIsTouch(true);
        dragStart(e);
    };

    const handleTouchMove = (e) => {
        if (isTouch) {
          const rect = e.target.getBoundingClientRect();
          const touchX = e.touches[0].clientX - rect.width / 2;
          const touchY = e.touches[0].clientY - rect.height / 2;
    
          e.target.style.left = `${touchX}px`;
          e.target.style.top = `${touchY}px`;
        }
      };
    
    const handleTouchEnd = (e) => {
        dragEnd(e);
    };

    return (
        <div className="home-editor-images">
            <div>
                {images.map(image => 
                    <img 
                        key={image?.id}
                        id={image?.id}
                        src={`data:image/webp;base64,${image?.image}`} 
                        alt={`Image ${image?.id}`}
                        onDragStart={dragStart} 
                        onDragEnd={dragEnd} 
                        onDragOver={dragOver}
                        draggable="true"
                        onDrop={onDrop}
                        tabIndex={0}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    />
                )} 
            </div>

            <div>
                <h3>Upload Image</h3>
                <h3>Delete Image</h3>
                <label htmlFor="file">Drag and Drop or Click to upload</label>
                <input type="file" id="file" accept="image/webp image/png image/jpeg image/jpg" onChange={uploadFile} />
                <div id="delete" onDragOver={dragOver} onDrop={onDrop}>Drag and Drop to delete</div>
            </div>
        </div>  
    )
}

export { HomeEditorImage }