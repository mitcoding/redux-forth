import TreeWord from "./TreeWord";

export default class LeftParenthesis extends TreeWord {
	constructor(type = "(", comment) {
		super(type, comment);
	}
	
	build(buildTree, command) {
		return buildTree.currentCondition.openNode(buildTree, command);
	}

	process() {
		return this;
	}
}