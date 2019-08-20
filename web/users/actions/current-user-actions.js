import agent from '../../agent';
import alt from '../../alt';
import ErrorActions from '../../actions/error-actions';
import TanksActions from '../../tanks/actions/tanks-actions';

class CurrentUserActions {
	trySignup(model, done) {
		return async dispatch => {
			dispatch();
			try {
				const { body } = await agent
					.put(`/api/users/${ model.username }`)
					.send({
						email: model.email,
						password: model.password,
						role: 'user'
					});


				ErrorActions.showSuccess('Success!', 'Your new account has been created.');
				done();
				return this.loginSucceeded(body);
			} catch (err) {
				return done(err);
			}
		};
	}

	logout() {
		return async dispatch => {
			dispatch();

			try {
				await agent.post('/api/auth/logout');
				TanksActions.refreshTanks();
			} catch (err) {
				// Not much to do here. As long as the auth token gets cleared, we're good.
				/* eslint-disable no-console */
				console.error(err);
				/* eslint-enable no-console */
			}
		};
	}

	loginSucceeded(user) {
		TanksActions.refreshTanks();
		return user;
	}

	updateUser(update) {
		return update;
	}
}

export default alt.createActions(CurrentUserActions);
