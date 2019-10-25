import React from 'react';

import Panel from './panel.jsx';
import Paginator from '../widgets/paginator.jsx';
 
export default class DupesPanel extends Panel {
	constructor( props ) {
        super( props );
        
        this._debug = true;
        this.type = "dupes";
        this.state = { items:[], url:"dupes", page:1, class:"DupesPanel", header:"Dupes" };
		
        this.onClick = this.onClick.bind( this );
        this.onPage = this.onPage.bind( this );
        this.showPlayer = this.showPlayer.bind( this );
    }

    componentDidUpdate( props, state, snapshot ) {
        super.componentDidUpdate( props, state, snapshot );

        if( state.page !== this.state.page ) {
            this.getData();
        }
    }
    
    onPage( e ) {
        this.debug( "onPage: " + e );
        this.setState( { items:[], page: e } );
    }

    showPlayer( player ) {
        this.debug( "showPlayer: " + player );        

        var node = player.target;		
		if( !node.dataset.id ) {
			while( node ) {
				node = node.parentNode;				
				if( !node || ( node.dataset && node.dataset.id ) ) break;
			} 
		}		        
        
        var obj = { id:node.dataset.id, type:"user" };		
		this.props.onItem( obj );
    }

    //==============================//
	//  Methods						//
	//==============================//
	getData() {
		this.debug( "getData" );		
		
		const self = this;
		$.ajax( {
			url:"/" + this.state.url + "/" + this.state.page,
			type:"get", 
			error:function( err ) {
				console.log( err );
				//window.location.replace( "login" );
			},
			success:function( data ) {
				data = JSON.parse( data );				
                self.setState( { pages: data.pages, items: data.data } );
                self.props.onUpdateMenu();
			}
		} );		
    }
    
    renderType( item ) {
        let ret = "";
        switch( item.type ) {
            case 1: return "IP";
            case 2: return "Token";
        }
        return ret;
    }

    renderTime( item ) {
        return this.timeSince( item.time );
    }

	renderItem( item ) {
        console.log( item );
		return <div className="container col-lg-3 col-md-4 col-sm-6 col-xs-12" key={item.id} style={{paddingBottom:"30px",margin:0}}>
            <div className={item.viewed == 0 ? "dupe-item new" : "dupe-item"}>
                <div className="player" data-id={item.id1} onClick={this.showPlayer}>{item.player1}</div>
                <div className="player" data-id={item.id2} onClick={this.showPlayer}>{item.player2}</div>
                <div className="type">Type: {this.renderType( item )}</div>
                <div className="time">{this.renderTime( item )} ago</div>
            </div>
		</div>
    }

    renderPaginator() {
        this.debug( "renderPaginator" );
        console.log( this.state );
        return (
			<Paginator fixed={true} pages={this.state.pages} page={this.state.page} onPage={this.onPage} />
		);
    }
    
    renderContent() {
		this.debug( "renderContent" );
		
		let content = "";		
		if( this.state && this.state.items ) {
			let i = 0;
			content = this.state.items.map( ( item ) => {				
				return this.renderItem( item );
			} );			
		}
				
		return (
            <div>
                <div className="dupes-content">
                    {content}
                </div>
                {this.renderPaginator()}
            </div>
        );
            
	}
}