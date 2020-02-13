import Word from "./Word";

export default class Mod extends Word {
	constructor(type = "MOD", comment = "(n1 n2 -- n3)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			topInt = state.popAsDecimal(),
			nextInt = state.popAsDecimal()
		;

		state.pushDecimal(nextInt % topInt);
		return state;
	}
}