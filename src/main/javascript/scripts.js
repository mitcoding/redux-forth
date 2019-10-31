import {applyMiddleware, combineReducers, createStore} from "redux";

const addCustomDefinitionStackIndex = (word, customDictionaryStack) => {
	let index = customDictionaryStack.length - 1;

	while(index > -1) {
		let customWord = customDictionaryStack[index];
		if (customWord.type.toUpperCase() === word.type.toUpperCase() ) {
			word.index = index;
			break;
		}

		index--;
	}

	return word;
};

const isPrimativeType = function (object) {
	return object === null || ({"bigint":1, "boolean":1, "number":1, "string":1, "symbol":1, "undefined":1})[(typeof object).toLowerCase()] ? true : false;
};

const isPrimativeWrapper = function(object) {
	return (object instanceof Number || object instanceof String || object instanceof Boolean) ? true : false;
}

const deepCopy = (object) => {
	if (isPrimativeType(object) ) {
		return object;
	}

	return Object.keys(object).reduce(function (output, key) {
		output[key] = deepCopy.call(this, object[key]);

		return output;
	}, isPrimativeWrapper(object) ? new object.constructor(object.valueOf() ) : new object.constructor() );
}

class ForthCommandError extends Error {
	constructor(command, message) {
		super(command + " " + message);
		this.getMessage = function() { return message; };
	}
}

class ControlStructureMismatchError extends ForthCommandError {
	constructor(command) {
		super(command, "Control structure mismatch");
	}
}

class StackUnderFlowError extends ForthCommandError {
	constructor(command) {
		super(command, "Stack Underflow");
	}
}

class UnexpectedEndOfLineError extends ForthCommandError {
	constructor(command) {
		super(command, "Unexpected end-of-line");
	}
}

class WordNotFoundError extends ForthCommandError {
	constructor(command) {
		super(command, command + " ?");
	}
}

class Word {
	constructor(type, comment, command, buildCommand) {
		this.type = type + "";
		if (comment !== undefined) { this.comment = comment; }
		if (command !== undefined) { this.command = command; }
		if (buildCommand !== undefined) { this.build = buildCommand; }
	}
	build(buildTree, command) {
		// eslint-disable-next-line no-use-before-define
		let word = searchDictionary(command, buildTree.store.getState().dictionary, true);
		if (word.type === "ERROR") {
			word = new Word(command);
		}

		buildTree.currentCondition.addChildNode(
			addCustomDefinitionStackIndex(word, buildTree.store.getState().dictionary.stack),
			buildTree.next,
			buildTree.store
		);
	}
}

class DigitWord extends Word {
	command(state) {
		state.push(this.type * 1);
		return state;
	}
}

class SpecialDigitWord extends Word {
	constructor(type, specialDigitCommandMatch) {
		super(type);
		this.specialDigitCommandMatch = specialDigitCommandMatch;
	}

	command(state) {
		let command = this.specialDigitCommandMatch[2];
		state.push(this.specialDigitCommandMatch[1] * 1);
		// eslint-disable-next-line no-use-before-define
		return numberStackReducer(state, { type: "EXECUTE_WORD", word: defaultDictionary[command.toUpperCase()] });
	}
}

class TreeWord extends Word {
	constructor(type, comment, command, buildCommand) {
		super(type, comment, command, buildCommand);
		this.payload = [];
	}

	addChildNode(returnAction) {
		if (returnAction.type) {
			this.payload.push(returnAction);
		}

		return returnAction;
	}

	openNode(buildTree, command) {
		
		/* disabling eslint's "no-use-before-define" rule
		 * because there is a circular reference with
		 * isInCustomDictionary and TreeWord class
		 */
		// eslint-disable-next-line no-use-before-define
		if (isInCustomDictionary(command, buildTree.store.getState().dictionary) ) {
			return this.addChildNode(new Word(command), buildTree.next, buildTree.store);				
		}
		
		/* disabling eslint's "no-use-before-define" rule
		 * because there is a circular reference with
		 * defaultDictionary and TreeWord class
		 */
		// eslint-disable-next-line no-use-before-define
		this.payload.push(new defaultDictionary[command.toUpperCase()].constructor(command));
		buildTree.currentCondition = buildTree.currentCondition.payload[buildTree.currentCondition.payload.length - 1];

		buildTree.stack.push(buildTree.currentCondition);
	}

