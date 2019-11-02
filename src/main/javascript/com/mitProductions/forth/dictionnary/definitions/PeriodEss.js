import Print from "./Print";

export default class PeriodEss extends Print {
	constructor(type = ".S", comment) {
		super(type, comment);
	}
	
	process(command, index, store, next) {
		let integerStack = [...store.getState().integerStack];
		this.payload = integerStack;
		next(this);
		return this;
	}
}