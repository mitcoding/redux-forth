import Word from "./Word";

export default class Page extends Word {
	constructor(type = "PAGE", comment) {
		super(type, comment);
	}
	
	modifyDisplayStack() {
		return [];
	}
}