import CustomWord from "./CustomWord";

export default class ForgetAll extends CustomWord {
	constructor(type = "FORGETALL", comment) {
		super(type, comment);
	}
	
	modifyDictionary() {
		return { stack: [] };
	}	
}