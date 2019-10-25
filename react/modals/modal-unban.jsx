import React from 'react';
import Modal from './modal.jsx';
 
export default class UserUnbanModal extends Modal {
	//==============================//
	//  Constructor					//
	//==============================//
	constructor( props ) {
		super( props );
		
		this._debug = true;
        this._class = "UserUnbanModal"
        
        this._className = "modal-unban"
        
        this.state = { headerText:"Unban", username:props.username, userid: props.userid };
		
        this.onUnban = this.onUnban.bind( this );
        this.onCancel = this.onCancel.bind( this );
	}
	
	//==============================//
	//  Event Handlers  			//
    //==============================//
    onUnban( e ) {
        this.debug( "onUnban" );

		let self = this;
		$.ajax( {
			url: '/unban/' + this.state.userid,
			type: 'POST',
			contentType: 'application/json',
			success: function( data ) {
				self.props.closeModal();
            },
            error: function( err ) {
                alert( "Error Unbanning User" );
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
                <div className="unban-text">{"Unban " + this.state.username + "?"}</div>
                <div className="buttons">
                    <div className="button" onClick={this.onUnban}>UNBAN</div>
                    <div className="button" onClick={this.onCancel}>Cancel</div>
                </div>
            </div>
        );
    }
}