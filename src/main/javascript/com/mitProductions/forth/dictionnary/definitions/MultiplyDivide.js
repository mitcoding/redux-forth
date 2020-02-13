import Word from "./Word";

export default class MultiplyDivide extends Word {
	constructor(type = "*/", comment = "(n1 n2 n3 -- (n1*n2)/n3)") {
		super(type, comment);
	}

	modifyIntegerStack(state, dictionaryService) {
		var topInt = state.popAsDecimal();

		state = dictionaryService.searchDefault("*").modifyIntegerStack(state);
		state.pushDecimal(topInt);
		return dictionaryService.searchDefault("/").modifyIntegerStack(state);
	}
}