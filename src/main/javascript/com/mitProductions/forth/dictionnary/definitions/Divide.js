import Word from "./Word";

export default class Divide extends Word {
	constructor(type = "/", comment = "(n1 n2 -- n1/n2)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var
			topInt = state.pop(),
			nextInt = state.pop()
		;
		
		state.push(Math.floor(nextInt / topInt) );
		return state;
	}
}