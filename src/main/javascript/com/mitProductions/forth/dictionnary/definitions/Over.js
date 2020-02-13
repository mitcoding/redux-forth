import Word from "./Word";

export default class Over extends Word {
	constructor(type = "OVER", comment = "(n1 n2 -- n1 n2 n1)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			stack = state.stack,
			nextInt = stack[stack.length - 2]
		;

		stack.push(nextInt);
		return state;
	}
}