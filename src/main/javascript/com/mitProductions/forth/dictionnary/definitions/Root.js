import ControlStructureMismatchError from "../../exceptions/ControlStructureMismatchError";
import TreeWord from "./TreeWord";

import { processTree } from "../../middleware/processTree";

export default class Root extends TreeWord {
	constructor(type = "ROOT", comment) {
		super(type, comment);
		this.root = true;
	}

	addChildNode(returnAction, next, store) {
		super.addChildNode(returnAction, next, store);
		processTree([this.payload.pop()], next, store);
	}

	closeNode(buildTree) {
		buildTree.index = buildTree.commands.length;
		return buildTree.next(new ControlStructureMismatchError(buildTree.commands[buildTree.index]) );
	}	
}