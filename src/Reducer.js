export const reducer = (state, action) => {
	console.log('state', state);
	console.log('action', action);
	switch (action.type) {
		case 'SET_SEARCH_VALUE':
			return action.payload;
		default:
			return state;
	}
};
