import React, { useState } from "react";
import SearchResult from "./SearchResult";
import "./FilterComponent.css";

function FilterComponent() {
	const [searchParameters, setSearchParameters] = useState({
		relevantTechnology: "",
		complexity: "",
		requiredTime: "",
		categories: "",
	});
	const [finalSearchParameters, setFinalSearchParameters] = useState({
		relevantTechnology: "Any",
		complexity: "Any",
		requiredTime: "Any",
		categories: "Any",
		perPage: 20,
	});
	const [loading, setLoading] = useState(true);
	const [perPage, setPerPage] = useState(20);
	const [showPagination, setShowPagination] = useState(true);
	function handleInput(event) {
		const value = event.target.value;
		console.log(value);
		setSearchParameters((prevState) => {
			const { complexity, requiredTime, categories } = prevState;
			return {
				relevantTechnology: value,
				complexity,
				requiredTime,
				categories,
			};
		});
	}
	function handleSelect(event) {
		const name = event.target.name;
		const value = event.target.value;
		if (name === "complexity") {
			setSearchParameters((prevState) => {
				const { relevantTechnology, requiredTime, categories } = prevState;
				return {
					complexity: value,
					relevantTechnology,
					requiredTime,
					categories,
				};
			});
		}
		if (name === "requiredTime") {
			setSearchParameters((prevState) => {
				const { relevantTechnology, complexity, categories } = prevState;
				return {
					requiredTime: value,
					relevantTechnology,
					complexity,
					categories,
				};
			});
		}
		if (name === "categories") {
			setSearchParameters((prevState) => {
				const { relevantTechnology, requiredTime, complexity } = prevState;
				return {
					categories: value,
					relevantTechnology,
					requiredTime,
					complexity,
				};
			});
		}
	}
	function submit() {
		setPerPage(180);
		setShowPagination(false);
		const { complexity, requiredTime, categories } = searchParameters;
		if (
			(complexity === "Any" || complexity === "") &&
			(requiredTime === "Any" || requiredTime === "") &&
			(categories === "Any" || categories === "")
		) {
			setShowPagination(true);
		}
		setLoading(true);
		console.log(searchParameters);
		setFinalSearchParameters(searchParameters);
	}
	function OptionComponent({ options }) {
		return options.map((element) => {
			return <option value={element.value}>{element.title}</option>;
		});
	}
	return (
		<div>
			<div className='container'>
				<div className='input'>
					{/* <label>Relevant Technology</label>
					<input
						type='text'
						onChange={handleInput}
						placeholder='example python, javascript'></input> */}
					<div className='input-item'>
						<label>Complexity</label>
						<select name='complexity' onChange={handleSelect}>
							<option>Any</option>
							<option value='Beginner'>Beginner</option>
							<option value='Intermediate'>Intermediate</option>
							<option value='Advanced'>Advanced</option>
							{/* <OptionComponent options={complexityOptions} /> */}
						</select>
					</div>
					<div className='input-item'>
						<label>Required time</label>
						<select name='requiredTime' onChange={handleSelect}>
							<option>Any</option>
							<option value='Little work'>Little work</option>
							<option value='Medium work'>Medium work</option>
							<option value='Much work'>Much work</option>
							{/* <OptionComponent options={requiredTimeOptions} /> */}
						</select>
					</div>
					<div className='input-item'>
						<label>Categories</label>
						<select name='categories' onChange={handleSelect}>
							<option>Any</option>
							<option value='Mobile App'>Mobile App</option>
							<option value='IoT'>IoT</option>
							<option value='Web app'>Web app</option>
							<option value='Frontend/UI'>Frontend/UI</option>
							<option value='AI/ML'>AI/ML</option>
							<option value='APIs/Backend'>APIs/Backend</option>
							<option value='Voice Assistant'>Voice Assistant</option>
							<option value='Developer Tooling'>Developer Tooling</option>
							<option value='Extension/Plugin/Add-On'>
								Extension/Plugin/Add-On
							</option>
							<option value='Design/UX'>Design/UX</option>
							<option value='AR/VR'>AR/VR</option>
							<option value='Bots'>Bots</option>
							<option value='Security'>Security</option>
							<option value='Blockchain'>Blockchain</option>
							<option value='Futuristic Tech'>Futuristic Tech</option>
						</select>
					</div>
					<div className='input-item'>
						<button className='search' onClick={submit}>
							Search
						</button>
					</div>
				</div>
			</div>
			<SearchResult
				finalSearchParameters={finalSearchParameters}
				loading={loading}
				setLoading={setLoading}
				perPage={perPage}
				showPagination={showPagination}
			/>
		</div>
	);
}

export default FilterComponent;
