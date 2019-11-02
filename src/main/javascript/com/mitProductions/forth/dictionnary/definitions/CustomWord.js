import Word from "./Word";

export default class CustomWord extends Word {
	constructor(type, comment, payload) {
		super(type, comment);
		this.payload = payload;
	}
}