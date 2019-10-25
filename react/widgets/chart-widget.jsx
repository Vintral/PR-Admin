import React from 'react';
import ReactDOM from 'react-dom';

export default class ChartWidget extends React.Component {	
	constructor( props ) {
		super( props );
		
		this.timer = "";
				
		var type = props.type ? props.type : "bar";
		
		this.labels = props.labels ? props.labels : [];
		
		this.state = { type:type };
		this.onTick = this.onTick.bind( this );
	}	
	
	onTick() {		
		this.getData();
	}

	startTimer() {				
		if( this.props.refresh && this.props.refresh == -1 ) {
			this.getData();
		} else {
			this.stopTimer();
			this.timer = setInterval( this.onTick, ( this.props.refresh ? this.props.refresh * 1000 : 1000 ) );
		}
	}
	
	stopTimer() {
		if( this.timer )
			clearInterval( this.timer );
	}
	
	componentDidMount() {
		this.build( this.props.title );
	}
	
	getData() {		
		var self = this;
		
		$.ajax( {
			url:self.props.url,
			type:"get",
			success:function( data ) {
				data = JSON.parse( data );				

				for( var i = data.length - 1; i >= 0; i-- ) {
					self.chart.data.labels.push( "" );
					self.chart.data.datasets.forEach( ( dataset ) => {
						dataset.data.push( data[ i ] );
					} );
				}

				self.chart.update();
			}
		} );
	}
	
	build( title ) {		
		let ctx = document.getElementById( this.props.id ).getContext( '2d' );
		this.chart = new Chart(ctx, {
			type: this.state.type,
			responsive:false,
			data: {				
				datasets: [{
					backgroundColor:'rgba(255, 99, 132, 0.2)',
					borderColor:'rgba(255,99,132,1)',
					borderWidth: 1
				}]
			},
			options: {
				layout: {
					padding: 10
				},
				legend: {
					display:false
				},
				tooltips: {
					enabled:true
				},
				title: {
					display:true,
					fontSize: 16,
					text: title
				},
				scaleShowLabels: false,
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true,
							display:false
						},
						gridLines: {
							color: "rgba(0, 0, 0, 0)",
						}
					}],
					xAxes: [{
						display:false,
						categoryPercentage: 1.0,
						barPercentage: 1.0
					}]
				}
			}
		});
	}
		
	render() {
		if( this.props.visible ) this.startTimer();
		else this.stopTimer();
		
		var style = { background:( this.props.background ? this.props.background : "#FFF" ) };
		return <canvas id={this.props.id} style={style}></canvas>
	}
}