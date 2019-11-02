import Word from "./Word";

export default class CarriageReturn extends Word {
	constructor(type = "CR", comment) {
		super(type, comment);
	}
	
	modifyDisplayStack(state) {
		state.push("\r");
		return state;
	}
}