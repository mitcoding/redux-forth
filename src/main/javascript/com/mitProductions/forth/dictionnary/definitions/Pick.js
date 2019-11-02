import Word from "./Word";

export default class Pick extends Word {
	constructor(type = "PICK", comment = "(n -- nth_number)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			topInt = state[state.length - 1],
			copyInt = state[state.length - (topInt + 1)]
		;
		
		state.push(copyInt);
		return state;
	}
}