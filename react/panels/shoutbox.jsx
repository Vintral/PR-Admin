import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './panel.jsx';
 
export default class ShoutboxPanel extends Panel {	
	constructor( props ) {
		super( props );
		
		this.type = "shout";
		this.timer = "";

		this.state = { items:[], url:"shouts/0", header:"Shoutbox", class:"ShoutboxPanel" };
		
		this.onClick = this.onClick.bind( this );
		this.onTick = this.onTick.bind( this );
	}		
	
	refresh() {
		this.getData();
	}

	startTimer() {
		if( this.timer ) clearInterval( this.timer );
		this.timer = setInterval( this.onTick, 1000 )
	}
	
	stopTimer() {
		if( this.timer ) clearInterval( this.timer );
	}
	
	onTick() {
		this.refresh();
	}
	
	timeSince( time ) {
		var diff = Math.floor( Date.now() / 1000 ) - time;

		if( diff < 60 ) return diff + " second" + ( diff != 1 ? "s" : "" );
		if( diff < 3600 ) return Math.floor( diff / 60 ) + " minute" + ( Math.floor( diff / 60 ) != 1 ? "s" : "" );
		if( diff < 86400 ) return Math.floor( diff / 3600 ) + " hour" + ( Math.floor( diff / 3600 ) != 1 ? "s" : "" );

		return Math.floor( diff / 86400 ) + " day" + ( Math.floor( diff / 86400 ) != 1 ? "s" : "" );
	}			
			
	renderItem( item ) {		
		return <div className="container col-xs-12" key={item.id}>
			<div className="shout-container">
				<div className="header-background">&nbsp;</div>
				<img src={"/img/avatars/" + item.avatar + ".png"} />
				<div className="username">{item.usermane}</div>
				<div className="time">{this.timeSince( item.time )} ago</div>
				<div className="shout">{atob( item.shout )}</div>
			</div>
		</div>
	}
	
	render() {
		if( this.props.visible ) this.startTimer();
		else this.stopTimer();
		
		return super.render();			
	}
}