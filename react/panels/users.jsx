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
		
		this.state = { items:[], url:"users", header:"Users", imagePath:"users", type:"online", class:"UsersPanel" };
		
		this.timer = "";
		
		this.onClick = this.onClick.bind( this );
		this.onTick = this.onTick.bind( this );
		this.onTab = this.onTab.bind( this );
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

	//==============================//
	//  Renderers					//
	//==============================//
	renderHeader() {
		var style = { "position":"absolute", "right":"10px", "display":"inline-block" }
		return <div className="panel header">
			{this.props.header}
			<div className="tabs" style={style}>
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