import AbortCompile from "./AbortCompile";
import TreeWord from "./TreeWord";

export default class Else extends TreeWord {
	constructor(type = "ELSE", comment) {
		super(type, comment);
	}
	
	build(buildTree, command) {

		if (buildTree.currentCondition.type.toUpperCase() !== "IF") {
			buildTree.currentCondition.closeNode.call(this, buildTree, command);
			return buildTree.next(new AbortCompile() );
		}

		buildTree.currentCondition = buildTree.stack.pop();
		buildTree.currentCondition["else"] = [];
		buildTree.stack.push(buildTree.currentCondition);

		return this;
	}
}