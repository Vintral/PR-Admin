import React from 'react';
import ReactDOM from 'react-dom';
 
export default class CombatModel extends React.Component {
	constructor( props ) {
		super( props );		

		this._debug = false;
		this._class = "CombatModel";
		
		this.state = { unitsLoaded:false, attackingUnits:[], defendingUnits:[], combatResults:"", combatLog:[] };
		
		this.unitData = [];
				
		this.processUnitData = this.processUnitData.bind( this );
		this.processCombat = this.processCombat.bind( this );
		this.addAttackerUnit = this.addAttackerUnit.bind( this );
		this.removeAttackingUnit = this.removeAttackingUnit.bind( this );
		this.addDefenderUnit = this.addDefenderUnit.bind( this );
		this.removeDefendingUnit = this.removeDefendingUnit.bind( this );
	}
	
	getUnits() {
		if( this.state.unitsLoaded ) return;			
		
		var self = this;
		$.ajax( {
			url:"/units",
			type:"get",			
			success:function( data ) {
				data = JSON.parse( data );
				self.processUnitData( data.data );
			}
		} );
	}
		
	addAttackerUnit() {		
		let quantity = parseInt( $( "#attackerQuantity" ).val() );
		let type = $( "#attackerUnits" ).val();
		let found = false;

		if( isNaN( quantity ) || quantity <= 0 ) return;
		
		let units = this.state.attackingUnits;
		for( let i in units ) {
			if( units[ i ].type == type ) {
				found = true;
				units[ i ].quantity += quantity;
				break;
			}
		}

		if( !found ) {
			units.push( { type:type, quantity:quantity } );
		}
				
		this.setState( {attackingUnits:units } );
	}
	
	addDefenderUnit() {
		let quantity = parseInt( $( "#defenderQuantity" ).val() );
		let type = $( "#defenderUnits" ).val();
		let found = false;

		if( isNaN( quantity ) || quantity <= 0 ) return;

		let units = this.state.defendingUnits;
		for( let i in units ) {
			if( units[ i ].type == type ) {
				found = true;
				units[ i ].quantity += quantity;
				break;
			}
		}

		if( !found ) {
			units.push( { type:type, quantity:quantity } );
		}
				
		this.setState( {defendingUnits:units} );
	}
	
	getUnit( type ) {
		for( var i in this.unitData ) {
			if( this.unitData[ i ].type == type ) {
				this.unitData[ i ].power = ( parseFloat( this.unitData[ i ].attack ) + parseFloat( this.unitData[ i ].defense ) ) / ( 1 + ( parseInt( this.unitData[ i ].ranged ) ? 1 : 0 ) );
				this.debug( "Unit Found: " + JSON.stringify( this.unitData[ i ] ) );
				return { name:this.unitData[ i ].name, attack:this.unitData[ i ].attack, defense:this.unitData[ i ].defense, health:this.unitData[ i ].health, power:this.unitData[ i ].power };
			}
		}

		return null;
	}
		
	buildStack( units ) {
		var ret = new Array();

		for( var u in units ) {
			var unit = this.getUnit( units[ u ].type );
			unit.quantity = units[ u ].quantity;
			unit.total = unit.quantity * unit.power;

			var inserted = false;
			for( var i = 0; i < ret.length; i++ ) {
				if( ret[ i ].total < unit.total ) {
					ret.splice( i, 0, unit );
					inserted = true;
					break;
				}
			}

			if( !inserted ) {
				ret.push( unit );
			}
		}

		return ret;
	}
	
	processUnitAttack( attacker, defender, a, d, defense ) {
		var ret = {};

		var damage = Math.ceil( ( Math.random() * attacker.quantity * attacker.attack / 2) + ( attacker.quantity * attacker.attack / 2 ) );
		if( defense ) damage = Math.floor( ( ( 100 - defense ) * 1.0 ) / 100 * damage );

		var killed = Math.floor( damage / defender.health );
		if( killed > defender.quantity ) killed = defender.quantity;

		ret.damage = damage;
		ret.killed = killed;
		ret.message = a + "'s " + attacker.quantity + " " + attacker.name + " did " + damage + " damage to " + d + "'s " + defender.quantity + " " + defender.name + " killing " + killed;

		return ret;
	}
	
