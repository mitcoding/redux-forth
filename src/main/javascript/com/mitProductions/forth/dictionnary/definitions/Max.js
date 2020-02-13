import Word from "./Word";

export default class Max extends Word {
	constructor(type = "MAX", comment = "(n1 n2 -- n3)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			topInt = state.popAsDecimal(),
			nextInt = state.popAsDecimal()
		;

		state.pushDecimal(Math.max(topInt, nextInt) );
		return state;
	}
}