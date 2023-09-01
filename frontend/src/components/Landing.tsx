// import React from "react";
import { useNavigate } from 'react-router-dom';
// import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

function Landing() {
	const navigate = useNavigate()

	return <div>
		<div className="landing-intro">
			<div className="landing--head">
				<h1>Inspire. </h1>
				<h1>Educate. </h1>
				<h1>Empower</h1>
			</div>
			<p>This is a community which provides free hands-on training in various fields of computer science</p>
			<p>and have an inclusive community focusing on a learn by doing approach.</p>
			<div className="chip-container">
				<Chip className="chips" label="All Courses" onClick={() => navigate('/Courses')} />
				<Chip className="chips" label="Add Courses" onClick={() => navigate('/addcourse')} />
			</div>
		</div>

		<div className="about-us gradient">
			<div>
				<img src="https://wemakedevs.org/static/media/aboutus.02f2915b9ae736e9ef8a.png" alt="" />
			</div>
			<div>
				<h1>About us</h1>
				<ul>
					<li>
						<span>
						</span>
						We believe that everyone, irrespective of their college or branch, technical or non-technical background can make it big. WeMakeDevs is an initiative built on this thought.</li>
					<li>We provide hands-on training, mentorship for FREE and have an inclusive community.</li>
					<li>Get expert guidance with career, Open Source, and internships, jobs around the world.</li>
					<li>We are also having various events weekly or monthly. Do participate in those events to make your skills enhance.</li>
					<div className="chip-container">
						{/* <Chip className="chips" label="Clickable" onClick={handleClick} />
						<Chip className="chips" label="Clickable" onClick={handleClick} /> */}
					</div>
				</ul>
			</div>
		</div>
	</div>
}

export default Landing;