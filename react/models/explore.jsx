import React from 'react';
import ReactDOM from 'react-dom';
 
export default class ExploreModel extends React.Component {
	constructor( props ) {
		super( props );

		this.state = { exploreOutput:[], exploreResult:"" };
		
		this.processExplore = this.processExplore.bind( this );		
	}	
	
	processExplore() {
		var turns = parseInt( $( "#exploreTurns" ).val() );
		var land = parseInt( $( "#exploreLand" ).val() );
		
		if( turns >= 0 && land >= 0 ) {
			var increase = 0;
			var gain = 0;
			var i = 0;

			let output = [];
			while( turns - i >= 0 ) {
				if( land <= 100 ) {
					gain = Math.random() * 15 + 5;
				} else if( land <= 250 ) {
					gain = Math.random() * 10 + 5;
				} else if( land <= 500 ) {
					gain = Math.random() * 7.5 + 2.5;
				} else if( land <= 1000 ) {
					gain = Math.random() * 3.5 + 1.5;
				} else if( land <= 1500 ) {
					gain = Math.random() * 1.5 + .5;
				} else if( land <= 2000 ) {
					gain = Math.random() * .75 + .25;
				} else if( land <= 2500 ) {
					gain = Math.random() * .4 + .1;
				} else {
					gain = Math.random() * .15 + .05;
				}

				gain = ( Math.floor( gain * 100 ) ) / 100;
				increase += gain;
				land += gain;

				output.push( gain );
				i++;
			}
			
			let result = <div>
				<div>Land to start: {Math.round( land - increase )}</div>
				<div>Turns Exploring: {turns}</div>
				<div>Land Gained: {Math.floor( increase * 100 ) / 100} acres</div>
				<div>Avg Per Turn: {( Math.floor( ( increase / turns ) * 100 ) ) / 100} acres</div>
			</div>
			
			console.log( output );
			this.setState( {exploreResult:result, exploreOutput:output} );
		}
	}
	
	render() {
		let i = 0;
		let output = this.state.exploreOutput.map( ( gain ) => {			
			return <div key={i++}>{gain} acres</div>;
		} );
		
		let style = { display: ( this.props.visible ? "inline-block" : "none" ) };
		return <div className="models" style={style}>
			<div className="model-explore-section col-lg-4 col-md-12">
				<div className="model-details">
					<div className="model-header">Explore Model</div>
					<input type="text" id="exploreTurns" placeholder="Turns..." />
					<input type="text" id="exploreLand" placeholder="Starting Land..." />
					<button id="btnExplore" onClick={this.processExplore}>Explore</button>
				</div>
			</div>
			<div className="model-explore-section col-lg-4 col-md-12">
				<div className="model-details">
					<div className="model-header">Output</div>
					<div id="exploreOutput">{output}</div>
				</div>
			</div>
			<div className="model-explore-section col-lg-4 col-md-12">
				<div className="model-details">
					<div className="model-header">Results</div>
					<div id="exploreResults">{this.state.exploreResult}</div>
				</div>
			</div>
		</div>
	}
}