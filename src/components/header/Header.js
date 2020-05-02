import React from "react";
import "./Header.css";
function handleClick() {
	window.location.reload();
}
function Header() {
	return (
		<div className='container1'>
			<h3 className='logo' onClick={handleClick}>
				Your Next
				<br /> Open Source
			</h3>
			<div className='authentication'>
				<button>Sign in</button>
				<button>Sign up</button>
			</div>
		</div>
	);
}

export default Header;
