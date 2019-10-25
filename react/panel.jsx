import React from 'react';
import ReactDOM from 'react-dom';
 
import NavigationMenuItem from './navigation-item.jsx';
import { timingSafeEqual } from 'crypto';
 
export default class Panel extends React.Component {
	constructor( props ) {
		super( props );

		this._debug = false;
		this._class = "Panel";
				
		this.state = { items:[], visible: this.props.visible, loaded:false, url:this.props.url };			
		this.type = "generic";			
		
		this.onClick = this.onClick.bind( this );
		this.onAdd = this.onAdd.bind( this );
	}
	
	renderHeader() {
		return <div className="panel header">{this.props.header}{this.props.onAdd ? <button onClick={this.onAdd}>Add</button> : ""}</div>;
	}
	
	renderContent() {
		this.debug( "renderContent" );		
		if( this.props.visible && this.state.items == 0 ) this.getData();
		
		let content = "";		
		if( this.state && this.state.items ) {
			let i = 0;
			content = this.state.items.map( ( item ) => {				
				return this.renderItem( item );
			} );			
		}
				
		return content;
	}
	
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
				self.setState( { items: data, loaded:true } );
			}
		} );		
	}
	
	componentDidMount() {
		this.debug( "componentDidMount" );					
	}
	
	componentWillReceiveProps( props ) {
		this.debug( "componentWillReceiveProps" );			
		if( props.update ) {
			this.getData();
		}
	}

	componentWillUnmount() {
		this.debug( "componentWillUnmount" );
	}
	
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
	
	renderItem( item ) {		
		return <img className="col-lg-2 col-md-3 col-sm-4 col-xd-6" key={item.id} data-id={item.id} src={"/img/" + this.props.imagePath + "/" + item.type + ".png"} onClick={this.onClick} />
	}
	
	render() {
		this.debug( "render" );
		
		let style = this.props.visible ? {"display":"block"} : {"display":"none"};		
		
		return <div className="panel" style={style}>
			{this.renderHeader()}
			<div className="panel content">
				{this.renderContent()}
			</div>
		</div>
	}
	
	debug( msg ) {
		if( this._debug )
			console.log( this._class + ": " + msg );
	}
}