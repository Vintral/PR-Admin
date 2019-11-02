import React from 'react';
import { CSSTransition } from 'react-transition-group'
 
export default class Modal extends React.Component {
	//==============================//
	//  Constructor					//
	//==============================//
	constructor( props ) {
		super( props );
		
		this._debug = false;
    this._class = "Modal";
					
		this.state = { headerText:"" };
	}

	//==============================//
	//  Life Cycle					//
	//==============================//
	componentWillReceiveProps( props ) {
		this.debug( "componentWillReceiveProps" );
	}

	componentDidMount() {
		this.debug( "componentDidMount" );
	}

	componentWillUnmount() {
		this.debug( "componentWillUnmount" );
	}

	componentWillUpdate() {
		this.debug( "componentWillUpdate" );
	}

	//==============================//
	//  Renderers					//
	//==============================//
	renderHeader() {
		this.debug( "renderHeader" );
		
		return <div className="modal-header">
			<div className="label">{ this.state.headerText }</div>
			<div className="close" onClick={this.onCancel}>&times;</div>
		</div>
	}
	
	renderContent() {
		this.debug( "renderContent" );
		return null;
	}
	
	render() {		
		this.debug( "render" );			

		return (
			<CSSTransition 
				classNames="modal" 
				in={true} 
				timeout={150}
				appear={true} >
				<div className={ "modal" + ( this._className ? " " + this._className : "" )}>
					{this.renderHeader()}
					{this.renderContent()}
				</div>
			</CSSTransition>
		);
	}
	
	//==============================//
	//  Utility Methods				//
	//==============================//
	debug( msg, force, silence ) {
		if( silence ) return;
		if( this._debug || force )
			console.log( this._class + ": " + msg );
	}
}