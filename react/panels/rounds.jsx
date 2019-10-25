import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './panel.jsx';
 
export default class RoundsPanel extends Panel {
	constructor( props ) {
		super( props );
		
		this.type = "round";
		this.state = { items:[], url:"rounds", header:"Rounds", class:"RoundsPanel" };
		
		this.onClick = this.onClick.bind( this );
	}
		
	timeUntil( time ) {
		var diff = time - Math.floor( Date.now() / 1000 );

		if( diff < 60 ) return diff + " second" + ( diff != 1 ? "s" : "" );
		if( diff < 3600 ) return Math.floor( diff / 60 ) + " minute" + ( Math.floor( diff / 60 ) != 1 ? "s" : "" );
		if( diff < 86400 ) return Math.floor( diff / 3600 ) + " hour" + ( Math.floor( diff / 3600 ) != 1 ? "s" : "" );

		return Math.floor( diff / 86400 ) + " day" + ( Math.floor( diff / 86400 ) != 1 ? "s" : "" );
	}
	
	renderItem( item ) {		
		return <div className="container col-lg-2 col-md-3 col-sm-4 col-xs-6" key={item.id} style={{paddingBottom:"30px"}} onClick={this.onClick}>
			<div className={"round-item" + ( item.active ? "" : " unavailable" ) } data-id={item.id}>
				<div className="label">Round {item.id}</div>
				<div className="date">{item.active ? this.timeUntil( item.expires ) : "" }</div>
			</div>
		</div>
	}
}