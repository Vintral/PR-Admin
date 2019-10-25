import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './panel.jsx';
 
export default class ThemePanel extends Panel {	
	constructor( props ) {
		super( props );
		
		this._debug = true;
		this.type = "theme";
		this.state = { items:[], url:"theme", header:"Theme", class:"ThemePanel" };
		
		this.onClick = this.onClick.bind( this );
	}
			
	colorChanged( e ) {
		var packet = { field:e.target.dataset.field, value:e.target.value };
		$.ajax( {
			url: '/theme/update',
			type: 'POST',
			data: JSON.stringify( packet ),
			contentType: 'application/json',
			success:function() { window.location = window.location; }
		} );		
	}
	
	renderItem( item ) {		
		return <div className="container col-lg-3 col-md-4 col-sm-6 col-xs-12" key={item.id} style={{paddingBottom:"30px"}}>
			<div className={"color-item"} data-id={item.id}>
				<div className="label">{item.label}</div>
				<input type="color" onChange={this.colorChanged} data-field={item.type} value={item.value} />
			</div>
		</div>		
	}	
}