import NumberWord from "./NumberWord";
import Word from "./Word";

export default class Hex extends Word {
	constructor(type = "HEX", comment = "( n1 -- h1 )") {
		super(type, comment);
	}
	
	modifyDictionary(state) {
		state.mode = NumberWord.HEX;
		return state;
	}

	modifyIntegerStack(state) {
		state.stack.forEach((value, i) => {
			state.stack[i] = NumberWord.create(value, state.mode).toHex();
		});

		state.mode = NumberWord.HEX;
		return state;
	}
}