import Word from "./Word";

export default class Abs extends Word {
	constructor(type = "ABS", comment = "(n -- -n)") {
		super(type, comment);
	}
	
	modifyIntegerStack(state) {
		state.push(Math.abs(state.pop() ) );
		return state;
	}
}