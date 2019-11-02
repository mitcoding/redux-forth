import Word from "./Word";

export default class Print extends Word {
	constructor(type = "PRINT", comment) {
		super(type, comment);
		this.payload = [];
	}

	modifyDisplayStack(state) {
		return state.concat(this.payload);
	}
}