import Word from "./Word";

export default class Rot extends Word {
	constructor(type = "ROT", comment = "(n1 n2 n3 -- n2 n3 n1)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			removeIndex = state.length() - 3,
			nextInt = state.getByIndex(removeIndex)
		;
		
		state = state.filter(function(value, index) { return index !== removeIndex; });
		state.push(nextInt);
		
		return state;
	}
}