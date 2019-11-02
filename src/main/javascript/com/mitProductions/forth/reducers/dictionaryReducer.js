export const dictionaryReducer = function(state={stack: []}, action) {
	state = {...state, stack: [...state.stack] };

	action = action.word || action;
	if (action.modifyDictionary) {
		return action.modifyDictionary(state);
	}

	return state;
};