import React from 'react';
import ReactDOM from 'react-dom';

import Hello from './hello.jsx';
import NavigationMenuItem from './navigation-item.jsx';
 
export default class NavigationMenu extends React.Component {
	constructor( props ) {
		super( props );
		
		this._debug = false;
		this._class = "NavigationMenu";
		
		this.state = { active:"Stats" };			
	}
	
	componentDidMount() {
		this.debug( JSON.stringify( this.props ) );
		this.getData();

		this.onClick = this.onClick.bind( this );
	}

	componentWillReceiveProps( props ) {
		this.debug( "componentWillReceiveProps: " + JSON.stringify( props ) );
		if( props.update ) this.getData();
	}

	componentDidUpdate() {
		this.debug( "componentDidUpdate" );
	}
  
	onClick( e ) {
		this.debug( "onClick" );
		
		this.setState( {active:e} );
		this.props.onChanged( e );
	}

	getData() {
		this.debug( "getData" );

		const self = this;
		$.ajax( {
			url:"/menu",
			type:"get",
			error:function( err ) {
				window.location.replace( "login" );
			},
			success:function( data ) {
				data = JSON.parse( data );				
				self.setState( { options: data } );
				self.props.onMenuUpdated();
			}
		} );
	}
  
	render() {
		this.debug( "render" );

		let menu = "";
		if( this.state && this.state.options ) {
			let i = 0;
			menu = this.state.options.map( ( label ) =>
				<NavigationMenuItem key={i++} label={label.name} onClick={this.onClick} active={this.state.active == label.name} tag={label.tag} />
			);
		}
		
		return (
      <div className="navigation">
        <ul id="menu" className="menu">				
          {menu}
        </ul>
        <a href="/logout" className="logout">Logout</a>
      </div>
		)
	}
	
	debug( msg ) {
		if( this._debug )
			console.log( this._class + ": " + msg );
	}
}