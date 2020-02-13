import Print from "./Print";

export default class Period extends Print {
	constructor(type = ".", comment = "(n -- )") {
		super(type, comment);
	}
	
	modifyIntegerStack(state) {
		state.stack.pop();
		return state;
	}

	process(command, index, store, next) {
		let integerStack = [...store.getState().integerStack.stack];
		this.payload.push(integerStack.pop() );

		next(this);
		return this;
	}
}