	closeNode(buildTree) {
		buildTree.stack.pop();
		buildTree.currentCondition = buildTree.stack[buildTree.stack.length - 1];
		buildTree.currentCondition.addChildNode({}, buildTree.next, buildTree.store);
	}
}

class Root extends TreeWord {
	constructor(type, comment, command, buildCommand) {
		super(type, comment, command, buildCommand);
		this.root = true;
	}

	addChildNode(returnAction, next, store) {
		TreeWord.prototype.addChildNode.apply(this, arguments);
		
		/* disabling eslint's "no-use-before-define" rule
		 * because there is a circular reference with
		 * processTree and Root class
		 */
		// eslint-disable-next-line no-use-before-define
		processTree([this.payload.pop()], next, store);
		
	}

	closeNode(buildTree) {
		return buildTree.next({ type: "ERROR", payload: new ControlStructureMismatchError(buildTree.commands[buildTree.index]) });
	}	
}

class If extends TreeWord {
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

	openNode(buildTree, command) {
		
		/* disabling eslint's "no-use-before-define" rule
		 * because there is a circular reference with
		 * isInCustomDictionary and If class
		 */
		// eslint-disable-next-line no-use-before-define
		if (isInCustomDictionary(command, buildTree.store.getState().dictionary) ) {
			return this.addChildNode(new Word(command), buildTree.next, buildTree.store);				
		}

		/* disabling eslint's "no-use-before-define" rule
		 * because there is a circular reference with
		 * defaultDictionary and If class
		 */
		// eslint-disable-next-line no-use-before-define
		buildTree.currentCondition = this.addChildNode(new defaultDictionary[command.toUpperCase()].constructor(command) );
		buildTree.stack.push(buildTree.currentCondition);
	}	
}

class Colon extends TreeWord {
	openNode(buildTree, command) {
		
		if (buildTree.commands[buildTree.index - 1] === ":") {
			return this.addChildNode(new Word(command), buildTree.next, buildTree.store);				
		}

		TreeWord.prototype.openNode.apply(this, arguments);
	}
}

const WHITE_SPACE_REGEX = /\s+/gi;

