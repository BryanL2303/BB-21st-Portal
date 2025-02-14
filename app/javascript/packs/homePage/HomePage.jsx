import { useState, useEffect } from 'react'


function homePage() {
	const [currentImage, setCurrentImage] = useState(1);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImage((prevImage) => (prevImage % 9) + 1);
		}, 4000);

		return () => clearInterval(interval);
	}, []);

	const testimonies = [
		{
			content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora, optio accusamus ipsam molestiae, omnis voluptatum repellat atque laboriosam dolor amet sint tempore minima eius maiores officia voluptates voluptas aspernatur autem!',
			author: 'Name | Date',
		},
		{
			content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam culpa perferendis debitis, esse, voluptatem beatae maxime facilis cupiditate laudantium minus omnis voluptas accusantium, maiores ipsum fuga nulla quo enim eveniet?',
			author: 'Name | Date',
		},
		{
			content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad porro ab autem enim. Eos quam eligendi minus voluptas maxime magnam eaque possimus dolorum quisquam, inventore unde totam, at labore dolor.',
			author: 'Name | Date',
		},
	];

	const duplicatedTestimonies = [...testimonies, ...testimonies];

	return (
		<>
			<Header></Header>

			<section className='slider' data-slide={currentImage}></section>

			<section className='achievements'>
				<h2>Our Achievements</h2>
				<div>
					<h3>2024</h3>
					<ul>
						<li>BB Blaze 2024 - Silver Honour Roll</li>
						<li>J M Fraser Award 2024 - Distinction</li>
						<li>Founder's Award 2024 -Staff Sergeant Emmanuel Lim Tze Yong -Staff Sergeant Asher Long Zhijie</li>
						<li>BB Cares 2024 - Partnership with Lions Befrienders to engage elderly folk through conversations and cleaning their homes.</li>
						<li>BB Character Quest 2024 - Results to be released</li>
						<li>BB Share-a-Gift 2024</li>
					</ul>
				</div>
				<div>
					<h3>2023</h3>
					<ul>
						<li>Staff Sergeants Dylan Yeo, Jaedon Ho and Jesse Oh were awarded the Founder’s Award 2022</li>
						<li>Bronze Honour Roll placing in Boys’ Brigade Adventure Blaze 2023 Competition</li>
						<li>Awarded J M Frazer Distinction Award</li>
						<li>Created and celebrated National Day event with the residents of Geylang East Home for the Aged as part of BB Cares VIA Outreach programme.</li>
					</ul>
				</div>
			</section>

			<section className='hero'>
				<h2>Not Just A CCA</h2>
				<div>
					<div></div>
					<p>Our members form lasting friendships and camaraderie through shared experiences and teamwork, fostering a supportive and united community that transcends our activities' boundaries.<br /><br />Empowering youth to take the lead, we nurtures future-ready leaders with the skills, confidence, and character to inspire change and make a difference.</p>
					<div></div>
				</div>
			</section>

			<section className="testimonies">
				<h2>Don't just take it from us</h2>
				<div className="scroller">
					<div>
						{duplicatedTestimonies.map((testimony, index) => (
							<div key={index} className="testimony">
								<p>{testimony.content}</p>
								<p>{testimony.author}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<Footer></Footer>
		</>
	)
}

export { homePage }
