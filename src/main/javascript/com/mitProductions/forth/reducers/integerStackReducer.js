import NumberStack from "../stack/NumberStack";
import NumberWord from "../dictionnary/definitions/NumberWord";
import DictionaryService from "../dictionnary/search/DictionaryService";

function isNotANumber(value, mode) {
	if (NumberWord.create(value, mode) instanceof NumberWord) {
		return false;
	}

	return isNaN(value);
}

export const integerStackReducer = function(state = new NumberStack(), action) {
	
	action = action.word || action;
	if (action.modifyIntegerStack) {
		state = action.modifyIntegerStack(state.clone(), new DictionaryService() );
		
		return isNotANumber(state.getLastItem(), state.mode) ? (state.pop(), state) : state;
	}

	return state;
};