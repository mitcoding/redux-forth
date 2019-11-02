import TreeWord from "./TreeWord";

export default class CloseTreeWord extends TreeWord {
	build(buildTree, command) {
		return buildTree.currentCondition.closeNode(buildTree, command);
	}
}