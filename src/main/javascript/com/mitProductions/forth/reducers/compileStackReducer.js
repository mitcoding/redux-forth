import Root from "../dictionnary/definitions/Root";

const reset = function() {
	return [new Root()];
}

export const compileStackReducer = function(state = [new Root()], action) {
	state = [...state];
	state.reset = reset;
	action = action.word || action;
	if (action.modifyCompileStack) {
		return action.modifyCompileStack(state);
	}

	return state;
};