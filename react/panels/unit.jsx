import React from 'react';
import ReactDOM from 'react-dom';

import Panel from '../panel.jsx';
 
export default class UnitPanel extends Panel {
	getData() {
		const self = this;
		$.ajax( {
				url:"/units",
				type:"get",				
				success:function( data ) {
					data = JSON.parse( data );
					data = data.data;
					console.log( data );
					self.setState( { items: data } );
				}
			} );		
	}	
}