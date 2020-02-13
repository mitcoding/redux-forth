import CustomWord from "./CustomWord";

export default class RemoveCustomWord extends CustomWord {
	modifyDictionary(state) { 
		let 
			command = state.terms[this.type],
			index = command.indexes[command.indexes.length - 1],
			stack = state.stack.slice(0, index),
			wordsToRemove = state.stack.slice(index)
		;

		wordsToRemove.forEach(function(word) {
			state.terms[word.type].indexes.pop();

			if (state.terms[word.type].indexes.length === 0) {
				delete state.terms[word.type];
			}					
		});

		state.stack = stack;
		return state; 
	}
}