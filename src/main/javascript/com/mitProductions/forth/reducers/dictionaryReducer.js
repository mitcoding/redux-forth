export const dictionaryReducer = function(state={stack: [], mode: "dec"}, action) {
	state = {...state, terms: {...state.terms}, stack: [...state.stack] };

	action = action.word || action;
	if (action.modifyDictionary) {
		return action.modifyDictionary(state);
	}

	return state;
};