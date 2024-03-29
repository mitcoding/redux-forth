import Word from "./Word";

export default class Negate extends Word {
	constructor(type = "NEGATE", comment = "(n -- -n)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var topInt = state.popAsDecimal();

		state.pushDecimal(topInt * -1);
		return state;
	}
}