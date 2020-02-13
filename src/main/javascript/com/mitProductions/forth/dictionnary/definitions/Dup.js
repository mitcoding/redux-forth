import Word from "./Word";

export default class Dup extends Word {
	constructor(type = "DUP", comment = "(n -- n n)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		let stack = state.stack;

		stack.push(stack[stack.length - 1]);
		return state;
	}
}