import AbortCompile from "./AbortCompile";
import NumberWord from "./NumberWord";
import TreeWord from "./TreeWord";

export default class Do extends TreeWord {
	constructor(type = "DO", comment = "(limit starting_value -- )") {
		super(type, comment);
	}

	build(buildTree, command) {
		return buildTree.currentCondition.openNode(buildTree, command);
	}

	closeNode(buildTree, command) {
		if (command.toUpperCase() !== "LOOP") {
			buildTree.stack[0].closeNode.call(this, buildTree, command);
			return buildTree.next(new AbortCompile() );
		}

		return super.closeNode(buildTree, command);
	}

	process(commands, index, store, next, processTree, dictionaryService) {
		let 
			command = commands[index],
			mode = store.getState().integerStack.mode,
			state = store.getState().integerStack.clone(),
			startingValue = state.pop(),
			limit  = state.pop(),
			showIndex = (command.payload[0].type.toUpperCase() === "I"),
			loopCommands = showIndex ? command.payload.slice(1) : command.payload
		;

		next(dictionaryService.searchDefault("DROP"), mode);
		next(dictionaryService.searchDefault("DROP"), mode);

		do {
			if (showIndex) {
				next(NumberWord.create(startingValue, mode) );
			}

			processTree(loopCommands, next, store);
		
		} while (++startingValue < limit);

		return this;
	}
}