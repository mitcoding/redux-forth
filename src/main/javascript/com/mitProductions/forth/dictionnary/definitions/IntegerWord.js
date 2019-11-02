import Word from "./Word";

export default class IntegerWord extends Word {
	modifyIntegerStack(state) {
		state.push(this.type * 1);
		return state;
	}
}