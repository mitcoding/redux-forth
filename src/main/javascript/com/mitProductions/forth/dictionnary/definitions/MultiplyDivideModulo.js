import Word from "./Word";

export default class MultiplyDivideModulo extends Word {
	constructor(type = "*/MOD", comment = "(n1 n2 n3 -- (n1*n2)%n3=n4 (n1*n2)/n3=n5)") {
		super(type, comment);
	}

	modifyIntegerStack(state, dictionaryService) {
		var 
			topInt = state.popAsDecimal(),
			divState
		;

		state = dictionaryService.searchDefault("*").modifyIntegerStack(state);
		state.pushDecimal(topInt);
		
		divState = dictionaryService.searchDefault("/").modifyIntegerStack(state.clone() );
		state = dictionaryService.searchDefault("MOD").modifyIntegerStack(state);
		state.pushDecimal(divState.popAsDecimal() );
		return state;
	}
}