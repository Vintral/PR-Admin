import React from 'react';
import ReactDOM from 'react-dom';

import Details from './details.jsx';
 
export default class ItemDetails extends Details {
	constructor( props ) {
		super( props );
		
		this._debug = false;
		this._class = "ItemDetails"
				
		this.state = { data:"", item:this.props.item, loaded:false };
		
		this.handleSubmit = this.handleSubmit.bind( this );
		this.handleDelete = this.handleDelete.bind( this );
	}	
	
	getData( $item ) {
		this.debug( "getData: " + $item );
		
		if( $item ) {			
			if( $item === "add" ) {
				let data = {};
				data.loaded = true;
				data.name = "";
				data.type = "";				
				data.description = "";
				data.level = "";
				data.effect = "";
				data.onUse = "";
				data.available = false;
								
				this.setState( {item:"add", data:data } );
			} else {
				this.debug( "URL: /item/" + $item );
				var self = this;
				$.ajax( {
					url:"/item/" + $item,
					type:"get",
					dataType: 'json',
					success:function( data ) {						
						data.loaded = true;
						console.log( data );
						self.setState( {item:$item, data:data, loaded:true } );				
					}
				} );
			}
		}
	}	
	
	componentDidMount() {
		this.debug( "componentDidMount" );
	}


	handleChange( e ) {
		let name = document.getElementById( "name" ).value;	
		let type = document.getElementById( "type" ).value;
		let description = document.getElementById( "description" ).value;
		let effect = document.getElementById( "effect" ).value;
		let onUse = document.getElementById( "onUse" ).value;
		let level = document.getElementById( "level" ).value;
		let available = document.getElementById( "available" ).checked;
		
		var data = JSON.parse( JSON.stringify( this.state.data ) );			
		data.name = name;
		data.type = type;
		data.loaded = "true";
		data.level = level;
		data.description = description;
		data.effect = effect;
		data.onUse = onUse;
		data.available = available;
		
		this.setState( {data:data} );
	}
	
	renderHeader() {
		this.debug( "renderHeader" );
		return super.renderHeader();
	}
	
	handleDelete( $evt ) {
		this.debug( "handleDelete" );
		$evt.preventDefault();
		
		let self = this;
		$.ajax( {
			url: '/item/' + this.state.data.id + '/delete',
			type: 'POST',			
			contentType: 'application/json',
			success: function( data ) {
				self.props.onUpdated( "items" );
				self.props.onClose();
			},
		} );
	}
	
	handleSubmit( $evt ) {
		this.debug( "handleSubmit" );		
		$evt.preventDefault();			
		
		console.log( $evt );
		
		var packet = {};		
		packet.name = this.state.data.name;
		packet.type = this.state.data.type;
		packet.description = this.state.data.description;
		packet.effect = this.state.data.effect;
		packet.level = this.state.data.level;
		packet.onUse = btoa( this.state.data.onUse );
		packet.available = this.state.data.available;
		
		console.log( packet );

		let self = this;
		$.ajax( {
			url: this.state.item === "add" ? '/item/add' : '/item/' + this.state.data.id + '/update',
			type: 'POST',
			data: JSON.stringify( packet ),
			contentType: 'application/json',
			success: function( data ) {
				if( self.state.item === "add" )
					self.props.onUpdated( "items" );
				self.props.onClose();
			},
		} );
	}
	
	componentWillReceiveProps( $props ) {
		this.debug( "componentWillReceiveProps" );
		console.log( $props );
		
		if( $props.item != this.state.item ) {			
			this.getData( $props.item );			
			return null;
		}
	}
	
	renderContent() {
		this.debug( "renderContent" );	
		
		let data = this.state.data ? this.state.data : {};		
		if( !data.loaded ) return "";
		
		return <div className="details-content">			
			<form onSubmit={this.handleSubmit}>
				Name: <input type="text" id="name" value={data.name} onChange={this.handleChange} />
				Type: <input type="text" id="type" value={data.type} onChange={this.handleChange} />
				Level: <input type="text" id="level" value={data.level} onChange={this.handleChange} />
				Description: <input type="text" id="description" value={data.description} onChange={this.handleChange} />
				Effect: <input type="text" id="effect" value={data.effect} onChange={this.handleChange} />
				onUse: <textarea id="onUse" value={data.onUse} onChange={this.handleChange} />
				Available: <input type="checkbox" id="available" checked={data.available} onChange={this.handleChange} /><br />
				
				<button type="submit">{this.state.item === "add" ? "Add" : "Save"}</button>
				{this.state.item !== "add" ? <button onClick={this.handleDelete}>Delete</button> : ""}
			</form>			
		</div>
	}	
}