const defaultDictionary = {
	"ABS" : new Word(
		"ABS",
		"(n -- -n)",
		function abs(state) {
			state.push(Math.abs(state.pop() ) );
			return state;
		}
	),
	"AND" : new Word(
		"AND",
		"(flag flag -- flag)",
		function and(state) {
			var 
				topFlag = state.pop() !== 0 ? true : false,
				nextFlag = state.pop() !== 0 ? true : false
			;

			state.push((topFlag & nextFlag) ? -1 : 0);
			return state;
		}
	),
	"CONSTANT" : new TreeWord(
		"CONSTANT",
		"( -- w)",
		function(name, command, next) {
			if (isNaN(command) ) {
				return next({ type: "ERROR", payload: new StackUnderFlowError() });
			}

			next(defaultDictionary["DROP"]);
			next({ type: "CREATE_NEW_COMMAND", payload: new Word(name.toUpperCase(), "( -- " + command + ")", [new DigitWord(command)]) });
		},
		function(buildTree, command) {
			if (buildTree.currentCondition.root) {
				return this.command(buildTree.commands[++buildTree.index].toUpperCase(), [...buildTree.store.getState().numberStack].pop(), buildTree.next);
			}

			return buildTree.currentCondition.addChildNode(new this.constructor(command) );
		}
			
	),
	"CR" : new Word("CR", "( -- )"),
	"DO" : new TreeWord(
		"DO",
		"(limit starting_value -- )",
		null,
		function(buildTree, command) {
			return buildTree.currentCondition.openNode(buildTree, command);
		}
	),
	"DUP" : new Word(
		"DUP",
		"(n -- n n)",
		function dup(state) {
			state.push(state[state.length - 1]);
			return state;
		}
	),
	"DROP" : new Word(
		"DROP",
		"(n -- )",
		function drop(state) {
			return state.slice(0, state.length - 1);
		}
	),
	"ELSE" : new TreeWord(
		"ELSE",
		"( -- )",
		null,
		function(buildTree, command) {
			if (buildTree.currentCondition.root) {
				return buildTree.next({ type: "ERROR", payload: new ControlStructureMismatchError(command) });
			}

			buildTree.currentCondition = buildTree.stack.pop();
			buildTree.currentCondition["else"] = [];
			buildTree.stack.push(buildTree.currentCondition);

			return {};
		}
	),
	"FALSE" : new Word(
		"FALSE",
		"( -- flag)",	
		function add_false_flag(state) {
			state.push(0);
			return state;
		}
	),
	"FORGET" : new  TreeWord(
		"FORGET",
		"(w -- )",
		function(command, next) {
			if (command === undefined) {
				return next({ type: "ERROR", payload: new UnexpectedEndOfLineError("FORGET") });
			}
			
			/* disabling eslint's "no-use-before-define" rule
			 * because there is a circular reference with
			 * searchDictionary and defaultDictionary
			 */
			// eslint-disable-next-line no-use-before-define
			let testWordToBeDeleted = searchDictionary(command, store.getState().dictionary, true);
			let action = testWordToBeDeleted.type === "ERROR" ? testWordToBeDeleted : { type: "REMOVE_COMMAND", payload: command };
			
			return next(action);
		},
		function(buildTree) {
			let returnAction = new this.constructor(this.type);

			if (buildTree.currentCondition.root) {
				return this.command(buildTree.commands[++buildTree.index], buildTree.next);
			}
			
			return buildTree.currentCondition.addChildNode(returnAction);
		}
	),
	"IF" : new If(
		"IF",
		"(flag -- )",
		null,
		function(buildTree, command) {
			return buildTree.currentCondition.openNode(buildTree, command);
		}
	),
	"LOOP" : new TreeWord(
		"LOOP",
		"( -- )",
		null,
		function(buildTree) {
			return buildTree.currentCondition.closeNode(buildTree);
		}
	),
	"MAX" : new Word(
		"MAX",
		"(n1 n2 -- n3)",
		function max(state) {
			var 
				topInt = state.pop(),
				nextInt = state.pop()
			;

			state.push(Math.max(topInt, nextInt) );
			return state;
		}
	),
	"MIN" : new Word(
		"MIN",
		"(n1 n2 -- n3)",
		function min(state) {
			var
				topInt = state.pop(),
				nextInt = state.pop()
			;

			state.push(Math.min(topInt, nextInt) );
			return state;
		}
	),
	"MOD" : new Word(
		"MOD",
		"(n1 n2 -- n3)",
		function mod(state) {
			var 
				topInt = state.pop(),
				nextInt = state.pop()
			;

			state.push(nextInt % topInt);
			return state;
		}
	),
	"NEGATE" : new Word(
		"NEGATE",
		"(n -- -n)",
		function negate(state) {  
			var topInt = state.pop();
			state.push(topInt * -1);
			return state;
		}
	),
	"NOT" : new Word(
		"NOT",
		"(flag1 -- flag2)",
		function not(state) {
			var topInt = state.pop();
			state.push(topInt === 0 ? -1 : 0);
			return state;
		}
	),
	"OR" : new Word(
		"OR",
		"(flag flag -- flag)",
		function(state) {
			var 
				topFlag = state.pop() !== 0 ? true : false,
				nextFlag = state.pop() !== 0 ? true : false
			;

			state.push((topFlag | nextFlag) ? -1 : 0);
			return state;
		}
	),
	"OVER" : new Word(
		"OVER",
		"(n1 n2 -- n1 n2 n1)",
		function over(state) {
			var nextInt = state[state.length - 2];
			state.push(nextInt);
			return state;
		}
	),
	"PAGE" : new Word(
		"PAGE",
		"( -- )"
	),
	"PICK" : new Word(
		"PICK",
		"(n -- nth_number)",
		function pick(state) {
			var 
				topInt = state[state.length - 1],
				copyInt = state[state.length - (topInt + 1)]
			;
			
			state.push(copyInt);
			return state;
		}
	),
	"ROT" : new Word(
		"ROT",
		"(n1 n2 n3 -- n2 n3 n1)",
		function rot(state) {
			var 
				removeIndex = state.length - 3,
				nextInt = state[removeIndex]
			;
			
			state = state.filter(function(value, index) { return index !== removeIndex; });
			state.push(nextInt);
			return state;
		}
	),
	"SWAP" : new Word(
		"SWAP",
		"(n1 n2 -- n2 n1)",
		function swap(state) {
			var 
				topInt = state.pop(),
				nextInt = state.pop()
			;
			
			state.push(topInt);
			state.push(nextInt);
			return state;
		}
	),
	"THEN" : new TreeWord(
		"THEN",
		"( -- )",
		null,
		function(buildTree) {
			return buildTree.currentCondition.closeNode(buildTree);
		}
	),
	"TRUE" : new Word(
		"TRUE",
		"( -- flag)",
		function add_true_flag(state) {
			state.push(-1);
			return state;
		}
	),
	"." : new Word(
		".",
		"(n -- )",
		function remove_top_number(state) {
			state.pop();
			return state;
		}
	),
	'."' : new TreeWord(
		'."',
		"( -- )",
		null,
		function(buildTree, command) {
			return buildTree.currentCondition.openNode(buildTree, command);
		}
	),
	'"' : new TreeWord(
		'"',
		"( -- )",
		null,
		function(buildTree) {
			return buildTree.currentCondition.closeNode(buildTree);
		}
	),
	".S" : new Word(".S", "( -- )"),
	";" : new TreeWord(
		";",
		"( -- w)",
		null,
		function(buildTree) {
			return buildTree.currentCondition.closeNode(buildTree);
		}
	),
	":" : new Colon(
		":",
		"( -- )",
		null,
		function(buildTree, command) {
			return buildTree.currentCondition.openNode(buildTree, command);
		}
	),
	"(" : new TreeWord(
		"(",
		"( -- )",
		null,
		function(buildTree, command) {
			return buildTree.currentCondition.openNode(buildTree, command);
		}
	),
	")" : new TreeWord(
		")",
		"( -- )",
		null,
		function(buildTree) {
			return buildTree.currentCondition.closeNode(buildTree);
		}
	),
	"+" : new Word(
		"+",
		"(n1 n2 -- n1+n2)",
		function add(state) {
			var
				topInt = state.pop(),
				nextInt = state.pop()
			;
			
			state.push(nextInt + topInt);
			return state;
		}
	),
	"-" : new Word(
		"-",
		"(n1 n2 -- n1-n2)",
		function minus(state) {
			var 
				topInt = state.pop(),
				nextInt = state.pop()
			;

			state.push(nextInt - topInt);
			return state;
		}
	),
	"*" : new Word(
		"*",
		"(n1 n2 -- n1*n2)",
		function multiply(state) {
			var
				topInt = state.pop(),
				nextInt = state.pop()
			;
			
			state.push(nextInt * topInt);
			return state;
		}
	),
	"/" : new Word(
		"/",
		"(n1 n2 -- n1/n2)",
		function divide(state) {
			var
				topInt = state.pop(),
				nextInt = state.pop()
			;

			state.push(Math.floor(nextInt / topInt) );
			return state;
		}
	),
	"*/" : new Word(
		"*/",
		"(n1 n2 n3 -- (n1*n2)/n3)",
		function multiply_divide(state) {
			var topInt = state.pop();
			state = defaultDictionary["*"].command(state);
			state.push(topInt);
			return defaultDictionary["/"].command(state);
		}
	),
	"*/MOD" : new Word(
		"*/MOD",
		"(n1 n2 n3 -- (n1*n2)%n3=n4 (n1*n2)/n3=n5)",
		function multiply_divide_mod(state) {
			var 
				topInt = state.pop(),
				divState
			;

			state = defaultDictionary["*"].command(state);
			state.push(topInt);
			divState = defaultDictionary["/"].command([...state]);
			state = defaultDictionary.MOD.command(state);
			state.push(divState.pop());
			return state;
		}
	),
	"<" : new Word(
		"<",
		"(n1 n2 -- (n1<n2)=flag)",
		function less_than(state) {
			var
				topInt = state.pop(),
				nextInt = state.pop()
			;
			
			state.push(nextInt < topInt ? -1 : 0);
			return state;
		}
	),
	">" : new Word(
		">",
		"(n1 n2 -- (n1>n2)=flag)",
		function greater_than(state) {
			var
				topInt = state.pop(),
				nextInt = state.pop()
			;
			
			state.push(nextInt > topInt ? -1 : 0);
			return state;
		}
	),
	"=" : new Word(
		"=",
		"(n1 n2 -- (n1=n2)=flag)",
		function equals(state) {
			var
				topInt = state.pop(),
				nextInt = state.pop()
			;
			
			state.push(nextInt === topInt ? -1 : 0);
			return state;
		}
	),
	"<>" : new Word(
		"<>",
		"(n1 n2 -- (n1!=n2)=flag)",
		function not_equal(state) {
			var
				topInt = state.pop(),
				nextInt = state.pop()
			;
			
			state.push(nextInt !== topInt ? -1 : 0);
			return state;
		}
	)
};

