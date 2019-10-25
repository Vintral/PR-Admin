import React from 'react';
import Modal from './modal.jsx';
 
export default class UserBanModal extends Modal {
	//==============================//
	//  Constructor					//
	//==============================//
	constructor( props ) {
		super( props );
		
		this._debug = true;
        this._class = "UserBanModal"
        
        this._className = "modal-ban"
        
		this.state = { headerText:"Ban " + props.username, userid: props.userid };
		
        this.onBan = this.onBan.bind( this );
        this.onCancel = this.onCancel.bind( this );
	}

	//==============================//
	//  Event Handlers				//
	//==============================//
	handleChange( e ) {
		let name = document.getElementById( "username" ).value;
				
		var data = JSON.parse( JSON.stringify( this.state.data ) );		
		data.name = name;
		
		//this.setState( {data:data} );
	}
	
    onBan( e ) {
        this.debug( "onBan" );
        this.debug( "PROCESS BAN" );

        const reason = document.getElementById( "ban-reason" ).value;
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
		} );
    }

    onCancel( e ) {
        console.log( this );
        this.debug( "onCancel" );
        this.props.closeModal();
    }
	
	//==============================//
	//  Renderers					//
	//==============================//
    renderContent() {
        super.renderContent();

        return (
            <div className="modal-content-area">
                <textarea id="ban-reason" placeholder="Reason" />
                <input type="number" id="ban-amount" />
                <select id="ban-unit" defaultValue={"hours"}>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="permanent">Permanent</option>
                </select>
                <div className="buttons">
                    <div className="button" onClick={this.onBan}>BAN</div><div className="button" onClick={this.onCancel}>Cancel</div>
                </div>
            </div>
        );
    }
}