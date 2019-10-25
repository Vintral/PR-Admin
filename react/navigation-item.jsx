import React from 'react';
 
export default class NavigationMenuItem extends React.Component {
	constructor( props ) {
		super( props );		
		
		this._debug = false;
		this._class = "NavigationMenuItem";
		
		this.label = props.label;
		this.tag = props.tag;

		this.state = { active:false, tag:"", label:"" };
		
		this.onClick = this.onClick.bind( this );
	}	
	
	onClick( e ) {
		this.debug( "Navigation Item: onClick" );
		this.props.onClick( this.label );
	}
	
	renderTag( tag ) {
		if( !tag ) return;
		return <div className="tag">{tag}</div>
	}

	componentWillReceiveProps( props ) {
		this.debug( "componentWillReceiveProps: " + JSON.stringify( props ) );
		this.setState( { active:this.props.active, label:this.props.label, tag:this.props.tag } );
	}

	render() {
		this.debug( "render: " + this.props.label );

		let id = "menu" + this.props.label;
		return <li className={ "menu-item" + ( this.props.active ? " active" : "" ) } key={id} onClick={this.onClick}>
			{this.props.label}
			{this.renderTag( this.props.tag )}
		</li>
	}
	
	debug( msg ) {
		if( this._debug )
			console.log( this._class + ": " + msg );
	}
}