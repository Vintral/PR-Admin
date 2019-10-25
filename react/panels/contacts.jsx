import React from 'react';

import Panel from './panel.jsx';
import Paginator from '../widgets/paginator.jsx';
 
export default class ContactsPanel extends Panel {
	constructor( props ) {
		super( props );
		
		this._debug = false;
        this.type = "contacts";
        this.state = { items:[], url:"contacts", page:1, class:"ContactsPanel", header:"Contacts" };
		
		this.onPage = this.onPage.bind( this );
		this.onClick = this.onClick.bind( this );

		this.showPlayer = this.showPlayer.bind( this );
		this.showContact = this.showContact.bind( this );
	}

	onPage( e ) {
        this.debug( "onPage: " + e );
        this.setState( { items:[], page: e } );
	}

	componentDidUpdate( props, state, snapshot ) {
        super.componentDidUpdate( props, state, snapshot );

        if( state.page !== this.state.page ) {
            this.getData();
        }
    }
	
	//==============================//
	//  Methods						//
	//==============================//
	getData() {
		this.debug( "getData: " + "/" + this.state.url + "/" + this.state.page );
		
		const self = this;
		$.ajax( {
			url:"/" + this.state.url + "/" + this.state.page,
			type:"get", 
			error:function( err ) {
				console.log( err );				
			},
			success:function( data ) {
				data = JSON.parse( data );				
                self.setState( { pages: data.pages, items: data.data } );
                self.props.onUpdateMenu();
			}
		} );		
	}
	
	showPlayer( player ) {
        this.debug( "showPlayer: " + player );        

		player.stopPropagation();
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
	
	showContact( item ) {
		this.debug( "showContact", true );

		var node = item.target;		
		if( !node.dataset.id ) {
			while( node ) {
				node = node.parentNode;				
				if( !node || ( node.dataset && node.dataset.id ) ) break;
			} 
		}		        
        
        var obj = { id:node.dataset.id, type:"contact" };		
		this.props.onItem( obj );
		this.props.onUpdateMenu();
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
		return <div className="container col-lg-3 col-md-4 col-sm-6 col-xs-12" key={item.id} style={{paddingBottom:"30px",margin:0}}>
            <div className={item.viewed == 0 ? "contact-item new" : "contact-item"} data-id={item.id} onClick={this.showContact}>
                <div className="contact-header">
					<div className="contact-user" data-id={item.userid} onClick={this.showPlayer} >{item.username}</div>
					<div className="contact-date">{this.timeSince( item.time)}</div>
				</div>
				<div className="contact-message">
					{atob(item.message)}
				</div>
            </div>
		</div>
    }

    renderPaginator() {
        this.debug( "renderPaginator" );        
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