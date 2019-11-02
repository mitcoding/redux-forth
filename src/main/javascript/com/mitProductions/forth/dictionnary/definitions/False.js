import Word from "./Word";

export default class False extends Word {
	constructor(type = "FALSE", comment = "( -- flag)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		state.push(0);
		return state;
	}
}