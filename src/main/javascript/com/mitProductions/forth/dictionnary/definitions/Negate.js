import Word from "./Word";

export default class Negate extends Word {
	constructor(type = "NEGATE", comment = "(n -- -n)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var topInt = state.pop();
		state.push(topInt * -1);
		return state;
	}
}