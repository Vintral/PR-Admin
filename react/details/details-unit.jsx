import React from 'react';
import ReactDOM from 'react-dom';

import Details from './details.jsx';
 
export default class UnitDetails extends Details {
	constructor( props ) {
		super( props );
		
		this._debug = false;
		this._class = "UnitDetails"
				
		this.state = { data:"", item:this.props.item, loaded:false };
		
		this.handleSubmit = this.handleSubmit.bind( this );
	}	
	
	getData() {
		this.debug( "getData" );			
		
		if( this.props.item ) {
			this.debug( "URL: /units/" + this.props.item );
			var self = this;
			$.ajax( {
				url:"/units/" + this.props.item,
				type:"get",
				dataType: 'json',
				success:function( data ) {
					console.log( "Have data" );
					console.log( data );
					
					data.position = data.display_position;
					data.costGold = data.cost.gold;
					data.costPoints = data.cost.recruit;
					data.upkeepGold = data.upkeep.gold;
					data.upkeepFood = data.upkeep.food;
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
		let attack = document.getElementById( "attack" ).value;
		let defense = document.getElementById( "defense" ).value;
		let health = document.getElementById( "health" ).value;
		let ranged = document.getElementById( "ranged" ).checked;
		let recruitable = document.getElementById( "recruitable" ).checked;
		let available = document.getElementById( "available" ).checked;
		let costGold = document.getElementById( "costGold" ).value;
		let costPoints = document.getElementById( "costPoints" ).value;
		let upkeepGold = document.getElementById( "upkeepGold" ).value;
		let upkeepFood = document.getElementById( "upkeepFood" ).value;					
		
		var data = JSON.parse( JSON.stringify( this.state.data ) );		
		data.name = name;
		data.plural = plural;
		data.position = position;
		data.attack = attack;
		data.defense = defense;
		data.health = health;
		data.ranged = ranged;
		data.recruitable = recruitable;
		data.available = available;
		data.costGold = costGold;
		data.costPoints = costPoints;
		data.upkeepGold = upkeepGold;
		data.upkeepFood = upkeepFood;
		
		this.setState( {data:data} );
	}
	
	renderHeader() {
		this.debug( "renderHeader" );
		return super.renderHeader();
	}
	
	handleSubmit( $evt ) {
		this.debug( "handleSubmit" );		
		$evt.preventDefault();
		
		console.log( this.state.data );
		
		var packet = {};		
		packet.name = this.state.data.name;
		packet.plural = this.state.data.plural;
		packet.displayPosition = this.state.data.position;
		packet.attack = this.state.data.attack;
		packet.defense = this.state.data.defense;
		packet.health = this.state.data.health;

		packet.ranged = this.state.data.ranged;
		packet.recruitable = this.state.data.recruitable;
		packet.available = this.state.data.available;
		
		packet.costGold = this.state.data.costGold;
		packet.costPoints = this.state.data.costPoints;
		
		packet.upkeepFood = this.state.data.upkeepFood;
		packet.upkeepGold = this.state.data.upkeepGold;			
			
		let self = this;
		$.ajax( {
			url: '/units/update/' + this.state.data.id,
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
				
		this.debug( this.props.item + " -- " + this.state.item );
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
				Attack: <input type="text" id="attack" value={data.attack} onChange={this.handleChange} />
				Defense: <input type="text" id="defense" value={data.defense} onChange={this.handleChange} />
				Health: <input type="text" id="health" value={data.health} onChange={this.handleChange} />
				Ranged: <input type="checkbox" id="ranged" checked={data.ranged} onChange={this.handleChange} /><br />
				Recruitable: <input type="checkbox" id="recruitable" checked={data.recruitable} onChange={this.handleChange} /><br />
				Available: <input type="checkbox" id="available" checked={data.available} onChange={this.handleChange} /><br />
				
				<strong>Costs</strong><br />
				<hr />
				Gold: <input type="text" id="costGold" value={data.costGold} onChange={this.handleChange} />
				Recruit Points: <input type="text" id="costPoints" value={data.costPoints} onChange={this.handleChange} />
				
				<strong>Upkeep</strong><br />
				<hr />
				Gold: <input type="text" id="upkeepGold" value={data.upkeepGold} onChange={this.handleChange} />
				Food: <input type="text" id="upkeepFood" value={data.upkeepFood} onChange={this.handleChange} />
				
				
				<button type="submit">Save</button>
			</form>			
		</div>
	}	
}