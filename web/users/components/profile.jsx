import agent from '../../agent';
import connectToStores from 'alt-utils/lib/connectToStores';
import CurrentUserStore from '../stores/current-user-store';
import EditProfile from './edit-profile';
import handleError from '../../handle-error';
import LoadingSpinner from '../../components/loading-spinner';
import PageTitle from '../../components/page-title';
import PropTypes from 'prop-types';
import React from 'react';
import RequireUser from '../../components/require-user';
import UserProfileActions from '../actions/user-profile-actions';
import UserProfileStore from '../stores/user-profile-store';
import ViewProfile from './view-profile';
import { withRouter } from 'react-router-dom';

class Profile extends React.Component {
	static getStores() {
		return [ CurrentUserStore, UserProfileStore ];
	}

	static getPropsFromStores() {
		return {
			...UserProfileStore.getState(),
			currentUser: CurrentUserStore.getState().currentUser
		};
	}

	componentDidMount() {
		if (this.props.match.params.username || !this.props.currentUser.isAnonymous) {
			UserProfileActions.beginLoading();
			const username = this.props.match.params.username
				|| this.props.currentUser.username;

			setTimeout(async () => {
				try {
					const result = await agent.get(`/api/users/${ username }/profile`);
					UserProfileActions.setProfile(result.body);
				} catch (err) {
					UserProfileActions.finishLoading();
					handleError(err, this.props.history);
				}
			}, 0);
		}
	}

	render() {
		const {
			currentProfile,
			currentUser,
			isLoading,
			match
		} = this.props;

		const username = match.params.username || currentUser.username;
		let element = null;
		if (isLoading) {
			element = <LoadingSpinner message="Loading profile information..." />;
		} else if (currentProfile.readOnly) {
			element = (
				<ViewProfile profile={ currentProfile } />
			);
		} else {
			element = (
				<EditProfile
					profile={ currentProfile }
					username={ username }
				/>
			);
		}

		return (
			<div>
				<PageTitle title="Profile" />
				<RequireUser customFunction={ () => currentUser.isAnonymous && !match.params.username }>
					{ element }
				</RequireUser>
			</div>
		);
	}
}

Profile.propTypes = {
	currentProfile: PropTypes.object.isRequired,
	currentUser: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	isLoading: PropTypes.bool.isRequired,
	match: PropTypes.object.isRequired
};

export default withRouter(connectToStores(Profile));