	processCombat() {
		let iterations = parseInt( $( "#combatIterations" ).val() );
		let defense = parseFloat( $( "#combatDefensePercent" ).val() );
		
		let attackingUnits = this.state.attackingUnits;
		let defendingUnits = this.state.defendingUnits;
		let unitData = this.unitData;
		
		this.debug( JSON.stringify( unitData ) );
		
		if( !attackingUnits || attackingUnits.length == 0 || !defendingUnits || defendingUnits.length == 0 ) {
			alert( "Missing Army" );
			return;
		}

		for( let i = 0; i < unitData.length; i++ ) {
			unitData[ i ].power = ( unitData[ i ].attack + unitData[ i ].defense ) / ( 1 + unitData[ i ].ranged );
		}

		var wins = 0;
		var defeats = 0;

		var log = [];
		let msg = "";
		let attackerPowerLoss = 0;
		let defenderPowerLoss = 0;
		let shortcircuit = 0;
		let attackerStartingPower = 0;
		let defenderStartingPower = 0;
		
		for( let i = 0; i < iterations; i++ ) {
			msg = "";
			let attackerStack = this.buildStack( attackingUnits );
			let defenderStack = this.buildStack( defendingUnits );
						
			if( attackerStartingPower == 0 ) {
				for( let i in attackerStack ) {			
					attackerStartingPower += attackerStack[ i ].power * attackerStack[ i ].quantity;
				};
			}
			
			if( defenderStartingPower == 0 ) {
				for( let i in defenderStack ) {
					defenderStartingPower += defenderStack[ i ].power * defenderStack[ i ].quantity;
				}
			}

			let processedAttackers = [];
			let processedDefenders = [];

			attackerPowerLoss = 0;
			defenderPowerLoss = 0;

			shortcircuit = 0;
			let unit = "";
			while( attackerStack.length > 0 || defenderStack.length > 0 ) {
				unit = attackerStack.shift();
				if( unit ) {
					processedAttackers.push( unit );
					var defender = defenderStack.length > 0 ? defenderStack[ 0 ] : processedDefenders[ processedDefenders.length - 1 ];
					if( defender ) {						
						var combat = this.processUnitAttack( unit, defender, "Attacker", "Defender", defense );
						if( combat ) {
							defenderPowerLoss += defender.power * combat.killed;
							msg += combat.message + "\n";
							defender.quantity -= combat.killed;
						}
					}
				}

				do{
					unit = defenderStack.shift();
				} while( unit && unit.quantity <= 0 && defenderStack.length != 0 );
				if( unit && unit.quantity > 0 ) {
					processedDefenders.push( unit );
					var defender = processedAttackers[ processedAttackers.length - 1 ];
					var combat = this.processUnitAttack( unit, defender, "Defender", "Attacker", 0 );
					if( combat ) {
						attackerPowerLoss += defender.power * combat.killed;
						msg += combat.message + "\n";
						defender.quantity -= combat.killed;
					}
				}

				shortcircuit++;
				if( shortcircuit > 10 ) break;
			}

			if( ( attackerPowerLoss / attackerStartingPower ) < ( defenderPowerLoss / defenderStartingPower ) ) {
				wins++;
			}
		}			
				
		let results = Math.floor( ( wins * 1.0 / iterations ) * 100 );
		this.setState( {combatResults:results, combatLog:msg} );
	}

	processUnitData( data ) {		
		this.unitData = new Array();

		for( var i in data ) {			
			data[ i ].power = ( parseFloat( data[ i ].attack ) + parseFloat( data[ i ].defense ) ) / ( 1 + ( parseInt( data[ i ].ranged ) ? 1 : 0 ) );
			this.debug( "Unit Data: " + JSON.stringify( data[ i ] ) );
			this.unitData.push( data[ i ] );
		}
		
		this.setState( { unitsLoaded:true} );
	}
	
