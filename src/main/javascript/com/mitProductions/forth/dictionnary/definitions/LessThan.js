import Word from "./Word";

export default class LessThan extends Word {
	constructor(type = "<", comment = "(n1 n2 -- (n1<n2)=flag)") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		var
			topInt = state.pop(),
			nextInt = state.pop()
		;
		
		state.push(nextInt < topInt ? -1 : 0);
		return state;
	}
}