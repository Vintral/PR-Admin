import React from 'react';
import ReactDOM from 'react-dom';

import NavigationMenu from './navigation.jsx';

import StatsPanel from './panels/stats.jsx';
import UsersPanel from './panels/users.jsx';
import RoundsPanel from './panels/rounds.jsx';
import UnitsPanel from './panels/units.jsx';
import BuildingsPanel from './panels/buildings.jsx';
import ItemsPanel from './panels/items.jsx';
import NewsPanel from './panels/news.jsx';
import RulesPanel from './panels/rules.jsx';
import SettingsPanel from './panels/settings.jsx';
import ThemePanel from './panels/theme.jsx';
import ModelsPanel from './panels/models.jsx';
import ShoutboxPanel from './panels/shoutbox.jsx';

import UserDetails from './details/details-user.jsx';
import ItemDetails from './details/details-item.jsx';
import UnitDetails from './details/details-unit.jsx';
import BuildingDetails from './details/details-building.jsx';
import NewsDetails from './details/details-news.jsx';
import RuleDetails from './details/details-rule.jsx';
import ContactDetails from './details/details-contact.jsx';

import BanUserModal from './modals/modal-ban.jsx';
import UnbanUserModal from './modals/modal-unban.jsx';
import RoundModal from './modals/modal-round.jsx';

import DupesPanel from './panels/dupes.jsx';
import ContactsPanel from './panels/contacts.jsx';
 
class App extends React.Component {
	//==============================//
	//  Constructor									//
	//==============================//
	constructor( props ) {
		super( props );

		this._debug = false;

		this.state = { panel:"Stats", overlay:false, updateMenu:true };
		
		this.onNavigationChange = this.onNavigationChange.bind( this );
		this.onItem = this.onItem.bind( this );
		this.onClose = this.onClose.bind( this );
		this.onClick = this.onClick.bind( this );
		this.onAdd = this.onAdd.bind( this );
		this.onUpdated = this.onUpdated.bind( this );
		this.onBanUser = this.onBanUser.bind( this );
		this.onUnbanUser = this.onUnbanUser.bind( this );
		this.onCloseModal = this.onCloseModal.bind( this );
		this.onUpdateMenu = this.onUpdateMenu.bind( this );
		this.onMenuUpdated = this.onMenuUpdated.bind( this );

		this.updateNews = false;
		this.updateRules = false;
		this.updateItems = false;
		
		this.addItem = false;
	}

	//==============================//
	//  Event Handlers							//
	//==============================//
	onNavigationChange( e ) {
		this.debug( "onNavigationChange" );
		this.setState( { panel:e } );
	}		
	
	onItem( e ) {
		this.debug( "onItem: " + e.id );
		this.setState( { overlay:true, type:e.type, item:e.id } );
	}
	
	onAdd( e ) {
		this.debug( "onAdd: " + e.type );

		switch( e.type ) {
			case "round": this.setState( { modalOverlay:true, modal:"round" } ); break;
			default: this.setState( { overlay:true, type:e.type, item:"add" } ); break;
		}
	}
	
	onClick( e ) {
		this.debug( "onClick" );
		this.setState( { overlay:false, item:"" } );		
	}
	
	onUpdated( type ) {
		this.debug( "onUpdated" );

		if( type === "news" ) this.updateNews = true;
		if( type === "rules" ) this.updateRules = true;
		if( type === "items" ) this.updateItems = true;
	}
	
	onClose( e ) {
		this.debug( "onClose" );
		this.setState( { overlay:false, type:"", item:""} );
	}

	onBanUser( id, name ) {
		this.debug( "onBanUser" );
		this.setState( { modalOverlay:true, modal:"ban", modalData: { id, name } } );
	}

	onUnbanUser( id, name ) {
		this.debug( "onUnbanUser" );
		this.setState( { modalOverlay:true, modal:"unban", modalData: { id, name } } );
	}

	onCloseModal() {
		this.debug( "onCloseModal" );

		if( this.state.modal === "ban" ) this.setState( { refresh:{ user:true } } );
		this.setState( { modalOverlay:false, modal:"", modalData:{} } );
	}

	onUpdateMenu() {
		this.debug( "onUpdateMenu", true );
		console.log( "=======================" );
		this.setState( { updateMenu:true } );

		return "WORKS";
	}

	onMenuUpdated() {
		this.debug( "onMenuUpdated" );
		this.setState( { updateMenu:false } );
	}

