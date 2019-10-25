import React from 'react';
import { CSSTransition } from 'react-transition-group'
 
export default class Details extends React.Component {
	//==============================//
	//  Constructor					//
	//==============================//
	constructor( props ) {
		super( props );
		
		this._debug = false;
		this._class = "Details";
					
		this.state = { type:"", item:"", open:!this.props.closing, className:"details" };
		
		this.onClick = this.onClick.bind( this );
		this.handleChange = this.handleChange.bind( this );
	}

	//==============================//
	//  Life Cycle					//
	//==============================//
	componentWillReceiveProps( props ) {
		this.debug( "componentWillReceiveProps" );			
		
		if( props.className == "details" ) {
			this.setState( { item:"", data:"" } );
		}
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
	//  Event Handlers				//
	//==============================//
	onClick( e ) {
		this.debug( "onClick" );		
				
		this.setState( {open:false} );
		
		var self = this;
		setTimeout( function() {
			if( self.props.onClose )
				self.props.onClose();
		}, 500 );
	}

	handleChange( e ) {
		this.debug( "handleChange" );
	}	

	//==============================//
	//  Methods						//
	//==============================//
	getData() {
		if( !this.props.type || !this.props.item ) return;
				
		var self = this;
		self.retrieveType = this.props.type;
		self.retrieveItem = this.props.item;
		
		$.ajax( {
			url:url,
			type:"get",
			success:function( data ) {
				console.log( "Have data" );
				console.log( data );
				
				self.setState( { type:self.retrieveType, item:self.retrieveItem, data:data } );
				
				self.retrieveType = "";
				self.retrieveItem = "";
				//self.setState( { item: } );
			}
		} );
	}

	//==============================//
	//  Renderers					//
	//==============================//
	renderHeader() {
		this.debug( "renderHeader" );
		
		return <div className="details-header">
			{ this.props.item ? 
				( this.props.item === "add" ? "New" : "Edit" )
			: "---" }
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
				classNames="detail" 
				in={true} 
				timeout={150}
				appear={true}
				onExit={ ( e ) => console.log( "onExit" ) }
				onExiting={ ( e ) => console.log( "onExiting" ) }
				onExited={ ( e ) => console.log( "onExited" ) }
				>
				<div className="detail">
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