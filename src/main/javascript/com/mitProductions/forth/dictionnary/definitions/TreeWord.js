import Word from "./Word";

export default class TreeWord extends Word {
	constructor(type, comment, command) {
		super(type, comment, command);
		this.payload = [];
	}

	addChildNode(returnAction) {
		if (returnAction.type) {
			this.payload.push(returnAction);
		}

		return returnAction;
	}

	openNode(buildTree, command) {	
		this.payload.push(buildTree.dictionaryService.searchDefault(command) );
		buildTree.currentCondition = buildTree.currentCondition.payload[buildTree.currentCondition.payload.length - 1];

		buildTree.stack.push(buildTree.currentCondition);
	}

	closeNode(buildTree) {
		buildTree.stack.pop();
		buildTree.currentCondition = buildTree.stack[buildTree.stack.length - 1];
		buildTree.currentCondition.addChildNode({}, buildTree.next, buildTree.store);
	}
}