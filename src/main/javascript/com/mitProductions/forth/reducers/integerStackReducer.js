import DictionaryService from "../dictionnary/search/DictionaryService";

export const integerStackReducer = function(state=[], action) {
	state = [...state];
	
	action = action.word || action;
	if (action.modifyIntegerStack) {
		state = action.modifyIntegerStack(state, new DictionaryService() );
		return isNaN(state[state.length - 1]) ? (state.pop(), state) : state;
	}

	return state;
};