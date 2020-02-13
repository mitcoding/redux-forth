import Word from "./Word";

export default class Pick extends Word {
	constructor(type = "PICK", comment = "(n -- nth_number)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			index = (state.length() - 1) - (state.popAsDecimal() + 1),
			copyInt = state.getByIndex(index)
		;

		state.push(copyInt);
		return state;
	}
}