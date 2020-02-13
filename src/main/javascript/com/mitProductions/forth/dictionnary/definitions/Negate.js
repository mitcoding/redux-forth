import Word from "./Word";

export default class Negate extends Word {
	constructor(type = "NEGATE", comment = "(n -- -n)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var
			stack = state.stack, 
			topInt = stack.pop()
		;

		stack.push(topInt * -1);
		return state;
	}
}