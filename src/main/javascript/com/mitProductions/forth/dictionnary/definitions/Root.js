import ControlStructureMismatchError from "../../exceptions/ControlStructureMismatchError";
import DictionaryService from "../search/DictionaryService";
import TreeWord from "./TreeWord";

const processCommands = function(commands, next, store, hasSearchedDictionary = false) { 

	let 
		dictionaryService = new DictionaryService(),
		totalCommands = commands.length
	;

	for (let index = 0; index < totalCommands; index++) {
		let
			command = commands[index],
			action = hasSearchedDictionary === false ? dictionaryService.searchAll(command, store.getState().dictionary) : command;
		;
			
		if (Array.isArray(action) ) {
			processCommands(action, next, store, true);
			continue;
		}

		action.process(commands, index, store, next, processCommands, dictionaryService);		
	}
};

export default class Root extends TreeWord {
	constructor(type = "ROOT", comment) {
		super(type, comment);
		this.root = true;
	}

	addChildNode(returnAction, next, store) {
		super.addChildNode(returnAction, next, store);
		processCommands([this.payload.pop()], next, store);
	}

	closeNode(buildTree) {
		buildTree.index = buildTree.commands.length;
		return buildTree.next(new ControlStructureMismatchError(buildTree.commands[buildTree.index]) );
	}	
}