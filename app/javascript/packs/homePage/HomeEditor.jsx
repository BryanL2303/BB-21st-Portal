import React from "react";

function HomePageEditor() {
    return (
        <div className="home-editor">
            <h1>Home Page Editor</h1>
            <div>
                <div>
                    <h2>Yearly Achievement(s)</h2>
                    <button><i className="fa-solid fa-plus"></i> New</button>
                </div>

                <div>
                    <input type="number" name="year" placeholder="Enter Year" required />
                    <input type="text" placeholder="Enter Achievement" name="achievement" required />
                    <i className="fa-solid fa-trash"></i>
                </div>

                <button><i className="fa-solid fa-save"></i> Save</button>
            </div>

            <div>
                <div>
                    <h2>Testimonials</h2>
                    <button><i className="fa-solid fa-plus"></i> New</button>
                </div>

                <div className="testimonial-editor">
                    <label htmlFor="date">Date:</label>
                    <input type="date" id="date" name="year" min={1990} max={new Date().getFullYear()} required />
                    <label htmlFor="name">Name:</label>
                    <input type="text" placeholder="Enter Name" required autoComplete="off" />
                    <label htmlFor="testimony-text">Testimony:</label>
                    <textarea id="testimony-text" placeholder="Enter Testimony"></textarea>
                    <button><i className="fa-solid fa-trash"></i> Delete</button>
                </div>
            </div>
        </div>
    )
}

export { HomePageEditor }