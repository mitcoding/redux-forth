import Word from "./Word";

export default class Drop extends Word {
	constructor(type = "DROP", comment = "(n -- )") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		return state.slice(0, state.length() - 1);
	}
}