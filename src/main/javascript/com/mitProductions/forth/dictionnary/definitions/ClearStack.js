import Word from "./Word";

export default class ClearStack extends Word {
	constructor(type = "CLEARSTACK", comment = "( ... -- )") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		state.stack = [];
		return state;
	}
}