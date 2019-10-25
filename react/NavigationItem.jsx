import React from 'react';
import ReactDOM from 'react-dom';
 
export default class NavigationMenuItem extends React.Component {
	constructor( props ) {
		super( props );
		console.log( props );
	}
	
	componentDidMount() {
		console.log( "Did Mount" );
	}
  
	componentWillUnmount() {
		console.log( "Will Unmount" );
	}
	
	render() {
		console.log( "Render" );
		return <h5>Menu Item</h5>
	}
}