import Root from "../dictionnary/definitions/Root";

const reset = function() {
	return [new Root("ROOT")];
}

export const compileStackReducer = function(state = [new Root("ROOT")], action) {
	state = [...state];
	state.reset = reset;
	action = action.word || action;
	if (action.modifyCompileStack) {
		return action.modifyCompileStack(state);
	}

	return state;
};