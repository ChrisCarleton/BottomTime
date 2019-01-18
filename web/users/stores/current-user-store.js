import alt from '../../alt';
import CurrentUserActions from '../actions/current-user-actions';

class CurrentUserStore {
	constructor() {
		this.currentUser = null;

		this.bindListeners({
			onLoginSucceeded: CurrentUserActions.LOGIN_SUCCEEDED,
			onFetchCurrentUser: CurrentUserActions.FETCH_CURRENT_USER
		});

		this.onLoginSucceeded = this.onLoginSucceeded.bind(this);
		this.onFetchCurrentUser = this.onFetchCurrentUser.bind(this);
	}

	onFetchCurrentUser() {
		if (!this.getInstance().isLoading()) {
			this.getInstance().getCurrentUser();
		}
	}

	onLoginSucceeded(user) {
		this.currentUser = user;
	}

}

export default alt.createStore(CurrentUserStore, 'CurrentUserStore');
