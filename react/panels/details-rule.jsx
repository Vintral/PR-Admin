import React from 'react';
import ReactDOM from 'react-dom';

import Details from './details.jsx';
 
export default class RuleDetails extends Details {
	constructor( props ) {
		super( props );
		
		this._debug = false;
		this._class = "RuleDetails"
				
		this.state = { data:"", item:this.props.item, loaded:false };
		
		this.handleSubmit = this.handleSubmit.bind( this );
		this.handleDelete = this.handleDelete.bind( this );
	}	
	
	getData() {
		this.debug( "getData" );			
		
		if( this.props.item ) {
			let url = "/rules/" + this.props.item;
			this.debug( "URL: " + url );
			var self = this;
			$.ajax( {
				url:url,
				type:"get",
				dataType: 'json',
				success:function( data ) {
					data.rule = atob( data.rule );					
					self.setState( {item:self.props.item, data:data, loaded:true } );				
				}
			} );
		}
	}	
	
	componentDidMount() {
		this.debug( "componentDidMount" );
	}


	handleChange( e ) {
		let rule = document.getElementById( "rule" ).value;
		let position = document.getElementById( "position" ).value;		
		
		var data = JSON.parse( JSON.stringify( this.state.data ) );		
		data.position = position;
		data.rule = rule;
		
		this.setState( {data:data} );
	}
	
	renderHeader() {
		this.debug( "renderHeader" );
		return super.renderHeader();
	}
	
	handleSubmit( $evt ) {
		this.debug( "handleSubmit" );		
		$evt.preventDefault();
		
		var packet = {};		
		packet.rule = btoa( this.state.data.rule );
		packet.position = this.state.data.position;

		let self = this;
		$.ajax( {
			url: '/rules/update/' + this.state.data.id,
			type: 'POST',
			data: JSON.stringify( packet ),
			contentType: 'application/json',
			success: function( data ) {
				self.props.onUpdated( "rules" );
				self.props.onClose();
			},
		} );
	}
	
	handleDelete( $evt ) {
		this.debug( "delete" );
		$evt.preventDefault();
	}
	
	renderContent() {
		this.debug( "renderContent" );
				
		if( this.props.item != this.state.item ) {			
			this.getData();
			return null;
		}
				
		let data = this.state.data ? this.state.data : {};		
		if( !data.rule ) return "";
				
		return <div className="details-content">			
			<form onSubmit={this.handleSubmit}>
				<input type="text" id="position" value={data.position} onChange={this.handleChange} />
				<textarea id="rule" value={data.rule} onChange={this.handleChange} />				
				<button type="submit">Save</button>&nbsp;<button onClick={this.handleDelete}>Delete</button>
			</form>			
		</div>
	}	
}