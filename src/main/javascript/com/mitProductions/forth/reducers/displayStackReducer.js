export const displayStackReducer = function(state=[], action) {
	state = [...state];
	
	action = action.word || {};
	if (action.modifyDisplayStack) {
		return action.modifyDisplayStack(state);
	}

	return state;
};