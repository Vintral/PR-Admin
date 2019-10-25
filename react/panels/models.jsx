import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './panel.jsx';

import CombatModel from '../models/combat.jsx';
import ExploreModel from '../models/explore.jsx';
 
export default class ModelsPanel extends Panel {	
	constructor( props ) {
		super( props );
		
		this.type = "model";
		this.state = { model:"explore", exploreOutput:[], exploreResult:"", unitsLoaded:false, header:"Models", class:"ModelsPanel" };
				
		this.onTab = this.onTab.bind( this );		
	}
	
	onTab( e ) {
		var node = e.target;		
		while( node && !node.dataset.type ) {
			node = node.parentNode;
		}
		
		if( !node ) return;		
		this.setState( {model:node.dataset.type} );
	}
	
	renderHeader() {
		var style = { "position":"absolute", "right":"10px", "display":"inline-block" }

		return <div className="panel header">
			{this.state.header}
			<div className="tabs" style={style}>
				<div className="tab" data-type="explore" onClick={this.onTab}>Explore</div>
				<div className="tab" data-type="combat" onClick={this.onTab}>Combat</div>
			</div>
		</div>;
	}
	
	renderContent() {		
		return <div>			
			<ExploreModel visible={this.state.model == "explore"} />
			<CombatModel visible={this.state.model == "combat"} />			
		</div>;
	}
}