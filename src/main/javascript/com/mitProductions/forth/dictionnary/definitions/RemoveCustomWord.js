import CustomWord from "./CustomWord";

export default class RemoveCustomWord extends CustomWord {
	modifyDictionary(state) { 
		let 
			command = state[this.type],
			index = command.indexes[command.indexes.length - 1],
			stack = state.stack.slice(0, index),
			wordsToRemove = state.stack.slice(index)
		;

		wordsToRemove.forEach(function(word) {
			state[word.type].indexes.pop();

			if (state[word.type].indexes.length === 0) {
				delete state[word.type];
			}					
		});

		state.stack = stack;
		return state; 
	}
}