	removeAttackingUnit( i ) {
		i = i.target.dataset.id;
		this.debug( "removeAttackingUnit: " + i );
				
		let units = this.state.attackingUnits;
		units.splice( i, 1 );
		this.setState( {attackingUnits:units} );
	}
	
	removeDefendingUnit( i ) {
		i = i.target.dataset.id;
		this.debug( "removeDefendingUnit: " + i );
				
		let units = this.state.defendingUnits;
		units.splice( i, 1 );
		this.setState( {defendingUnits:units} );
	}
	
	render() {		
		if( !this.state.unitsLoaded ) this.getUnits();
		let style = { display: ( this.props.visible ? "inline-block" : "none" ) };
		
		let units = this.unitData.map( ( data ) => {
			return <option value={data.type} key={data.type}>{data.name}</option>;
		} );		
		if( !units ) units = <option value="none" key="none">None</option>
		
		let i = 0;
		let a = this.state.attackingUnits.map( ( data ) => {			
			return <div style={{"marginBottom":"10px", "fontWeight":"bold","fontSize":"18px","marginLeft":"15px","position":"relative"}} key={i++}>
				{data.quantity + " " + data.type}
				<button style={{"position":"absolute", "right":"0", "borderRadius":"5px", "lineHeight":"10px", "padding":"5px"}} onClick={this.removeAttackingUnit} data-id={i}>-</button>
			</div>
		} );
		
		i = 0;
		let defendingUnits = this.state.defendingUnits.map( ( data ) => {			
			return <div style={{"marginBottom":"10px", "fontWeight":"bold","fontSize":"18px","marginLeft":"15px","position":"relative"}} key={i++}>
				{data.quantity + " " + data.type}
				<button style={{"position":"absolute", "right":"0", "borderRadius":"5px", "lineHeight":"10px", "padding":"5px"}} onClick={this.removeDefendingUnit} data-id={i}>-</button>
			</div>		
		} );
		
		return <div className="models" style={style}>
			<div className="model-explore-section col-lg-2 col-md-12">
				<div className="model-details">
					<div className="model-header">Attacker</div>
					<div id="attackerUnitList">{a}</div>
					<input type="text" id="attackerQuantity" style={ { "width":"31%","display":"inline-block", "marginRight":"2%" } } />
					<select id="attackerUnits" style={ {"padding":"6px","width":"31%", "marginRight":"2%"}}>
						{units}
					</select>
					<button onClick={this.addAttackerUnit} style={ {"width":"33%"} }>Add</button>
				</div>
			</div>
			<div className="model-explore-section col-lg-2 col-md-12">
				<div className="model-details">
					<div className="model-header">Defender</div>
					<div id="defenderUnitList">{defendingUnits}</div>
					<input type="text" id="defenderQuantity" style={ {"width":"31%","display":"inline-block", "marginRight":"2%" } } />
					<select id="defenderUnits" style={ {"padding":"6px","width":"31%", "marginRight":"2%"} }>
						{units}
					</select>
					<button onClick={this.addDefenderUnit} style={ { "width":"33%" } }>Add</button>
				</div>
			</div>
			<div className="model-explore-section col-lg-2 col-md-12">
				<div className="model-details">
					<div className="model-header">Stats</div>
					<input type="text" placeholder="Defense %" id="combatDefensePercent" />
					<input type="text" placeholder="Iterations" id="combatIterations" />
					<button onClick={this.processCombat} style={ {"width":"100%"} }>Process</button>
				</div>
			</div>
			<div className="model-explore-section col-lg-4 col-md-12">
				<div className="model-details">
					<div className="model-header">Log</div>
					<div id="attackLog">{this.state.combatLog}</div>
				</div>
			</div>
			<div className="model-explore-section col-lg-2 col-md-12">
				<div className="model-details">
					<div className="model-header">Results</div>
					<div id="combatResults">{this.state.combatResults}%</div>
				</div>
			</div>
		</div>
	}
	
	debug( msg ) {
		if( this._debug )
			console.log( this._class + ": " + msg );
	}
}