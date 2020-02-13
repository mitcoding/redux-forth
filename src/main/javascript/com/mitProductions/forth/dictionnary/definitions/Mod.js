import Word from "./Word";

export default class Mod extends Word {
	constructor(type = "MOD", comment = "(n1 n2 -- n3)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			stack = state.stack,
			topInt = stack.pop(),
			nextInt = stack.pop()
		;

		stack.push(nextInt % topInt);
		return state;
	}
}