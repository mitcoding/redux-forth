import DictionaryService from "../dictionnary/search/DictionaryService";

export const processTree = function(commands, next, store, hasSearchedDictionary = false) { 

	let 
		dictionaryService = new DictionaryService(),
		totalCommands = commands.length
	;

	for (let index = 0; index < totalCommands; index++) {
		let
			command = commands[index].type.trim(),
			action = hasSearchedDictionary === false ? dictionaryService.searchAll(command, store.getState().dictionary) : commands[index];
		;
			
		if (Array.isArray(action) ) {
			processTree(action, next, store, true);
			continue;
		}

		action.process(commands, index, store, next, processTree, dictionaryService);		
	}
};