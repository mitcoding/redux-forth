import Word from "./Word";

export default class Minus extends Word {
	constructor(type = "-", comment = "(n1 n2 -- n1-n2)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			topInt = state.pop(),
			nextInt = state.pop()
		;

		state.push(nextInt - topInt);
		return state;
	}
}