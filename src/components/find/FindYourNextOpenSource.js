import React from "react";
import "./FindYourNextOpenSource.css";
import FilterComponent from "../../components/FilterComponent";

function FindYourNextOpenSource() {
	return (
		<div className='main-container-find'>
			<div className='heading'>
				<h1>Find your next </h1>
				<h1 id='heading-second-line'>Open source project</h1>
				<p>Filter projects by</p>
			</div>
			<FilterComponent />
		</div>
	);
}
export default FindYourNextOpenSource;
