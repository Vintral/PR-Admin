import React from 'react';
import ReactDOM from 'react-dom';

import ChartWidget from './chart-widget.jsx';

export default class PieChartWidget extends ChartWidget {	
	constructor( props ) {
		super( props );
				
		this.labels = props.labels ? props.labels : [];
		this.colors = props.colors ? props.colors: [];
		
		//this.onTick = this.onTick.bind( this );
	}
	
	capitalize( str ) {
		 return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
	}
	
	getData() {		
		var self = this;
		
		$.ajax( {
			url:self.props.url,
			type:"get",
			success:function( data ) {
				data = JSON.parse( data );
				data = data.data;				

				datasets: [{
				  backgroundColor: [],
				  data: []
				}]
				
				self.chart.data.labels = [];
				self.chart.data.datasets[ 0 ].backgroundColor = [];
				self.chart.data.datasets[ 0 ].data = [];
				if( data.length > 0 ) {
					for( var i = data.length - 1; i >= 0; i-- ) {						
						data[ i ].color = data[ i ].color ? data[ i ].color : "#777777";
						self.chart.data.labels.push( self.capitalize( data[ i ].type ) );
						self.chart.data.datasets[ 0 ].backgroundColor.push( data[ i ].color );
						self.chart.data.datasets[ 0 ].data.push( data[ i ].total );
					}
				} else {
					self.chart.data.labels.push( "None" );
					self.chart.data.datasets[ 0 ].backgroundColor.push( "#777777" );
					self.chart.data.datasets[ 0 ].data.push( 1 );
				}

				self.chart.update();
			}
		} );
	}
	
	build( title ) {
		let ctx = document.getElementById( this.props.id ).getContext( '2d' );
		this.chart = new Chart(ctx, {
			type: "pie",
			responsive:false,
			data: {				
				labels: this.labels,
				datasets: [{
				  backgroundColor: [],
				  data: []
				}]
			},
			options: {				
				legend: {
					display:false
				},
				tooltips: {
					enabled:true
				},				
			}
		});
	}
		
	render() {
		if( this.props.visible ) this.startTimer();
		else this.stopTimer();
		
		var style = { background:( this.props.background ? this.props.background : "" ) };
		return <canvas id={this.props.id} style={style}></canvas>
	}
}