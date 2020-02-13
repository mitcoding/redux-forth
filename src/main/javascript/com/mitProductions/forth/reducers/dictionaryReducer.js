import NumberWord from "../dictionnary/definitions/NumberWord";

export const dictionaryReducer = function(state={stack: [], mode: NumberWord.DEC}, action) {
	state = {...state, terms: {...state.terms}, stack: [...state.stack] };

	action = action.word || action;
	if (action.modifyDictionary) {
		return action.modifyDictionary(state);
	}

	return state;
};