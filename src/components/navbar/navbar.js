import React from "react";
import _ from "lodash";

import properties from "../../assets/properties.json";
import monk from "../../assets/images/monk.png";
import { useThemeContext } from '../../theme-context';
import "./navbar.scss";

const NavBar = () => {
	const { theme='light', handleToggleTheme } = useThemeContext();

	React.useEffect(() => {
		document.body?.classList.toggle('rf-monk-dark', theme === 'dark');
		document.body?.classList.toggle('rf-monk-light', theme === 'light');
	}, [theme])

	const toggleButton = (<button type="button" className="rf-monk-theme-button" onClick={handleToggleTheme}>
		 {theme === 'light' ? <span title="dark theme">&#127761;</span> : <span title="light theme">&#127765;</span>} 
	</button>)

	return (
		<div>
			<nav className="row navbar">
				<img alt="monk" src={monk} />
				<h1 className="title">{_.get(properties, "navTitle")}</h1>
				{toggleButton}
			</nav>
		</div>

	);
};

export default NavBar;
