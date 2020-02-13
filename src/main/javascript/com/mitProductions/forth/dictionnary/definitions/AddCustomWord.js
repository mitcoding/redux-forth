import CustomWord from "./CustomWord";

export default class AddCustomWord extends CustomWord {
	modifyDictionary(state) {
		state.stack.push(new CustomWord(this.type, this.comment, this.payload) );
		let command = state.terms[this.type] = Object.assign({ indexes: [] }, {...state.terms[this.type]});
		
		command.indexes = [...command.indexes];
		command.indexes.push(state.stack.length - 1);
		
		return state;
	}
}