import Word from "./Word";

export default class Rot extends Word {
	constructor(type = "ROT", comment = "(n1 n2 n3 -- n2 n3 n1)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			stack = state.stack,
			removeIndex = stack.length - 3,
			nextInt = stack[removeIndex]
		;
		
		state.stack = stack.filter(function(value, index) { return index !== removeIndex; });
		state.stack.push(nextInt);
		
		return state;
	}
}