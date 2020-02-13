import Word from "./Word";

export default class MultiplyDivide extends Word {
	constructor(type = "*/", comment = "(n1 n2 n3 -- (n1*n2)/n3)") {
		super(type, comment);
	}

	modifyIntegerStack(state, dictionaryService) {
		var
			stack = state.stack, 
			topInt = stack.pop()
		;

		state = dictionaryService.searchDefault("*").modifyIntegerStack(state);
		stack.push(topInt);
		return dictionaryService.searchDefault("/").modifyIntegerStack(state);
	}
}