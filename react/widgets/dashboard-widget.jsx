import React from 'react';
import ReactDOM from 'react-dom';

export default class DashboardWidget extends React.Component {	
	constructor( props ) {
		super( props );
		
		this.timer = "";
		
		this.state = { value:this.props.default, prefix:( this.props.prefix ? this.props.prefix : "" ), loaded:false };
		this.onTick = this.onTick.bind( this );
	}
	
	getData() {
		var self = this;
		$.ajax( {
			url:this.props.url,
			type:"get",
			success:function( data ) {
				self.setState( { value:data, loaded:true } );
			}
		} );
	}
	
	onTick() {		
		this.getData();
	}

	startTimer() {
		console.log( "startTimer: " + this.props.refresh );		

		this.stopTimer();
		this.timer = setInterval( this.onTick, ( this.props.refresh ? this.props.refresh * 1000 : 1000 ) );				
	}
	
	stopTimer() {		
		if( this.timer )
			clearInterval( this.timer );
	}
	
	componentDidMount() {
		this.startTimer();
	}
	
	componentWillUnmount() {		
		this.stopTimer();
	}
		
	render() {
		if( !this.state.loaded ) this.getData();			
				
		return <div className="dashboard-stat-container col-md-2 col-sm-4 col-xs-6">
			<div className="dashboard-stat">
				<div className="dashboard-header">{this.props.header}</div>
				<div className="dashboard-content">
					<span id="dashboard-new-users">{this.state.prefix}{this.state.value}</span>
				</div>
			</div>
		</div>
	}
}