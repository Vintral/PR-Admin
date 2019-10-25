import React from 'react';
import ReactDOM from 'react-dom';

export default class DashboardWidget extends React.Component {	
	constructor( props ) {
		super( props );
		
		this.timer = "";
	}
						
	renderContent() {
		return <div className="dashboard-stat-container col-md-2 col-sm-4 col-xs-6">
			<div className="dashboard-stat">
				<div className="dashboard-header">{this.props.header}</div>
				<div className="dashboard-content">
					<span id="dashboard-new-users">--</span>
				</div>
			</div>
		</div>
	}
}