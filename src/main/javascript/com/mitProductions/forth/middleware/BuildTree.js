import Print from "../dictionnary/definitions/Print";

const WHITE_SPACE_REGEX = /\s+/gi;
export class BuildTree {
	constructor(action, next, store, dictionaryService) {
		this.action = action;
		this.dictionaryService = dictionaryService;
		this.next = next;
		this.store = store;
		this.commands = (action.type + "").split(WHITE_SPACE_REGEX);
		this.index = 0;
		this.totalCommands = this.commands.length;
		this.stack = store.getState().compileStack;
		this.currentCondition = this.stack[this.stack.length - 1];
	}

	run() {
		let buildTree = this;

		for (buildTree.index = 0; buildTree.index < buildTree.totalCommands; buildTree.index++) {
			let 
				command = this.commands[this.index],
				action = this.dictionaryService.searchAll(command, buildTree.store.getState().dictionary, true)
			;

			action.build(buildTree, command);
		}
		
		printExecutionStatus(buildTree);
	}
}

function printExecutionStatus(buildTree) {
	let 
		displayStack = buildTree.store.getState().displayStack,
		print = new Print(),
		status = "ok"
	;

	if (displayStack.length > 0 && displayStack[displayStack.length - 1] !== "\r") {
		print.payload.push("\r");
	}

	const isATreeWordOpen = buildTree.stack.length > 1;
	if (isATreeWordOpen) {
		let branchDepth = buildTree.stack.length - 1;
		status = buildTree.stack[branchDepth].type + " " + branchDepth + " ]";
	}

	print.payload.push(status);
	buildTree.next(print);
}