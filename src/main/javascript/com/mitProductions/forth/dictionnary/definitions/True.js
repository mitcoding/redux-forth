import Word from "./Word";

export default class True extends Word {
	constructor(type = "TRUE", comment = "( -- flag)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		state.push(-1);
		return state;
	}
}