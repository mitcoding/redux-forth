import Word from "./Word";

export default class Over extends Word {
	constructor(type = "OVER", comment = "(n1 n2 -- n1 n2 n1)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var nextInt = state[state.length - 2];
		state.push(nextInt);
		return state;
	}
}