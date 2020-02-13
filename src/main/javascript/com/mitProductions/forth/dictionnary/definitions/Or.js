import Word from "./Word";

export default class Or extends Word {
	constructor(type = "OR", comment = "(flag flag -- flag)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			stack = state.stack,
			topFlag = stack.pop() !== 0 ? true : false,
			nextFlag = stack.pop() !== 0 ? true : false
		;

		stack.push((topFlag | nextFlag) ? -1 : 0);
		return state;
	}
}