import Word from "./Word";

export default class GreaterThan extends Word {
	constructor(type = ">", comment = "(n1 n2 -- (n1>n2)=flag)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var
			topInt = state.popAsDecimal(),
			nextInt = state.popAsDecimal()
		;
		
		state.pushDecimal(nextInt > topInt ? -1 : 0);
		return state;
	}
}