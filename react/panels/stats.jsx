import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './panel.jsx';

import DashboardWidget from '../widgets/dashboard-widget.jsx';
import ChartWidget from '../widgets/chart-widget.jsx';
 
export default class StatsPanel extends Panel {	
	constructor( props ) {
		super( props );
		
		this.type = "model";
		this.state = { header:"Stats", class:"StatsPanel" };
		
		this.onClick = this.onClick.bind( this );
	}
	
	renderContent() {
		return <div>
			<div>
				<DashboardWidget header="Active Users" default="--" visible={this.props.visible} url="/dashboard/users/active" />
				<DashboardWidget header="New Users" default="--" visible={this.props.visible} url="/dashboard/users/new" refresh="60" />			
				<DashboardWidget header="Daily Users" default="--" visible={this.props.visible} url="/dashboard/users/daily" refresh="60" />
				<DashboardWidget header="Daily" default="0" visible={this.props.visible} url="/dashboard/revenue/daily" refresh="60" prefix="$" />
				<DashboardWidget header="Monthly" default="0" visible={this.props.visible} url="/dashboard/revenue/monthly" refresh="60" prefix="$" />
				<DashboardWidget header="Tickets" default="--" visible={this.props.visible} url="/dashboard/tickets" refresh="60" />
			</div>
			<div className="dashboard-chart col-md-6 col-sm-12">
				<ChartWidget id="chart-new-users" background="rgba(255,255,255,0.7)" title="New Users" url="/dashboard/chart/users/new" />				
			</div>
			<div className="dashboard-chart col-md-6 col-sm-12">
				<ChartWidget id="chart-daily-users" background="rgba(255,255,255,0.7)" title="Daily Users" url="/dashboard/chart/users/daily" />				
			</div>
		</div>
	}
}