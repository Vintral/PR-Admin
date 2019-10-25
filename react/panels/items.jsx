import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './panel.jsx';
 
export default class ItemsPanel extends Panel {
	constructor( props ) {
		super( props );
		
		this.type = "item";
		this.state = { items:[], url:"items", header:"Items", imagePath:"items", class:"ItemsPanel" };
	}
}