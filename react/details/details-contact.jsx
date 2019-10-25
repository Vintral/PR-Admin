import React from 'react';
import Details from './details.jsx';
 
export default class ContactDetails extends Details {
	//==============================//
	//  Constructor					//
	//==============================//
	constructor( props ) {
		super( props );
		
		this._debug = false;
		this._class = "ContactDetails"
				
		this.state = { data:"", item:this.props.item, loaded:false, loading:false };
				
		this.onAddReply = this.onAddReply.bind( this );
	}

	//==============================//
	//  Life Cycle					//
	//==============================//
	componentDidMount() {
		super.componentDidMount();
		this.getData();
	}

	componentWillUnmount() {
		super.componentWillUnmount();
	}

	componentWillUpdate() {
		super.componentWillUpdate();
	}

	componentWillReceiveProps( props ) {
		super.componentWillReceiveProps();
		this.getData();
	}

	//==============================//
	//  Event Handlers				//
	//==============================//
	onChange( e ) {
		/*let name = document.getElementById( "username" ).value;
				
		var data = JSON.parse( JSON.stringify( this.state.data ) );		
		data.name = name;*/
		
		//this.setState( {data:data} );
	}

	onAddReply() {
		this.debug( "onAddReply" );

		const message = document.getElementById( "contact-reply" ).value;

		var packet = {};		
		packet.message = btoa( message );		
			
		let self = this;
		$.ajax( {
			url:"/contact/" + this.props.item + "/reply",
			type: 'POST',
			data: JSON.stringify( packet ),
			contentType: 'application/json',
			success: ( data ) => {
				self.props.onClose();
			}
		} );
	}
	
	//==============================//
	//  Methods						//
	//==============================//
	getData() {
		this.debug( "getData", true );			
		
		if( this.props.item && !this.state.loading ) {
            this.setState( { loading:true } );
			this.debug( "URL: /contact/" + this.props.item );
			let self = this;
			$.ajax( {
				url:"/contact/" + this.props.item,
				type:"get",
				dataType: 'json',
				success:function( data ) {
					console.log( data );
					const { username, userid, roundid, message, time, viewed, replies } = data;
                    self.setState( { username, userid, roundid, message, time, viewed, replies, loaded:true } );		
				}
			} );
		}
	}
	
	onPage( page ) {
		this.debug( "onPage: " + page );		
		//this.setState( {page:page, loaded:false} );
	}

	//==============================//
	//  Renderers					//
	//==============================//
	renderHeader() {
		this.debug( "renderHeader" );
		
		return <div className="details-header">
			<div className="username">{this.state.username}</div>
			<div className="time">{this.timeSince( this.state.time ) + " ago"}</div>
		</div>
	}

	renderRepliesHeader() {
		this.debug( "renderRepliesHeader" );

		return (
			<div className="round-header">
				Replies
			</div>
		);
	}

	renderReply( reply ) {
		this.debug( "renderReply" );

		console.log( reply );
		return (
			<div key={reply.id} className="reply">
				{reply}
			</div>
		)
	}

	renderReplies() {
		this.debug( "renderReplies" );

		return (
			<div>
				{this.state.replies.map( reply => { return reply;/*return this.renderReply( reply );*/ } )}
			</div>
		)
	}

	renderContent() {		
        this.debug( "renderContent!" );
        if( !this.state.loaded ) return "NOT LOADED";
	
		
		return <div className="details-content">			
			<div className="message">
				{atob( this.state.message )}
			</div>
			{this.renderRepliesHeader()}
			{this.renderReplies()}
			<textarea id="contact-reply" onChange={this.onChange} placeholder="Reply"></textarea>
			<button onClick={this.onAddReply}>ADD REPLY</button>
		</div>
	}	
}