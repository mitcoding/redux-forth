import NumberWord from "../dictionnary/definitions/NumberWord";
import DictionaryService from "../dictionnary/search/DictionaryService";

function isNotANumber(value, mode) {
	if (NumberWord.create(value, mode) instanceof NumberWord) {
		return false;
	}

	return isNaN(value);
}

export const integerStackReducer = function(state={ stack: [], mode: "dec" }, action) {
	state = {...state, stack: [...state.stack] };

	action = action.word || action;
	if (action.modifyIntegerStack) {
		state = action.modifyIntegerStack(state, new DictionaryService() );
		
		return isNotANumber(state.stack[state.stack.length - 1], state.mode) ? (state.stack.pop(), state) : state;
	}

	return state;
};