import AbortCompile from "./AbortCompile";
import StackUnderFlowError from "../../exceptions/StackUnderFlowError";
import TreeWord from "./TreeWord";

export default class If extends TreeWord {
	constructor(type = "IF", comment = "(flag -- )") {
		super(type, comment);
	}

	addChildNode(returnAction) {
		if (returnAction.type) {
			if (this.else) {
				this.else.push(returnAction);
			} else {
				this.payload.push(returnAction);
			}
		}

		return returnAction;
	}

	build(buildTree, command) {
		return buildTree.currentCondition.openNode(buildTree, command);
	}

	closeNode(buildTree, command) {
		if (command.toUpperCase() !== "THEN") {
			buildTree.stack[0].closeNode.call(this, buildTree, command);
			return buildTree.next(new AbortCompile() );
		}

		return super.closeNode(buildTree, command);
	}

	openNode(buildTree, command) {
		buildTree.currentCondition = this.addChildNode(buildTree.dictionaryService.searchDefault(command, buildTree.store.getState().integerStack.mode) );
		buildTree.stack.push(buildTree.currentCondition);
	}

	process(commands, index, store, next, processTree, dictionaryService) {
		let
			mode = store.getState().integerStack.mode,
			flag = store.getState().integerStack.clone().pop()
		;

		if (isNaN(flag) ) { 
			next( new StackUnderFlowError() );
			return this;
		}

		next(dictionaryService.searchDefault("DROP"), mode);

		let 
			command = commands[index],
			else_commands = command.else, 
			if_commands = command.payload,
			isIfConditionTrue = (flag !== 0)
		;
		
		if (isIfConditionTrue) {
			processTree(if_commands, next, store)
		} else if (else_commands !== undefined) {
			processTree(else_commands, next, store);
		}

		return this;
	}	
}