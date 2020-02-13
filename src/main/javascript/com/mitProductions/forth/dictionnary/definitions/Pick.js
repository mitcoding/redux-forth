import Word from "./Word";

export default class Pick extends Word {
	constructor(type = "PICK", comment = "(n -- nth_number)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			stack = state.stack,
			topInt = stack[stack.length - 1],
			copyInt = stack[stack.length - (topInt + 1)]
		;
		
		stack.push(copyInt);
		return state;
	}
}