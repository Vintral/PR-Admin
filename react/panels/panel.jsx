import React from 'react';
 
export default class Panel extends React.Component {
	//==============================//
	//  Constructor					//
	//==============================//
	constructor( props ) {
		super( props );

		this._debug = false;
		this._class = "Panel";
		
		this.type = "generic";			
		
		this.onClick = this.onClick.bind( this );
		this.onAdd = this.onAdd.bind( this );
	}

	//==============================//
	//  Life Cycle					//
	//==============================//
	componentDidMount() {
		this.debug( "componentDidMount" );					
	}

	componentWillMount() {
		this.debug( "componentWillMount" );

		if( ( this.state.items && this.state.items.length === 0 ) || this.state.refresh )
			this.getData();
	}
	
	componentWillReceiveProps( props ) {
		this.debug( "componentWillReceiveProps" );
	}

	componentDidUpdate( props, state, snapshot ) {
		this.debug( "componentDidUpdate" );
	}

	componentWillUnmount() {
		this.debug( "componentWillUnmount" );
	}

	componentWillUpdate() {
		this.debug( "componentWillUpdate" );
		console.log( this );
		console.log( this.state );
	}

	//==============================//
	//  Event Handlers				//
	//==============================//
	onAdd( e ) {
		this.debug( "onAdd" );
				
		let obj = { type:this.type };
		console.log( obj );
		
		this.props.onAdd( obj );
	}
	
	onClick( e ) {
		this.debug( "onClick" );
		
		var node = e.target;
		
		if( !node.dataset.id ) {
			while( node ) {
				node = node.parentNode;
				
				if( !node || ( node.dataset && node.dataset.id ) ) break;
			} 
		}
		
		console.log( node );		
		if( !node || !node.dataset || !node.dataset.id ) return;		
		
		var obj = { id:node.dataset.id, type:this.type };
		console.log( obj );
		
		this.props.onItem( obj );
	}

	//==============================//
	//  Methods						//
	//==============================//
	getData() {
		this.debug( "getData" );		
		
		const self = this;
		$.ajax( {
			url:"/" + this.state.url,
			type:"get",
			error:function( err ) {
				console.log( err );
				//window.location.replace( "login" );
			},
			success:function( data ) {
				data = JSON.parse( data );
				data = data.data;			
				self.setState( { items: data } );
			}
		} );		
	}

	//==============================//
	//  Renderers					//
	//==============================//
	renderHeader() {
		this.debug( "renderHeader" );
		return <div className="panel header">{this.state.header}{this.props.onAdd ? <button onClick={this.onAdd}>Add</button> : ""}</div>;
	}
	
	renderContent() {
		this.debug( "renderContent" );
		
		let content = "";		
		if( this.state && this.state.items ) {
			let i = 0;
			content = this.state.items.map( ( item ) => {				
				return this.renderItem( item );
			} );			
		}
				
		return content;
	}

	renderItem( item ) {		
		return <img className="col-lg-2 col-md-3 col-sm-4 col-xd-6" key={item.id} data-id={item.id} src={"/img/" + this.state.imagePath + "/" + item.type + ".png"} onClick={this.onClick} />
	}
	
	render() {
		this.debug( "render" );
		
		return <div className="panel">
			{this.renderHeader()}
			<div className="panel content">
				{this.renderContent()}
			</div>
		</div>
	}
	
	//==============================//
	//  Utility						//
	//==============================//
	timeSince( time ) {
		var diff = Math.floor( Date.now() / 1000 ) - time;

		if( diff < 60 ) return diff + " second" + ( diff != 1 ? "s" : "" );
		if( diff < 3600 ) return Math.floor( diff / 60 ) + " minute" + ( Math.floor( diff / 60 ) != 1 ? "s" : "" );
		if( diff < 86400 ) return Math.floor( diff / 3600 ) + " hour" + ( Math.floor( diff / 3600 ) != 1 ? "s" : "" );

		return Math.floor( diff / 86400 ) + " day" + ( Math.floor( diff / 86400 ) != 1 ? "s" : "" );
	}
	
	debug( msg, force, silence ) {
		if( silence ) return;
		if( this._debug || force )
			console.log( this.state.class + ": " + msg );
	}
}