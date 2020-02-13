import Word from "./Word";

export default class SpecialIntegerWord extends Word {
	constructor(type, specialDigitCommandMatch) {
		super(type);
		this.specialDigitCommandMatch = specialDigitCommandMatch;
	}

	modifyIntegerStack(state, dictionaryService) {
		let command = this.specialDigitCommandMatch[2];
		
		state.pushDecimal(this.specialDigitCommandMatch[1] * 1);
		return dictionaryService
			.searchDefault(command, state.mode)
			.modifyIntegerStack(state, dictionaryService)
		;
	}
}