const isSpecialDigitCommand = function (command) {
	var 
		specialDigitCommandRegex = /^([\d]+)([\+\*\/\-<>=]|(<>))$/gi,
		specialDigitCommandMatch = specialDigitCommandRegex.exec(command)
	;

	return specialDigitCommandMatch ? new SpecialDigitWord(command, specialDigitCommandMatch) : false;
};

const isNumber = function(command) {
	return /^-?\d+$/.exec(command) ? new DigitWord(command) : false;
};

const isInDefaultDictionary = function(command) {
	return isNumber(command) || isSpecialDigitCommand(command) || defaultDictionary[command.toUpperCase()];
};

const isInCustomDictionary = function(command, dictionary) {
	let
		_dictionary = deepCopy(dictionary),
		indexes = (_dictionary[command.toUpperCase()] || { indexes: [] } ).indexes,
		index = indexes.pop()
	;

	return index >= 0 && _dictionary.stack[index] ? true : false;
};

const searchDictionary = function(command, dictionary, findCommandOnly) {
	var
		_dictionary = deepCopy(dictionary),
		indexes = (_dictionary[command.toUpperCase()] || { indexes: [] } ).indexes,
		index = indexes.pop(),
		customDictionaryWord = isInCustomDictionary(command, dictionary),
		defaultDictionaryWord = isInDefaultDictionary(command);
	;

	if (customDictionaryWord) {
		if (findCommandOnly) {
			return dictionary.stack[index];
		}

		let customDefinitionTree = [];
		dictionary.stack[index].command.forEach(function search(word) {
			if (word.index > -1) {
				dictionary.stack[word.index].command.forEach(search);
			} else {
				customDefinitionTree.push(word);
			}
		});

		return customDefinitionTree;
	}

	if (defaultDictionaryWord) { 
		return defaultDictionaryWord;
	}
	
	return { type: "ERROR", payload: new WordNotFoundError(command) };
};

