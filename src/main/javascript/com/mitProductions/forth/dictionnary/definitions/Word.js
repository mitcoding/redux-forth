export default class Word {
	constructor(type, comment = "( -- )") {
		this.type = type === undefined ? undefined : type + "";
		this.comment = comment.trim();
	}

	build(buildTree, command) {
		let word = buildTree.dictionaryService.searchAll(command, buildTree.store.getState().dictionary, true);

		buildTree.currentCondition.addChildNode(
			buildTree.dictionaryService.addCustomDefinitionStackIndex(word, buildTree.store.getState().dictionary.stack),
			buildTree.next,
			buildTree.store
		);
		
	}

	modifyIntegerStack(state) { return state; }

	process(commands, index, store, next) {
		next(this);
		return this;
	}
}