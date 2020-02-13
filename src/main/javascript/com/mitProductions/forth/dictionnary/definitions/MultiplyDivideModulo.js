import Word from "./Word";

export default class MultiplyDivideModulo extends Word {
	constructor(type = "*/MOD", comment = "(n1 n2 n3 -- (n1*n2)%n3=n4 (n1*n2)/n3=n5)") {
		super(type, comment);
	}

	modifyIntegerStack(state, dictionaryService) {
		var 
			topInt = state.pop(),
			divState
		;

		state = dictionaryService.searchDefault("*").modifyIntegerStack(state);
		state.push(topInt);
		
		divState = dictionaryService.searchDefault("/").modifyIntegerStack(state.clone() );
		state = dictionaryService.searchDefault("MOD").modifyIntegerStack(state);
		state.push(divState.pop() );
		return state;
	}
}