const compileStackReducer = function(state = [new Root("ROOT")]) {
	return state;
};

const numberStackReducer = function(state=[], action) {
	state = [...state];
	if (action.type.toUpperCase() === "CLEAR_INTEGER_STACK") {
		return [];
	}

	if (action.word instanceof Word && action.word.command instanceof Function) {
		state = action.word.command(state);
		return isNaN(state[state.length - 1]) ? (state.pop(), state) : state;
	}

	return state;
};


const dictionaryReducer = function(state={stack: []}, action) {
	state = {...state, stack: [...state.stack] };


	if (action.type.toUpperCase() === "CLEAR_DICTIONARY") {
			return { stack: [] };	
	}

	action = action.word || { type: "" };
	switch(action.type.toUpperCase() ) {
		case "CREATE_NEW_COMMAND" :
			action.payload.comment = action.payload.comment.trim();
			state.stack.push(action.payload);

			let command = state[action.payload.type] = Object.assign({ indexes: [] }, {...state[action.payload.type]});
			
			command.indexes = [...command.indexes];
			command.indexes.push(state.stack.length - 1);

			return state;
		
		case "REMOVE_COMMAND" :
			command = state[action.payload.toUpperCase()];

			let index = command.indexes[command.indexes.length - 1];
			let stack = state.stack.slice(0, index);
			let wordsToRemove = state.stack.slice(index);
			wordsToRemove.forEach(function(word) {
				state[word.type].indexes.pop();

				if (state[word.type].indexes.length === 0) {
					delete state[word.type];
				}					
			});

			state.stack = stack;			
	}

	return state;
};

const displayStackReducer = function(state=[], action) {
	state = [...state];

	if (action.type.toUpperCase() === "ERROR") {
		state.push(action.payload.getMessage() );
		return state;
	}

	action = action.word || { type: "" };
	switch(action.type.toUpperCase() ) {
		case "PAGE" :
			return [];
		case "CR" :
			state.push("\r");
			return state;
		case "PRINT" :
			return state.concat(action.payload);
	}

	return state;
};

