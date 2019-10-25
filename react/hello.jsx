import React from 'react';
import ReactDOM from 'react-dom';
 
export default class Hello extends React.Component {	
	render() {
		console.log( "render Hello" );
		return <span>{this.props.label}</span>
	}
}

//ReactDOM.render( <Hello/>, document.getElementById( "hello" ) );