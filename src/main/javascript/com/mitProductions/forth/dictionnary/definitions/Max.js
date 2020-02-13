import Word from "./Word";

export default class Max extends Word {
	constructor(type = "MAX", comment = "(n1 n2 -- n3)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			stack = state.stack,
			topInt = stack.pop(),
			nextInt = stack.pop()
		;

		stack.push(Math.max(topInt, nextInt) );
		return state;
	}
}