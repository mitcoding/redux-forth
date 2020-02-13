import Word from "./Word";

export default class And extends Word {
	constructor(type = "AND", comment = "(flag flag -- flag)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var 
			topFlag = state.popAsDecimal() !== 0 ? true : false,
			nextFlag = state.popAsDecimal() !== 0 ? true : false
		;

		state.pushDecimal((topFlag & nextFlag) ? -1 : 0);
		return state;
	}
}