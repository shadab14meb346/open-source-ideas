import React from "react";
import "./pagination.css";
const TOTAL_PAGES = 9;

function Pagination({ currentPage, setCurrentPage, setLoading }) {
	function selected(e) {
		setLoading(true);
		setCurrentPage(e.target.value);
	}
	const paginationArray = [...Array(TOTAL_PAGES).keys()].map(
		(value) => value + 1,
	);
	return (
		<div className='pagination'>
			{paginationArray.map((value) => {
				return (
					<button
						value={value}
						className={currentPage == value ? "page-active" : null}
						onClick={selected}
						key={value}>
						{value}
					</button>
				);
			})}
		</div>
	);
}
export default Pagination;