const reducers = combineReducers({
	compileStack: compileStackReducer,
	dictionary: dictionaryReducer,
	displayStack: displayStackReducer,
	numberStack: numberStackReducer
});

const processTree = function(commands, next, store, hasSearchedDictionary = false) { 

	let totalCommands = commands.length;
	for (let index = 0; index < totalCommands; index++) {
		let
			command = commands[index].type.trim(),
			action = hasSearchedDictionary === false ? searchDictionary(command, store.getState().dictionary) : commands[index];
		;
				
		if (Array.isArray(action) ) {
			processTree(action, next, store, true);
			continue;
		}

		switch(command.toUpperCase() ) {
			case "CONSTANT" :

				let word = defaultDictionary[command.toUpperCase()];
				action = word.command(commands[++index].type, [...store.getState().numberStack].pop(), next);
				
				continue;
			case "FORGET" :

				word = defaultDictionary[command.toUpperCase()];
				action = word.command(commands[++index].type, next);
				
				continue;
			case ":" :
				command = commands[index];
				let customWordName = command.payload[0].type.toUpperCase();
				let words = command.payload.slice(1);
				let comment = "";

				if ((words[0] || {}).type === "(") {
					comment = "( " + words[0].payload.map(x => x.type).join(" ") + " )"
					words = words.slice(1);
				}
				
				next({ type: "CREATE_NEW_COMMAND", payload: new Word(customWordName, comment, words) });
				continue;
			case '."' :
				command = commands[index];
				let message = command.payload.map((x) => x.type).join(" ");
				next({ type: "PRINT", payload: message });
				continue;

			case "(" :
				continue;

			case "DO" :
				command = commands[index];
				let state = [...store.getState().numberStack];
				let startingValue = state.pop();
				let limit  = state.pop();
				let showIndex = (command.payload[0].type.toUpperCase() === "I");
				let loopCommands = showIndex ? command.payload.slice(1) : command.payload;
				next(defaultDictionary["DROP"]);
				next(defaultDictionary["DROP"]);

				do {
					if (showIndex) {
						next(new DigitWord(startingValue));
					}
					
					processTree(loopCommands, next, store);
				
				} while (++startingValue < limit);

				continue;
			case "IF" :
				let flag = [...store.getState().numberStack].pop();
				if (isNaN(flag) ) { 
					next({ type: "ERROR", payload: new StackUnderFlowError() });
					return [];
				}

				next(defaultDictionary["DROP"]);
				
				command = commands[index];				
				let else_commands = command.else; 
				let if_commands = command.payload;
				let isIfConditionTrue = (flag !== 0);
				
				if (isIfConditionTrue) {
					processTree(if_commands, next, store)
				} else if (else_commands !== undefined) {
					processTree(else_commands, next, store);
				}

				continue;

			default :
				
				next(action);

				if (action.type === "ERROR") { 
					return;
				}
		}
	}
};

class BuildTree {
	constructor(action, next, store) {
		this.action = action;
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
				returnAction = {}
			;

			returnAction = (defaultDictionary[command.toUpperCase()] || new Word(command)).build(buildTree, command);
			if ((returnAction || {}).type === "ERROR") { return; }	
		}
	}
}

const createTree = function(action, next, store) {
	var buildTree = new BuildTree(action, next, store); 
	return buildTree.run();
}

const createExecutionTree = store => next => action => {
	switch(action.type) {
		case "CLEAR_INTEGER_STACK" :
		case "CLEAR_DICTIONARY" :
			return next(action);
	}

	createTree(action, next, store);
};

const printCommands = store => next => action => {
	switch((action.type).toUpperCase() ) {
		case "." :
			let topInt = [...store.getState().numberStack].pop();
			next(action);
			return next({ type: "PRINT", payload: [topInt]});
		case ".S" :
			let numberStack = [...store.getState().numberStack];
			return next({ type: "PRINT", payload: numberStack });
	}
	
	return next(action);
};


const convertWordClassToAction = store => next => action => {
	[...store.getState().numberStack];
	switch(action.type) {
		case "ERROR" :
		case "CLEAR_INTEGER_STACK" :
		case "CLEAR_DICTIONARY" :
			return next(action);
	}
	
	return next({type: "EXECTUE_WORD", word: action });
};

const middleware = applyMiddleware(createExecutionTree, printCommands, convertWordClassToAction);
window.store = createStore(reducers, middleware);
