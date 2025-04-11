import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { handleServerError } from "../general/handleServerError";

function HomePage() {
	const [currentImage, setCurrentImage] = useState(1);
	const [testimonies, setTestimonies] = useState([]);
	const [achievements, setAchievements] = useState({});

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImage((prevImage) => (prevImage % 9) + 1);
		}, 4000);

		axios.get("/api/home_editor/0/all_achievements", { headers: { "Content-Type": "application/json" }}) 
		.then(resp => {
			if (resp.data != false) {
				let data = {}
				resp.data.forEach(record => {
					if (data[record.year]) {
						data[record.year].push(record.achievement);
					} else {
						data[record.year] = [record.achievement];
					}
				})

				setAchievements(reversedAchievements)
			}
		})
		.catch(err => {
			handleServerError(err.response.status)
		})

		axios.get("/api/home_editor/0/all_testimonies", { headers: { "Content-Type": "application/json" }}) 
		.then(resp => {
			if (resp.data != false) {
				const duplicatedData = [...resp.data, ...resp.data];
				setTestimonies(duplicatedData)
			}
		})
		.catch(err => {
			handleServerError(err.response.status)
		})

		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<section className='slider' data-slide={currentImage}></section>

			<section className='achievements'>
				<h2>Our Achievements</h2>
				{Object.entries(achievements).map(([year, achievements]) => (
					<div key={year}>
						<h3>{year}</h3>
						<ul>
						{achievements?.map((achievement, index) => (
							<li key={`${year}-${index}`}>{achievement}</li>
						))}
						</ul>
					</div>
				))}
			</section>

			<section className='hero'>
				<h2>Not Just A CCA</h2>
				<div>
					<div></div>
					<p>Our members form lasting friendships and camaraderie through shared experiences and teamwork, fostering a supportive and united community that transcends our activities&apos; boundaries.<br /><br />Empowering youth to take the lead, we nurtures future-ready leaders with the skills, confidence, and character to inspire change and make a difference.</p>
					<div></div>
				</div>
			</section>

			<section className="testimonies">
				<h2>{`Don't just take it from us`}</h2>
				<div className="scroller">
					<div>
						{testimonies?.map((testimony, index) => (
							<div key={index} className="testimony">
								<p>{testimony?.testimony}</p>
								<p>{testimony?.name} | {testimony?.date?.split("T")[0].replaceAll("-", " ")}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	)
}

export { HomePage }
