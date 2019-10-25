import React from 'react';
import ReactDOM from 'react-dom';

import Details from './details.jsx';
 
export default class BuildingDetails extends Details {
	constructor( props ) {
		super( props );
		
		this._debug = false;
		this._class = "BuildingDetails"
				
		this.state = { data:"", item:this.props.item, loaded:false };
		
		this.handleSubmit = this.handleSubmit.bind( this );
	}	
	
	getData() {
		this.debug( "getData" );			
		
		if( this.props.item ) {
			this.debug( "URL: /buildings/" + this.props.item );
			var self = this;
			$.ajax( {
				url:"/buildings/" + this.props.item,
				type:"get",
				dataType: 'json',
				success:function( data ) {
					console.log( data );
					data.points = data.labor;
					data.position = data.display_position;
					self.setState( {item:self.props.item, data:data, loaded:true } );				
				}
			} );
		}
	}	
	
	componentDidMount() {
		this.debug( "componentDidMount" );
	}

	handleChange( e ) {
		let name = document.getElementById( "name" ).value;
		let plural = document.getElementById( "plural" ).value;
		let position = document.getElementById( "position" ).value;
		let wood = document.getElementById( "wood" ).value;
		let stone = document.getElementById( "stone" ).value;
		let points = document.getElementById( "points" ).value;
		let field = document.getElementById( "field" ).value;
		let bonus = document.getElementById( "bonus" ).value;
		let available = document.getElementById( "available" ).checked;
		
		var data = JSON.parse( JSON.stringify( this.state.data ) );		
		data.name = name;
		data.plural = plural;
		data.position = position;
		data.wood = wood;
		data.stone = stone;
		data.points = points;
		data.field = field;
		data.bonus = bonus;
		data.available = available;
		
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
		packet.name = this.state.data.name;
		packet.plural = this.state.data.plural;
		packet.displayPosition = this.state.data.position;
		packet.wood = this.state.data.wood;
		packet.stone = this.state.data.stone;
		packet.points = this.state.data.points;

		packet.field = this.state.data.field;
		packet.bonus = this.state.data.bonus;
		packet.available = this.state.data.available;		
				
		let self = this;
		$.ajax( {
			url: '/buildings/update/' + this.state.data.id,
			type: 'POST',
			data: JSON.stringify( packet ),
			contentType: 'application/json',
			success: function( data ) {
				self.props.onClose();
			},
		} );
	}
	
	renderContent() {
		this.debug( "renderContent" );
				
		if( this.props.item != this.state.item ) {			
			this.getData();
			return null;
		}
				
		let data = this.state.data ? this.state.data : {};			
		if( !data.name ) return "";
		
		return <div className="details-content">			
			<form onSubmit={this.handleSubmit}>
				Name: <input type="text" id="name" value={data.name} onChange={this.handleChange} />
				Plural: <input type="text" id="plural" value={data.plural} onChange={this.handleChange} />
				Display Position: <input type="text" id="position" value={data.position} onChange={this.handleChange} />
				Wood: <input type="text" id="wood" value={data.wood} onChange={this.handleChange} />
				Stone: <input type="text" id="stone" value={data.stone} onChange={this.handleChange} />
				Build Points: <input type="text" id="points" value={data.points} onChange={this.handleChange} />
				Field: <input type="text" id="field" value={data.field} onChange={this.handleChange} /><br />
				Bonus: <input type="text" id="bonus" value={data.bonus} onChange={this.handleChange} /><br />
				Available: <input type="checkbox" id="available" checked={data.available} onChange={this.handleChange} /><br />
				<button type="submit">Save</button>
			</form>			
		</div>
	}	
}