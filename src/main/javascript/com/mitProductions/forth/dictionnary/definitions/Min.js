import Word from "./Word";

export default class Min extends Word {
	constructor(type = "MIN", comment = "(n1 n2 -- n3)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var
			topInt = state.pop(),
			nextInt = state.pop()
		;

		state.push(Math.min(topInt, nextInt) );
		return state;
	}
}