import Word from "./Word";

export default class Print extends Word {
	constructor(type = "PRINT", comment) {
		super(type, comment);
		this.payload = [];
		this.printCarrageReturn = false;
	}

	modifyDisplayStack(state) {
		return state.concat(this.payload).concat(this.printCarrageReturn === true ? "\r" : " " );
	}
}