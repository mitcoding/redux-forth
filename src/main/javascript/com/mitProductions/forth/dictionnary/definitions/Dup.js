import Word from "./Word";

export default class Dup extends Word {
	constructor(type = "DUP", comment = "(n -- n n)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		return state.push(state.getLastItem() );
	}
}