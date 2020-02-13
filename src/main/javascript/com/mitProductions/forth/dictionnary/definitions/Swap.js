import Word from "./Word";

export default class Swap extends Word {
	constructor(type = "SWAP", comment = "(n1 n2 -- n2 n1)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			topInt = state.pop(),
			nextInt = state.pop()
		;
		
		state.push(topInt);
		state.push(nextInt);
		return state;
	}
}