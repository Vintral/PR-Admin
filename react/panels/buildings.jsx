import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './panel.jsx';
 
export default class BuildingsPanel extends Panel {
	constructor( props ) {
		super( props );
		
		this._debug = true;

		this.type = "building";
		this.state = { items:[], url:"buildings", header:"Buildings", imagePath:"buildings", class:"BuildingsPanel" };
	}
}