import agent from '../../agent';
import alt from '../../alt';
import ErrorActions from '../../actions/error-actions';
import handleError from '../../handle-error';

class CurrentUserActions {
	login(model) {
		return async dispatch => {
			dispatch();
			try {
				const result = await agent.post('/api/auth/login').send(model);
				this.loginSucceeded(result);
			} catch (err) {
				handleError(err);
			}
		};
	}

	trySignup(model, done) {
		return async dispatch => {
			dispatch();
			try {
				const result = await agent
					.put(`/api/users/${ model.username }`)
					.send({
						email: model.email,
						password: model.password,
						role: 'user'
					});


				ErrorActions.showSuccess('Success!', 'Your new account has been created.');
				done();
				return this.loginSucceeded(result);
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
			} catch (err) {
				// TODO: Figure out what to do about this.
			}

			agent.clearAuthToken();
		};
	}

	loginSucceeded(result) {
		agent.setAuthToken(result.body.token);
		return result.body.user;
	}

	fetchCurrentUser() {
		return true;
	}
}

export default alt.createActions(CurrentUserActions);
