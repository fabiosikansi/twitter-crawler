import React, {Component} from 'react';
import {render} from 'react-dom';

export default class Menu extends React.Component {
	render() {
		return (
			<nav className="navbar navbar-dark navbar-fixed-top bg-inverse">
				<div className="container">
					<a className="navbar-brand" href="#">Twitter Crawler</a>
					<div id="navbar">
						<nav className="nav navbar-nav float-xs-left">
							<a className="nav-item nav-link" href="#">Dashboard</a>
						</nav>
					</div>
				</div>
			</nav>
		);
	}
}
