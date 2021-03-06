import { Button } from 'react-bootstrap';
import { Col, Row } from 'react-flexbox-grid';
import Formsy from 'formsy-react';
import FriendsActions from '../actions/friends-actions';
import PropTypes from 'prop-types';
import React from 'react';
import TextBox from '../../components/text-box';

class DeclineFriendRequest extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmitDecline = this.handleSubmitDecline.bind(this);
	}

	handleSubmitDecline(model) {
		this.props.declineHandler(this.props.index, 'reject', model.reason);
	}

	render() {
		const { index } = this.props;

		return (
			<Row>
				<Col sm={ 12 }>
					<h4>Decline Buddy Request</h4>
					<p>
						{ 'You can optionally give a reason for declining the buddy request. (You don\'t have to!)' }
					</p>
					<Formsy onValidSubmit={ this.handleSubmitDecline }>
						<TextBox
							autoFocus
							controlId={ `reason_${ index }` }
							name="reason"
							label="Reason"
							maxLength={ 250 }
						/>
						<Button type="submit" bsStyle="primary">Ok</Button>
						&nbsp;
						<Button onClick={ () => FriendsActions.showReasonBox(index, false) }>Cancel</Button>
					</Formsy>
				</Col>
			</Row>
		);
	}
}

DeclineFriendRequest.propTypes = {
	declineHandler: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired
};

export default DeclineFriendRequest;
