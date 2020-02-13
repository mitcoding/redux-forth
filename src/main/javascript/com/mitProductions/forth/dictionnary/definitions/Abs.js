import Word from "./Word";

export default class Abs extends Word {
	constructor(type = "ABS", comment = "(n -- -n)") {
		super(type, comment);
	}
	modifyIntegerStack(state) {
		let stack = state.stack;

		stack.push(Math.abs(stack.pop() ) );
		return state;
	}
}