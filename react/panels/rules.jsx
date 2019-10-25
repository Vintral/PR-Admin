import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './panel.jsx';
 
export default class RulesPanel extends Panel {	
	constructor( props ) {
		super( props );
		
		this._debug = true;
		this._class = "RulesPanel";
		
		this.type = "rule";
		this.state = { items:[], url:"rules", header:"Rules", class:"RulesPanel" };
		
		this.onClick = this.onClick.bind( this );
	}
	
	getData() {
		this.debug( "getData" );		
		
		const self = this;
		$.ajax( {
			url:"/" + this.state.url,
			type:"get",
			error:function( err ) {
				console.log( err );
				//window.location.replace( "login" );
			},
			success:function( data ) {
				data = JSON.parse( data );
				data = data.data;
				
				data.map( ( rule ) => {
					rule.rule = atob( rule.rule );
				} );
				self.setState( { items: data, loaded:true } );
			}
		} );		
	}
	
	renderItem( item ) {		
		return <div className="container col-lg-3 col-md-4 col-sm-6 col-xs-12" key={item.id} style={{paddingBottom:"30px"}} onClick={this.onClick}>
			<div className={"rules-item"} data-id={item.id}>
				<span className="position">{item.position}</span>
				<span className="rule">{item.rule}</span>
			</div>
		</div>
	}
}