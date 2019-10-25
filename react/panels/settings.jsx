import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './panel.jsx';
 
export default class SettingsPanel extends Panel {	
	constructor( props ) {
		super( props );
		
		this.type = "settings";
		this.state = { items:[], url:"settings", header:"Settings", class:"SettingsPanel" };
		
		this.onClick = this.onClick.bind( this );
	}

	onClick( e ) {
		var node = e.target;
		
		while( node && !node.dataset.id ) {
			node = node.parentNode;
		}
		
		if( !node ) return;		
		let self = this;
		const packet = { setting:node.dataset.type, value:( node.dataset.value == 0 ? 1 : 0 ) }
		$.ajax( {
			url: '/settings/update',
			type: 'POST',
			data: JSON.stringify( packet ),
			contentType: 'application/json',
			success: function( data ) {
				self.getData();
			}
		} );
	}
	
	renderItem( item ) {		
		return <div className={ "data-display col-lg-2 col-md-3 col-sm-6 col-xs-12 setting" + ( item.value == 0 ? " disabled" : "" ) } key={item.id} style={{paddingBottom:"30px"}} onClick={this.onClick}>
			<div className="inner-data" data-id={item.id} data-type={item.type} data-value={item.value}>
				<span>{item.type}</span>
			</div>
		</div>
	}	
}