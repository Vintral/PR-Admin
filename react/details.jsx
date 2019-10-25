import React from 'react';
import ReactDOM from 'react-dom';
 
export default class Details extends React.Component {	
	componentDidMount() {
		this._debug = true;
		this.debug( "componentDidMount" );
	}

	render() {		
		return <div className="details">
			Details
		</div>
	}

	debug( msg, force, silence ) {
		if( silence ) return;
		if( this._debug || force )
			console.log( "Details: " + msg );
	}
}