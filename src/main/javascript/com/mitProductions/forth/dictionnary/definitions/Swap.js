import Word from "./Word";

export default class Swap extends Word {
	constructor(type = "SWAP", comment = "(n1 n2 -- n2 n1)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			stack = state.stack,
			topInt = stack.pop(),
			nextInt = stack.pop()
		;
		
		stack.push(topInt);
		stack.push(nextInt);
		return state;
	}
}