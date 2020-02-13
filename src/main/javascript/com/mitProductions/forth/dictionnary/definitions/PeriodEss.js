import Print from "./Print";
import EmptyStackError from "../../exceptions/EmptyStackError"

export default class PeriodEss extends Print {
	constructor(type = ".S", comment) {
		super(type, comment);
	}
	
	process(command, index, store, next) {
		let integerStack = [...store.getState().integerStack.stack];

		if (integerStack.length === 0) {
			next(new EmptyStackError() );
			return this;
		}

		this.payload = integerStack.reduce((array, item) => array.concat(item, " "), []).slice(0, -1);
		next(this);
		

		return this;
	}
}