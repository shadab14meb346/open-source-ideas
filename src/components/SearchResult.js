import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./CreateCard";
import Pagination from "./pagination/pagination";
import "./SearchResult.css";
const objectForCard = {
	url: "www",
	title:
		"Firebase support for django - authentication, firestore and cloud functions",
	projectDescription:
		"The idea is to use firebase cloud services for the website. As far as I know, the basic idea of firebase is server less deployment. I run into a situation where I need to use firebase and django together. I have implemented authentication using firebase admin and firebase-webui.. At the moment I have the following things, it can be updated",
	categories: "AI/ML, IOT, AV/VR",
	complexity:
		"[x] Intermediate - The user should have some prior knowledge of the technolog(y|ies) to the point where they know how to use it, but not necessarily all the nooks and crannies of the technology",
	requiredTime:
		"[x] Much work - The project will take more than a couple of weeks and serious planning is required",
};
const getTickedValues = (string) => {
	const tickedValues = [];
	const categoriesStringArray = string.split("\n");
	for (const element of categoriesStringArray) {
		if (element && element.includes("[x]")) {
			tickedValues.push(element.replace("[x]", "").replace("-", "").trim());
		}
	}
	return tickedValues;
};
const getCategories = (categoriesString) => {
	if (!categoriesString || categoriesString === undefined) {
		return null;
	}
	const categories = getTickedValues(categoriesString);
	return categories;
};
const getComplexities = (complexitiesString) => {
	if (!complexitiesString || complexitiesString === undefined) return [];
	const complexities = getTickedValues(complexitiesString);
	return complexities;
};
const getRequiredTime = (requiredTimeString) => {
	if (!requiredTimeString || requiredTimeString === undefined) return [];
	const requiredTime = getTickedValues(requiredTimeString);
	return requiredTime;
};

function convertToJSON(rawData) {
	class ResultObject {
		constructor(
			html_url,
			title,
			projectDescription,
			categories,
			complexities,
			requiredTime,
			relevantTechnology,
			bodyInHTML,
		) {
			this.html_url = html_url;
			this.title = title;
			this.projectDescription = projectDescription;
			this.categories = getCategories(categories);
			this.complexities = getComplexities(complexities);
			this.requiredTime = getRequiredTime(requiredTime);
			this.relevantTechnology = relevantTechnology;
			this.bodyInHTML = bodyInHTML;
		}
	}
	return rawData.map((item) => {
		const { title, body, html_url, bodyInHTML } = item;
		const relevantDataArray = body.split("##");
		let categories = "";
		let complexities = "";
		let requiredTime = "";
		let relevantTechnology = "";
		let projectDescription = "";
		for (const stringedValue of relevantDataArray) {
			if (stringedValue.trim().startsWith("Project description")) {
				projectDescription = stringedValue
					.replace("Project description", "")
					.trim();
			}
			if (stringedValue.trim().startsWith("Relevant Technology")) {
				relevantTechnology = stringedValue
					.replace("Relevant Technology", "")
					.trim();
			}
			if (stringedValue.trim().startsWith("# Complexity")) {
				complexities = stringedValue.replace("# Complexity", "").trim();
			}
			if (stringedValue.trim().startsWith("# Required time (ETA)")) {
				requiredTime = stringedValue
					.replace("# Required time (ETA)", "")
					.trim();
			}
			if (stringedValue.trim().startsWith("# Categories")) {
				categories = stringedValue.replace("# Categories", "").trim();
			}
		}
		return new ResultObject(
			html_url,
			title,
			projectDescription,
			categories,
			complexities,
			requiredTime,
			relevantTechnology,
			bodyInHTML,
		);
	});
}

// function convertToEndJSON(jsonData) {
// 	const requiredData = [];
// 	for (const element of jsonData) {
// 		if (element) {
// 			const {
// 				title,
// 				projectDescription,
// 				categories,
// 				complexities,
// 				requiredTime,
// 				relevantTechnology,
// 			} = element;
// 			requiredData.push({
// 				title,
// 				projectDescription,
// 				categories: getCategories(categories),
// 				complexities,
// 				requiredTime,
// 				relevantTechnology,
// 			});
// 		}
// 	}
// 	return requiredData;
// }
const Loading = () => {
	return (
		<div className='loading'>
			<h1>Loading...</h1>
		</div>
	);
};
function SearchResults({
	finalSearchParameters,
	loading,
	setLoading,
	perPage,
	showPagination,
}) {
	console.log(finalSearchParameters);
	const { complexity, requiredTime, categories } = finalSearchParameters;
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	useEffect(() => {
		fetch(
			`https://api.github.com/repos/open-source-ideas/open-source-ideas/issues?per_page=${perPage}&page=${currentPage}`,
		)
			.then((response) => response.json())
			.then((data) => {
				const requestsBodyToHtml = data.map((item) => {
					const url = "https://api.github.com/markdown";
					return axios({
						method: "POST",
						url,
						headers: {
							"Access-Control-Allow-Origin": "http://localhost:3000",
							Authorization: "token 599a7284c15ea2e309bf291fdffcd75a2de2b0ad",
							"Content-Type": "application/json",
						},
						data: {
							text: item.body,
							mode: "gfm",
							context: "github/gollum",
						},
					});
				});
				axios.all(requestsBodyToHtml).then((responses) => {
					setLoading(false);
					data = data.map((item, index) => {
						item.bodyInHTML = responses[index].data;
						return item;
					});
					let responseData = convertToJSON(data);
					if (complexity && complexity !== "Any") {
						responseData = responseData.filter((element) => {
							if (element.complexities[0]) {
								return element.complexities[0].includes(complexity);
							}
						});
					}
					if (requiredTime && requiredTime !== "Any") {
						responseData = responseData.filter((element) => {
							if (element.requiredTime[0]) {
								return element.requiredTime[0].includes(requiredTime);
							}
						});
					}
					if (categories && categories !== "Any") {
						responseData = responseData.filter((element) => {
							if (element.categories) {
								return element.categories.includes(categories);
							}
						});
					}
					// console.log(responseData, complexity);
					setData(responseData);
				});
				// .catch((error) => console.log(error));
			});
		// return setFinalSearchParameters({});
	}, [complexity, requiredTime, categories, currentPage]);
	let resultComponent = (
		<div className='no-result'>
			<p>
				No projects with current filter <br />
				Try other filter combinations.
			</p>
		</div>
	);
	// if(!data.length) {
	// 	setCurrentPage(prevState => {
	// 		retutn
	// 	})
	// }
	if (data.length) {
		resultComponent = data.map((element, index) => {
			return <Card loading={loading} data={element} key={index} />;
		});
	}
	return (
		<>
			<div className='search-results'>
				{loading ? (
					<Loading />
				) : (
					<>
						{resultComponent}
						{showPagination ? (
							<Pagination
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
								setLoading={setLoading}
							/>
						) : null}
					</>
				)}
			</div>
		</>
	);
}

export default SearchResults;
