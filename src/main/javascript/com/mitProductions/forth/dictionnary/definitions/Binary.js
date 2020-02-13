import NumberWord from "./NumberWord";
import Word from "./Word";

export default class Binary extends Word {
	constructor(type = "BINARY", comment = "( n1 -- b1 )") {
		super(type, comment);
	}
	
	modifyDictionary(state) {
		state.mode = NumberWord.BIN;
		return state;
	}

	modifyIntegerStack(state) {
		state.stack.forEach((value, i) => {
			state.stack[i] = NumberWord.create(value, state.mode).toBinary();
		});

		state.mode = NumberWord.BIN;
		return state;
	}	
}