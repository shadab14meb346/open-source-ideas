import React from "react";
import django from "../django.jpg";
import parse from "html-react-parser";
import "./CreateCard.css";

function Card(props) {
	let {
		html_url,
		title,
		categories,
		complexities,
		requiredTime,
		bodyInHTML,
	} = props.data;
	if (categories === null) {
		categories = [];
	}
	const formatBodyInHTML = (bodyInHTML) => {
		const array = bodyInHTML.split("<h2>");
		// console.log(array);
		if (array.length === 1) {
			return array[0].split("<h3>")[0];
		}
		return array[1].replace("Project description</h2>", "");
	};
	const relevantTechnologyHTML = (bodyInHTML) => {
		const array = bodyInHTML.split("<h2>");
		if (!array.length) return null;
		if (array.length === 1) {
			return array[0].split("<h3>")[0];
		}
		if (array[2] === undefined) return "<p></p>";
		return array[2].replace("Relevant Technology</h2>", "");
	};
	const Tag = () => {
		// console.log(complexities);
		let valuesForTagElement = [];
		if (complexities[0]) {
			valuesForTagElement.push(complexities[0].split(" ")[0]);
		}
		if (requiredTime[0]) {
			valuesForTagElement.push(requiredTime[0].split(" ")[0] + " work");
		}
		if (categories) {
			if (categories.length <= 4) {
				for (const category of Object.values(categories)) {
					valuesForTagElement.push(category);
				}
			}
		}
		return valuesForTagElement.map((value, index) => {
			return <span key={index}>{value}</span>;
		});
	};
	const List = ({ categories }) => {
		if (categories === null) return null;
		return categories.map((element, index) => {
			return <li key={index}>{element}</li>;
		});
	};
	return (
		<div className='card-inner'>
			<div className='card-content'>
				<div className='title'>
					{/* <img src={django} alt='django' /> */}
					<div>
						<h1>{title}</h1>
						<div className='tag'>
							<Tag />
						</div>
					</div>
				</div>
				<div className='project-description'>
					<h2 className='sub-heading'>Project Description</h2>
					<div className='about'>{parse(formatBodyInHTML(bodyInHTML))}</div>
				</div>
				<div className='relevant-technology'>
					<h3 className='sub-heading'>Relevant Technology</h3>
					<div className='about'>
						{parse(relevantTechnologyHTML(bodyInHTML))}
					</div>
				</div>
				{categories.length ? (
					<div className='categories'>
						<h3 className='sub-heading'>Categories</h3>
						<ul>
							<List categories={categories} />
						</ul>
					</div>
				) : null}
				{complexities.length ? (
					<div>
						<h2 className='sub-heading'>Complexity</h2>
						<p>{complexities}</p>
					</div>
				) : null}
				{requiredTime.length ? (
					<div>
						<h2 className='sub-heading'>Required time (ETA)</h2>
						<p>{requiredTime}</p>
					</div>
				) : null}
				<div className='more'>
					<a href={html_url} target='_blank' rel='noopener noreferrer'>
						View On Github
					</a>
				</div>
			</div>
		</div>
	);
}

export default Card;