	//==============================//
	//  Renderers										//
	//==============================//
	renderPanel() {
		this.debug( "renderPanel" );

		switch( this.state.panel ) {
			case "Stats": return <StatsPanel />;
			case "Users": return <UsersPanel onItem={this.onItem} />;
			case "Rounds": return <RoundsPanel onItem={this.onItem} onAdd={this.onAdd} />;
			case "Units": return <UnitsPanel onItem={this.onItem} />
			case "Buildings": return <BuildingsPanel onItem={this.onItem} onAdd={this.onAdd} />;
			case "Items": return <ItemsPanel onItem={this.onItem} onAdd={this.onAdd} />;
			case "News": return <NewsPanel onItem={this.onItem} onAdd={this.onAdd} />;
			case "Rules": return <RulesPanel onItem={this.onItem} onAdd={this.onAdd} />;
			case "Settings": return <SettingsPanel />;
			case "Theme": return <ThemePanel />;
			case "Models": return <ModelsPanel />;
			case "Shoutbox": return <ShoutboxPanel />;
			case "Dupes": return <DupesPanel onUpdateMenu={this.onUpdateMenu} onItem={this.onItem} />;
			case "Contacts": return <ContactsPanel onUpdateMenu={this.onUpdateMenu} onItem={this.onItem} />;
		}
	}
	
	renderOverlay() {
		if( !this.state.overlay ) return "";

		return (
			<div id="overlay" className={"active"} onClick={this.onClick}>&nbsp;</div>
		);
	}

	renderDetail() {
		const { overlay, type, item } = this.state;

		if( overlay && type && item ) {
			switch( type ) {
				case "user": return <UserDetails className="detail wide" item={this.state.item} onClose={this.onClose} onBan={this.onBanUser} onUnban={this.onUnbanUser} />;
				case "contact": return <ContactDetails className="detail" item={this.state.item} onClose={this.onClose} />
				case "item": return <ItemDetails className={this.state.overlay && this.state.type == "item" ? "details opened" : "details"} item={this.state.type == "item" ? this.state.item : ""} onClose={this.onClose} onUpdated={this.onUpdated} />;
				case "unit": return <UnitDetails className={this.state.overlay && this.state.type == "unit" ? "details opened" : "details"} item={this.state.type == "unit" ? this.state.item : ""} onClose={this.onClose} />;
				case "building": return <BuildingDetails className={this.state.overlay && this.state.type == "building" ? "details opened" : "details"} item={this.state.type == "building" ? this.state.item : ""} onClose={this.onClose} />;
				case "news": return <NewsDetails className={this.state.overlay && this.state.type == "news" ? "details opened" : "details"} item={this.state.type == "news" ? this.state.item : ""} onUpdated={this.onUpdated} onClose={this.onClose} />;
				case "rule": return <RuleDetails className={this.state.overlay && this.state.type == "rule" ? "details opened" : "details"} item={this.state.type == "rule" ? this.state.item : ""} onUpdated={this.onUpdated} onClose={this.onClose} />;				
			}
		}
	}

	renderNavigation() {
		console.log( "renderNavigation", true );
		console.log( this.state );
		return <NavigationMenu update={this.state.updateMenu} onMenuUpdated={this.onMenuUpdated} onChanged={this.onNavigationChange} />;
	}

	renderModal() {
		const { modal:modalType } = this.state;
		if( !modalType ) return "";

		const { data } = this.state.modalData;

		console.log( "SHOW MODAL" );
		console.log( this.state );

		let modal = "";
		switch( modalType ) {
			case "ban": modal = <BanUserModal userid={data.id} username={data.name} closeModal={this.onCloseModal}/>; break;
			case "unban": modal = <UnbanUserModal userid={data.id} username={data.name} closeModal={this.onCloseModal}/>; break;
			case "round": modal = <RoundModal closeModal={this.onCloseModal} />; break;
			default: return "";
		}

		return (
			<div id="overlayModal">
				{modal}
			</div>
		)
	}

	render() {
		this.debug( "render" );
		
		return <>
			{this.renderOverlay()}			
			{this.renderNavigation()}			
			{this.renderPanel()}
			{this.renderDetail()}
			{this.renderModal()}
		</>
	}

	//==============================//
	//  Utility						//
	//==============================//
	debug( msg, force, silence ) {
		if( silence ) return;
		if( this._debug || force )
			console.log( "App: " + msg );
	}
}

ReactDOM.render( <App />, document.getElementById( "root" ) );