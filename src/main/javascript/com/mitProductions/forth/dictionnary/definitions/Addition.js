import Word from "./Word";

export default class Addition extends Word {
	constructor(type = "+", comment = "(n1 n2 -- n1+n2)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var
			stack = state.stack,
			topInt = stack.pop(),
			nextInt = stack.pop()
		;
		
		stack.push(nextInt + topInt);
		return state;
	}
}