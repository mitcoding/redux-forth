import Word from "./Word";

export default class MultiplyDivideModulo extends Word {
	constructor(type = "*/MOD", comment = "(n1 n2 n3 -- (n1*n2)%n3=n4 (n1*n2)/n3=n5)") {
		super(type, comment);
	}

	modifyIntegerStack(state, dictionaryService) {
		var 
			stack = state.stack,
			topInt = stack.pop(),
			divState
		;

		state = dictionaryService.searchDefault("*").modifyIntegerStack(state);
		stack.push(topInt);
		divState = dictionaryService.searchDefault("/").modifyIntegerStack({...state, stack: [...state.stack] });
		state = dictionaryService.searchDefault("MOD").modifyIntegerStack(state);
		stack.push(divState.stack.pop() );
		return state;
	}
}