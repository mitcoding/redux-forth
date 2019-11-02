import Word from "./Word";

export default class AbortCompile extends Word {
	constructor(type = "ABORTCOMPILE", comment) {
		super(type, comment);
	}
	
	modifyCompileStack(state) {
		return state.reset();
	}
}