import React from 'react';

export default class Paginator extends React.Component {	
	constructor( props ) {
		super( props );
		
		this._debug = false;
				
		this.onClick = this.onClick.bind( this );
	}
	
	onClick( e ) {
		this.debug( "CLICKED ON PAGE" );
		
		var page = e.target.dataset.page;
		
		if( page == "next" ) page = this.props.page + 1;
		if( page == "first" ) page = 1;
		if( page == "prev" ) page = this.props.page - 1;		
		if( page == "last" ) page = this.props.pages;
		
		this.debug( "Page: " + page );
		
		this.props.onPage( page );
	}

	componentWillReceiveProps( props ) {
		this.debug( "componentWillReceiveProps: " + JSON.stringify( props ) );
	}
	
	buildPages() {
		this.debug( "buildPages" );
		
		if( this.props.pages == 1 ) return null;
		
		let size = this.props.size ? this.props.size : 5;
		let page = this.props.page - size;
		let current = parseInt( this.props.page );
		
		this.debug( "Size: " + size );
		
		let ret = [];
		if( page > 1 ) {
			ret.push( <div key="first" className="page" data-page="first" onClick={this.onClick}>&lt;&lt;</div> );
			ret.push( <div key="prev" className="page" data-page="prev" onClick={this.onClick}>&lt;</div> );
		}
		while( page <= current + size ) {			
			ret.push( <div key={page} className={page == this.props.page ? "page active" : ( Math.abs( page - this.props.page ) > size / 2 ? "page wide" : "page" ) } onClick={this.onClick} data-page={page}>
				{page > 0 && page <= this.props.pages ? page : " "}
			</div> );
			page++;
		}
		if( page < this.props.pages ){
			ret.push( <div key="next" className="page" data-page="next" onClick={this.onClick}>&gt;</div> );
			ret.push( <div key="last" className="page" data-page="last" onClick={this.onClick}>&gt;&gt;</div> );
		}
		
		return ret;
	}

	renderPages() {
		this.debug( "renderPages" );
				
		var pages = this.buildPages()
		if( pages ) return pages.map( ( page ) => {
			return page;
		} );
	}

	render() {
		this.debug( "render" );

		let ret = ( <div className={this.props.fixed ? "paginator fixed" : "paginator"}>
			{this.renderPages()}
		</div> );

		console.log( ret );
		return ret;
	}
	
	debug( msg ) {
		if( this._debug ) 
			console.log( "Paginator: "+ msg );
	}
}