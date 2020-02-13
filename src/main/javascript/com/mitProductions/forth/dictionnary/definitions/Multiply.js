import Word from "./Word";

export default class Multiply extends Word {
	constructor(type = "*", comment = "(n1 n2 -- n1*n2)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var
			topInt = state.popAsDecimal(),
			nextInt = state.popAsDecimal()
		;
		
		state.pushDecimal(nextInt * topInt);
		return state;
	}
}