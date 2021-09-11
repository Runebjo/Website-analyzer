export const reducer = (state, action) => {
	switch (action.type) {
		case 'SET_SEARCH_VALUE':
			return action.payload;
		default:
			return state;
	}
};
