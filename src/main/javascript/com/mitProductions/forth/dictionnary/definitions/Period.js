import Print from "./Print";

export default class Period extends Print {
	constructor(type = ".", comment = "(n -- )") {
		super(type, comment);
	}
	
	modifyIntegerStack(state) {
		state.pop();
		return state;
	}

	process(command, index, store, next) {
		let integerStack = [...store.getState().integerStack];
		this.payload.push(integerStack.pop() );

		next(this);
		return this;
	}
}