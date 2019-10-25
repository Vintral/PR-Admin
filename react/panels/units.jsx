import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './panel.jsx';
 
export default class UnitsPanel extends Panel {
	constructor( props ) {
		super( props );
		
		this.type = "unit";
		this.state = { items:[], url:"units", header:"Units", imagePath:"units", class:"UnitsPanel" };
	}
}