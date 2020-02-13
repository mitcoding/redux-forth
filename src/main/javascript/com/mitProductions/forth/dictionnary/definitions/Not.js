import Word from "./Word";

export default class Not extends Word {
	constructor(type = "NOT", comment = "(flag1 -- flag2)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var topInt = state.popAsDecimal();

		state.pushDecimal(topInt === 0 ? -1 : 0);
		return state;
	}
}