import React from 'react';
import Panel from './panel.jsx';
 
export default class UsersPanel extends Panel {
	//==============================//
	//  Constructor					//
	//==============================//
	constructor( props ) {
		super( props );
		
		this._debug = true;

		this.type = "user";
		
		this.state = { items:[], url:"users-online", header:"Users", imagePath:"users", type:"online", class:"UsersPanel" };
		
		this.timer = "";
		this.searchTimer = "";
		
		this.onClick = this.onClick.bind( this );
		this.onTick = this.onTick.bind( this );
		this.onTab = this.onTab.bind( this );
		this.onChange = this.onChange.bind( this );

		this.request = "";
	}

	//==============================//
	//  Life Cycle					//
	//==============================//
	componentDidMount() {
		super.componentDidMount();
		this.showSubset( "all" );
	}
	
	componentWillUnmount() {
		super.componentWillUnmount();
		this.stopTimer();
	}

	componentDidUpdate( prevProps, prevState, snapshot ) {
		super.componentDidUpdate();

		if( this.state.url !== prevState.url ) {
			this.getData();
		}
	}

	//==============================//
	//  Event Handlers				//
	//==============================//
	onTick() {
		this.debug( "onTick" );
		this.getData();
	}

	onTab( e ) {
		var node = e.target;		
		while( node && !node.dataset.type ) {
			node = node.parentNode;
		}
		if( !node ) return;
		
		this.showSubset( node.dataset.type );
	}

	onSearch( e ) {
		this.debug( "search" );
	}

	onChange( e ) {
		this.debug( "onChange" );

		const search = e.target.value;

		if( this.searchTimer ) clearTimeout( this.searchTimer );
		this.searchTimer = setTimeout( () => this.performSearch( search ), 1000 );
	}
	
	//==============================//
	//  Methods						//
	//==============================//
	startTimer() {		
		this.stopTimer();
		this.timer = setInterval( this.onTick, 1000 );
	}
	
	stopTimer() {
		if( this.timer ) 
			clearInterval( this.timer );
	}

	showSubset( type ) {
		let url = type == "online" ? "users-online" : "users-all";
		this.setState( { type:type, loaded:false, items:[], url:url } );
	}

	performSearch( value ) {
		this.debug( "performSearch: " + value );

		const self = this;

		this.searchTimer = "";
		if( this.request ) this.request.abort();
		this.request = $.ajax( {
			url:"/users-search/" + value,
			type:"get",
			error:function( err ) {
				console.log( err );
				//window.location.replace( "login" );
			},
			success:function( data ) {
				data = JSON.parse( data );
				data = data.data;			
				self.setState( { items: data } );

				self.request = "";
			}
		} );	
	}

	//==============================//
	//  Renderers					//
	//==============================//
	renderHeader() {
		var style = { "position":"absolute", "right":"10px", "display":"inline-block" }
		return <div className="panel header">
			{this.state.header}
			<div className="tabs" style={style}>
				<input type="text" id="user-search" placeholder="Search For..." onChange={this.onChange} />
				<div className="tab" data-type="online" onClick={this.onTab}>Online</div>
				<div className="tab" data-type="all" onClick={this.onTab}>All</div>
			</div>
		</div>;
	}
	
	renderContent() { 
		this.debug( "renderContent" );		
		if( this.props.visible && this.state.loaded == false ) this.getData();
		
		if( this.props.visible && this.state.type == "online" ) this.startTimer();
		else this.stopTimer();
		
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
		return <div className="container col-lg-2 col-md-3 col-sm-5 col-xs-6" key={item.id} style={{paddingBottom:"30px"}} onClick={this.onClick}>
			<div className={"users-item"} data-id={item.id}>
				<div className="inner-data">
					<img src={"/img/avatars/" + item.avatar + ".png"} />
					<div className="name">{item.username}</div>
				</div>
			</div>
		</div>
	}	
}