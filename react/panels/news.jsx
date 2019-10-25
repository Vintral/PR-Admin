import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './panel.jsx';
 
export default class NewsPanel extends Panel {
	constructor( props ) {
		super( props );
		
		this.type = "news";
		this.state = { items:[], url:"news", header:"News", class:"NewsPanel" };
		
		this.onClick = this.onClick.bind( this );
	}	
	
	renderItem( item ) {		
		return <div className="container col-lg-3 col-md-4 col-sm-6 col-xs-12" key={item.id} style={{paddingBottom:"30px"}} onClick={this.onClick}>
			<div className={"news-item" + ( item.active ? "" : " unavailable" ) } data-id={item.id}>
				<div className="title">{atob( item.title )}</div>
				<div className="date">{atob( item.date )}</div>
				<div className="body">{atob( item.body )}</div>
			</div>
		</div>
	}
}