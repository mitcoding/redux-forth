import StackUnderFlowError from  "../../exceptions/StackUnderFlowError";
import Word from "./Word";

export default class Emit extends Word {
	constructor(type = "EMIT", comment = "(n -- )") {
		super(type, comment);
		this.charCode;
	}

	modifyDisplayStack(state) {
		state.push(String.fromCharCode(this.charCode) )
		return state;
	}

	modifyIntegerStack(state) {
		state.pop();
		return state;
	}

	process(commands, index, store, next) {

		this.charCode = store.getState().integerStack.getLastItem();
		if (isNaN(this.charCode) ) {
			return next(new StackUnderFlowError() );
		}

		next(this);
		return this;
	}
}