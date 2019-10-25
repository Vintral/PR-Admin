import React from 'react';
import ReactDOM from 'react-dom';

import Details from './details.jsx';
 
export default class NewsDetails extends Details {
	constructor( props ) {
		super( props );
		
		this._debug = false;
		this._class = "NewsDetails"
				
		this.state = { data:"", item:this.props.item, loaded:false };
		
		this.handleSubmit = this.handleSubmit.bind( this );
		this.handleDelete = this.handleDelete.bind( this );
	}	
	
	getData() {
		this.debug( "getData" );			
		
		if( this.props.item ) {
			let url = "/news/" + this.props.item;
			this.debug( "URL: " + url );
			var self = this;
			$.ajax( {
				url:url,
				type:"get",
				dataType: 'json',
				success:function( data ) {
					data.title = atob( data.title )
					data.body = atob( data.body );					
					self.setState( {item:self.props.item, data:data, loaded:true } );				
				}
			} );
		}
	}	
	
	componentDidMount() {
		this.debug( "componentDidMount" );
	}


	handleChange( e ) {
		let title = document.getElementById( "title" ).value;
		let body = document.getElementById( "body" ).value;		
		
		var data = JSON.parse( JSON.stringify( this.state.data ) );		
		data.body = body;
		data.title = title;
		
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
		packet.body = btoa( this.state.data.body );
		packet.title = btoa( this.state.data.title );

		let self = this;
		$.ajax( {
			url: '/news/update/' + this.state.data.id,
			type: 'POST',
			data: JSON.stringify( packet ),
			contentType: 'application/json',
			success: function( data ) {
				self.props.onUpdated( "news" );
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
		if( !data.title ) return "";
				
		return <div className="details-content">			
			<form onSubmit={this.handleSubmit}>
				<input type="text" id="title" value={data.title} onChange={this.handleChange} />
				<textarea id="body" value={data.body} onChange={this.handleChange} />				
				<button type="submit">Save</button>&nbsp;<button onClick={this.handleDelete}>Delete</button>
			</form>			
		</div>
	}	
}