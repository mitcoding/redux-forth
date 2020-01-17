export const displayStackReducer = function(state = ["ok"], action) {
	state = [...state];
	
	action = action.word || {};
	if (action.modifyDisplayStack) {
		return action.modifyDisplayStack(state);
	}

	return state;
};