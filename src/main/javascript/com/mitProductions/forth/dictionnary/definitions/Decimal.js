import NumberWord from "./NumberWord";
import Word from "./Word"

export default class Decimal extends Word {
	constructor(type = "DECIMAL", comment = "( n1 -- d1 )") {
		super(type, comment);
	}
	
	modifyDictionary(state) {
		state.mode = NumberWord.DEC;
		return state;
	}

	modifyIntegerStack(state) {
		state.stack.forEach((value, i) => {
			state.stack[i] = NumberWord.create(value, state.mode).toDecimal();
		});

		state.mode = NumberWord.DEC;
		return state;
	}	
}