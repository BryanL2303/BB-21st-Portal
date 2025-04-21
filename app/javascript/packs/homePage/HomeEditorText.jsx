import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleServerError } from "../general/handleServerError";

function HomeEditorText() {
    const [testimonials, setTestimonials] = useState([]);
    const [achievements, setachievements] = useState([]);

    useEffect(() => {
        axios.post("/application/0/check_session", {}, { withCredentials: true })
        .then(response => {
            if (response.data.user?.account_type == 'Boy' && response.data.user?.appointment == null) window.location.href = '/home'
        })
        .catch(() => window.location.href = '/')
    }, [])

    useEffect(() => {
        axios.get("/api/home_editor/0/all_testimonies", { headers: { "Content-Type": "application/json" }, withCredentials: true })
        .then(resp => setTestimonials(resp.data))
        .catch(resp => handleServerError(resp.response.status))

        axios.get("/api/home_editor/0/all_achievements", { headers: { "Content-Type": "application/json" }, withCredentials: true })
        .then(resp => setachievements(resp.data))
        .catch(resp => handleServerError(resp.response.status))

        const handleDelete = (e) => {
            if ((e.target.tagName === "BUTTON" && e.target.textContent.trim().toLowerCase() === "delete")) {
                const id = e.target.parentElement.getAttribute("data-id")
                if (!id) {
                    e.target.parentElement.remove()
                    return;
                }

                axios.post("/api/home_editor/0/delete_testimony", { testimony_id: id }, { headers: { "Content-Type": "application/json" }, withCredentials: true })
                .then(resp => {
                    if (resp.data != false) {
                        alert("Testimony deleted")
                        e.target.parentElement.remove() 
                    }
                })
                .catch(error => {
                    console.error(error)
                    handleServerError(error.response.status)
                })
            } else if (e.target.classList.contains("fa-trash")) {
                const id = e.target.parentElement.getAttribute("data-id")
                if (!id) {
                    e.target.parentElement.remove()
                    return;
                }

                axios.post("/api/home_editor/0/delete_achievement", { achievement_id: id }, { headers: { "Content-Type": "application/json" }, withCredentials: true })
                .then(resp => {
                    if (resp.data != false) {
                        alert("Achievement deleted")
                        e.target.parentElement.remove() 
                    }
                })
                .catch(error => {
                    console.error(error)
                    handleServerError(error.response.status)
                }) 
            }
        }

        document.addEventListener("click", handleDelete)
    }, [])

    const newElement = (templateId, parentId) => {
        const template = document.querySelector(`.${templateId}`);
        if (!template) return;
        const templateHTML = template.cloneNode(true);
        Array.from(templateHTML.querySelectorAll("input, textarea")).map(field => field.value = "");
        templateHTML.removeAttribute("data-id")
        document.getElementById(parentId).appendChild(templateHTML);
    }

    const testimonySubmit = (e) => {
        e.preventDefault();
        const data = [];
        if (!e.target.checkValidity()) return alert("One or more fields in the Testimony Form is invalid")

        Array.from(e.target.getElementsByClassName("testimonial-editor")).map(testimony => {
            const id = testimony.getAttribute("data-id")
            const [date, name] = Array.from(testimony.getElementsByTagName("input")).map(input => input.value);
            const content = testimony.querySelector("textarea").value;

            data.push({
                "id": id,
                "date": date,
                "name": name,
                "content": content
            })
        })

        axios.put("/api/home_editor/0/update_testimonies", data, { headers: { "Content-Type": "application/json" }, withCredentials: true })
        .then(resp => {
            if (resp.data != false) alert("Testimonies updated")
        })
        .catch(error => {
            console.error(error)
            handleServerError(error.response.status)
        })
    }

    const achievementSubmit = (e) => {
        e.preventDefault();
        const data = [];
        if (!e.target.checkValidity()) return alert("One or more fields in the Achievement Form is invalid")

        Array.from(e.target.getElementsByClassName("achievement-editor")).map(achievement => {
            const id = achievement.getAttribute("data-id")
            const [date, content] = Array.from(achievement.getElementsByTagName("input")).map(input => input.value);
            
            data.push({
                "id": id,
                "date": date,
                "achievement": content
            })
        })

        axios.put("/api/home_editor/0/update_achievements", data, { headers: { "Content-Type": "application/json" }, withCredentials: true })
        .then(resp => {
            if (resp.data != false) alert("Achievements updated")
        })
        .catch(error => {
            console.error(error)
            handleServerError(error.response.status)
        })
    }

    return (
        <React.Fragment>
            <form id="achievement-container" onSubmit={achievementSubmit} noValidate>
                <div>
                    <h2>Yearly Achievement(s)</h2>
                    <div>
                        <button type="button" onClick={() => newElement("achievement-editor", "achievement-container")}><i className="fa-solid fa-plus"></i> New</button>
                        <button type="submit"><i className="fa-solid fa-save"></i> Save</button>
                    </div>
                </div>

                {achievements.map(achievement => (
                    <div key={achievement.id} className="achievement-editor" data-id={achievement.id}>
                        <input type="number" name="year" placeholder="Enter Year" defaultValue={achievement.year} max={new Date().getFullYear()} min={"1984"} required />
                        <input type="text" placeholder="Enter Achievement" name="achievement" required defaultValue={achievement.achievement} />
                        <i className="fa-solid fa-trash"></i>
                    </div>
                ))}
            </form>

            <form id="testimonial-container" onSubmit={testimonySubmit} noValidate>
                <div>
                    <h2>Testimonials</h2>
                    <div>
                        <button type="button" onClick={() => newElement("testimonial-editor", "testimonial-container")}><i className="fa-solid fa-plus"></i> New</button>
                        <button type="submit"><i className="fa-solid fa-save"></i> Save</button>
                    </div>
                </div>

                {testimonials.map(testimonial => (
                    <div key={testimonial.id} className="testimonial-editor" data-id={testimonial.id}>
                        <label htmlFor={`date-${testimonial.id}`}>Date:</label>
                        <input type="date" id={`date-${testimonial.id}`} name="year" min={"1990-01-01"} max={new Date().toISOString().split('T')[0]} defaultValue={testimonial.date.split("T")[0]} required />
                        <label htmlFor={`name-${testimonial.id}`}>Name:</label>
                        <input type="text" id={`name-${testimonial.id}`} placeholder="Enter Name" required autoComplete="off" defaultValue={testimonial.name} />
                        <label htmlFor={`content-${testimonial.id}`}>Testimony:</label>
                        <textarea id={`content-${testimonial.id}`} placeholder="Enter Testimony" defaultValue={testimonial.testimony} ></textarea>
                        <button type="button"><i className="fa-solid fa-trash"></i> Delete</button>
                    </div>
                ))}
            </form>

            <template>
                <div className="testimonial-editor">
                    <label htmlFor="date">Date:</label>
                    <input type="date" id="date" name="year" min={"1984-01-01"} max={new Date().toISOString().split('T')[0]} defaultValue={new Date().toISOString().split('T')[0]} required />
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" placeholder="Enter Name" required autoComplete="off" />
                    <label htmlFor="testimony-text">Testimony:</label>
                    <textarea id="testimony-text" placeholder="Enter Testimony"></textarea>
                    <button type="button"><i className="fa-solid fa-trash"></i> Delete</button>
                </div>
            </template>

            <template>
                <div className="achievement-editor">
                    <input type="number" name="year" placeholder="Enter Year" defaultValue={new Date().getFullYear()} max={new Date().getFullYear()} min={"1984"} required />
                    <input type="text" placeholder="Enter Achievement" name="achievement" required />
                    <i className="fa-solid fa-trash"></i>
                </div>
            </template>
        </React.Fragment>
    )
}

export default HomeEditorText