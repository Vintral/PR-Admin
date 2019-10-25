import React from 'react';
import ReactDOM from 'react-dom';
 
export default class Page extends React.Component {	
	renderContent() {
		console.log( "renderContent" );
		return <h1>Page Content</h1>;
	}
	
	render() {		
		return <div id="page">{this.renderContent()}</div>
	}
}