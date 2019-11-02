import React from 'react';
import Modal from './modal.jsx';
 
export default class RoundModal extends Modal {
	//==============================//
	//  Constructor					        //
	//==============================//
	constructor( props ) {
		super( props );
		
		this._debug = true;
    this._class = "RoundModal";
    
    this._className = "";
        
    this.state = { headerText:!props.roundID ? "Add Round" : "View Round" };
    
    this.onCreate = this.onCreate.bind( this );
    this.onCancel = this.onCancel.bind( this );
	}

	//==============================//
	//  Event Handlers				      //
	//==============================//
	handleChange( e ) {
		let name = document.getElementById( "username" ).value;
				
		var data = JSON.parse( JSON.stringify( this.state.data ) );		
		data.name = name;
		
		//this.setState( {data:data} );
  }  
  
  onCreate( e ) {
    this.debug( "onCreate" );
    this.debug( "PROCESS BAN" );

    const energyRegen = parseInt( document.getElementById( "energy-regen" ).value );
    const energyMax = parseInt( document.getElementById( "energy-max" ).value );
    const land = parseInt( document.getElementById( "land" ).value );
    const gold = parseInt( document.getElementById( "gold" ).value );
    const food = parseInt( document.getElementById( "food" ).value );
    const wood = parseInt( document.getElementById( "wood" ).value );
    const stone = parseInt( document.getElementById( "stone" ).value );
    const metal = parseInt( document.getElementById( "metal" ).value );
    const length = parseInt( document.getElementById( "length" ).value );
    const recurring = document.getElementById( "recurring" ).checked;

    console.log( "Energy: " + energyRegen + "/" + energyMax );
    console.log( "Land: " + land + "  Gold: " + gold + " Food: " + food + " Wood: " + wood + " Stone: " + stone + " Metal: " + metal );
    console.log( "Length: " + length );
    console.log( "Recurring: " + recurring );

    /*const reason = document.getElementById( "ban-reason" ).value;
    const amount = document.getElementById( "ban-amount" ).value;
    const unit = document.getElementById( "ban-unit" ).value;

    if( !reason ) return alert( "Missing Reason" );
    if( !amount && unit !== "permanent" ) return alert( "Missing Duration" );
    if( amount <= 0 && unit !== "permanent" ) return alert( "Invalid Duration" );

    let packet = {};		
    packet.reason = btoa( reason );
        packet.amount = amount;
        packet.unit = btoa( unit );

    let self = this;
    $.ajax( {
      url: '/ban/' + this.state.userid,
      type: 'POST',
      data: JSON.stringify( packet ),
      contentType: 'application/json',
      success: function( data ) {
        self.props.closeModal();
            },
            error: function( err ) {
                alert( "Error Banning User" );
            }
    } );*/
  }

  onCancel( e ) {
    console.log( this );
    this.debug( "onCancel" );
    this.props.closeModal();
  }
	
	//==============================//
	//  Renderers					          //
	//==============================//
  renderContent() {
    super.renderContent();

    return (
      <div className="modal-content-area" style={{display:"flex", flexDirection:"column"}}>        
        <input type="text" id="energy-regen" placeholder="Energy Regen" />
        <input type="text" id="energy-max" placeholder="Energy Max" />
        <input type="text" id="land" placeholder="Land" />
        <input type="text" id="gold" placeholder="Gold" />
        <input type="text" id="wood" placeholder="Wood" />
        <input type="text" id="stone" placeholder="Stone" />
        <input type="text" id="food" placeholder="Food" />
        <input type="text" id="metal" placeholder="Metal" />
        <input type="text" id="length" placeholder="Duration" />
        <input type="checkbox" id="recurring" />
        <div className="buttons">
            <div className="button" onClick={this.onCreate}>CREATE</div><div className="button" onClick={this.onCancel}>Cancel</div>
        </div>
      </div>
    );
  }
}