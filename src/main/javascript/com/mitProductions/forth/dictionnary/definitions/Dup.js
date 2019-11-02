import Word from "./Word";

export default class Dup extends Word {
	constructor(type = "DUP", comment = "(n -- n n)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		state.push(state[state.length - 1]);
		return state;
	}
}