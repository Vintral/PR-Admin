import React from 'react';
import Details from './details.jsx';
import PieChartWidget from '../widgets/chart-widget-pie.jsx';
import Paginator from '../widgets/paginator.jsx';
 
export default class UserDetails extends Details {
	//==============================//
	//  Constructor					//
	//==============================//
	constructor( props ) {
		super( props );
		
		this._debug = true;
		this._class = "UserDetails"
				
		this.state = { data:"", item:this.props.item, round:0, page:1, loaded:false };
		
		this.getRoundData = this.getRoundData.bind( this );
		this.setRound = this.setRound.bind( this );
		this.onPage = this.onPage.bind( this );
		this.onBanClick = this.onBanClick.bind( this );
		this.onUnbanClick = this.onUnbanClick.bind( this );
	}

	//==============================//
	//  Life Cycle					//
	//==============================//
	componentDidMount() {
		super.componentDidMount();
		this.getData();
	}

	componentWillUnmount() {
		super.componentWillUnmount();
	}

	componentWillUpdate() {
		super.componentWillUpdate();
	}

	componentWillReceiveProps( props ) {
		super.componentWillReceiveProps();
		this.getData();
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

	onBanClick( e ) {
		this.debug( "onBanClick" );
		
		const { id, name } = this.state.data;
		this.props.onBan( id, name );
	}

	onUnbanClick( e ) {
		this.debug( "onUnbanClick" );
		
		const { id, name } = this.state.data;
		this.props.onUnban( id, name );
	}
	
	//==============================//
	//  Methods						//
	//==============================//
	getData() {
		this.debug( "getData" );			
		
		if( this.props.item ) {
			this.debug( "URL: /users/" + this.props.item );
			let self = this;
			$.ajax( {
				url:"/users/" + this.props.item,
				type:"get",
				dataType: 'json',
				success:function( data ) {
					self.setState( { data, bans:data.bans } );				
				}
			} );
		}
	}
	
	getRoundData( round, page ) {
		this.debug( "getRoundData: " + round + ":" + page );

		if( !round ) round = 0;
		if( !page ) page = 1;		
		
		if( this.props.item ) {
			this.debug( "getRoundData: " + round + " : " + page );
			
			var self = this;
			$.ajax( {
				url:"/users/" + this.props.item + "/activity/" + round + "/" + page,
				type:"get",
				success:function( data ) {					
					data = JSON.parse( data );					
					//self.setState( { log:data.data, round:round, pages:data.pages, page:page, loaded:true} );								
				}
			} );
		}
	}
	
	setRound() {
		var round = $( "#user-round" ).val();
		var page = 0;
				
		this.getRoundData( round, page );		
	}

	timeSince( time, min ) {
		var diff = Math.floor( Date.now() / 1000 ) - time;

		if( diff < 60 ) return diff + ( min ? "s" : ( " second") + ( diff != 1 ? "s" : "" ) );
		if( diff < 3600 ) return Math.floor( diff / 60 ) + ( min ? "m" : " minute" + ( Math.floor( diff / 60 ) != 1 ? "s" : "" ) );
		if( diff < 86400 ) return Math.floor( diff / 3600 ) + ( min ? "h" : " hour" + ( Math.floor( diff / 3600 ) != 1 ? "s" : "" ) );

		return Math.floor( diff / 86400 ) + ( min ? "d" : " day" + ( Math.floor( diff / 86400 ) != 1 ? "s" : "" ) );
	}
	
	onPage( page ) {
		this.debug( "onPage: " + page );		
		//this.setState( {page:page, loaded:false} );
	}

	//==============================//
	//  Renderers					//
	//==============================//
	renderBanInstance( ban ) {
		let lengthDiv;

		console.log( ban );
		if( ban.duration != "permanent" ) lengthDiv = <div className="length">{ban.duration}</div>
		else lengthDiv = <div className="length permanent">PERMANENT</div>

		const timeDiv = <div className="date">{this.timeSince( ban.date, true )}</div>

		return (
			<div className="ban" key={ban.id}>
				<div className="reason">{atob( ban.reason )}</div>
				{lengthDiv}
				{timeDiv}
			</div>
		);
	}

	renderBans() {
		const { bans } = this.state.data;
		
		if( !bans ) return (
			<div>No Bans</div>
		);

		return (
			<div className="bans">
				{ bans.map( ban => { return this.renderBanInstance( ban ) } )}
			</div>
		)
	}

	renderUserInfo() {
		const { data } = this.state;
		if( !data ) return;

		return (
			<div className="user-info">
				<input type="text" id="username" value={data.name} onChange={this.handleChange} />
				<div className="round-header ban-header">
					Bans
					<div className="ban-buttons">
						<button onClick={this.onBanClick}>BAN</button>
						<button onClick={this.onUnbanClick}>UNBAN</button>
					</div>
				</div>
				{this.renderBans()}
			</div>
		);
	}

	renderRoundHeader() {
		const { data } = this.state;
		if( !data ) return;

		return (
			<div className="round-header">
				Round Information
				<select id="user-round" onChange={this.setRound}>
					{data.rounds.map( ( rid ) => {
						if( rid == 0 ) return <option value="0" key={rid}>General</option>
						else return <option value={rid} key={rid}>Round {rid}</option>
					} )};
				</select>
			</div>
		);
	}

	renderRoundCharts() {
		if( this.state.round == 0 ) return;

		return (
			<div className="round-charts">
				<div className="dashboard-chart col-md-3 col-sm-6">
					<PieChartWidget id="chart-user-turns" visible={true} refresh="-1" url={"/users/" + this.state.item + "/data/" + this.state.round +"/turns"} />
				</div>
				<div className="dashboard-chart col-md-3 col-sm-6">
					<PieChartWidget id="chart-user-buildings" visible={true} refresh="-1" url={"/users/" + this.state.item + "/data/" + this.state.round +"/buildings"} />
				</div>
				<div className="dashboard-chart col-md-3 col-sm-6">
					<PieChartWidget id="chart-user-units" visible={true} refresh="-1" url={"/users/" + this.state.item + "/data/" + this.state.round +"/units"} />
				</div>
				<div className="dashboard-chart col-md-3 col-sm-6">
					<PieChartWidget id="chart-user-info" visible={true} refresh="-1" url={"/users/" + this.state.item + "/data/" + this.state.round +"/info"} />
				</div>
			</div>
		);
	}

	renderActionHeader() {
		if( this.state.round == 0 ) return;

		return (
			<div className="round-header">
				Actions
			</div>
		)
	}

	renderLog() {
		const { data } = this.state;
		if( !data ) return;

		return (
			<div className={this.state.round != 0 ? "action-log" : "action-log no-header"}>
				{ this.state.log ? this.state.log.map( ( data ) => {
					return ( <div className="action" key={data.id} >
						<div className="text">{data.action}</div>
						<div className="date">{this.timeSince( data.time )}</div>
					</div> )
				} ) : "" }
			</div>
		);
	}

	renderPaginator() {
		return (
			<Paginator pages={this.state.pages} page={this.state.page} onPage={this.onPage} />
		);
	}

	renderContent() {
		/*if( !this.state.loaded ) {
			this.getRoundData( this.state.round, this.state.page );
			return null;
		}*/
		
		this.debug( "renderContent" );
				
		//let data = this.state.data ? this.state.data : {};
		
		//let className = "details" + ( this.state.open ? " opened" : "" );
		
		//if( !this.state.data ) return "";
		
		return <div className="details-content">			
			{this.renderUserInfo()}
			{this.renderRoundHeader()}			
			{this.renderRoundCharts()}
			{this.renderActionHeader()}
			{this.renderLog()}
			{this.renderPaginator()}
		</div>
	}	
}