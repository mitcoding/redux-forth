import {applyMiddleware, combineReducers, createStore} from "redux";

class ForthCommandError extends Error {
	constructor(command, message) {
		super(command + " " + message);
		this.getMessage = function() { return message; };
	}
}

class WordNotFoundError extends ForthCommandError {
	constructor(command) {
		super(command, command + " ?");
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

class Word {
	constructor(name, comment, command) {
		this.name = name;
		this.comment = comment;
		this.command = command;
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
	"CONSTANT" : new Word(
		"CONSTANT",
		"( -- w)",
		function(name, command, next) {
			if (isNaN(command) ) {
				return next({ type: "ERROR", payload: new StackUnderFlowError() });
			}

			next({ type: "DROP" });
			next({ type: "CREATE_NEW_COMMAND", payload: new Word(name.toUpperCase(), "( -- " + command + ")", command + "") });
		}
	),
	"DO" : new Word("(limit starting_value -- )"),
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
	"ELSE" : new Word("ELSE", "( -- )"),
	"FALSE" : new Word(
		"FALSE",
		"( -- flag)",	
		function add_false_flag(state) {
			state.push(0);
			return state;
		}
	),
	"FORGET" : new  Word(
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
			let testWordToBeDeleted = searchDictionary(command, {...store.getState().dictionary});
			let action = testWordToBeDeleted.type === "ERROR" ? testWordToBeDeleted : { type: "REMOVE_COMMAND", payload: command };
			
			return next(action);
		}
	),
	"IF" : new Word("IF", "(flag -- )"),
	"LOOP" : new Word("LOOP", "( -- )"),
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
	"OVER" : new Word(
		"OVER",
		"(n1 n2 -- n1 n2 n1)",
		function over(state) {
			var nextInt = state[state.length - 2];
			state.push(nextInt);
			return state;
		}
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
	"THEN" : new Word("THEN", "( -- )"),
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
	".S" : new Word(".S", "( -- )"),
	";" : new Word(";", "( -- w)"),
	":" : new Word(":", "( -- )"),
	"(" : new Word("(", "( -- )"),
	")" : new Word(")", "( -- )"),
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

	return specialDigitCommandMatch;
};

const isNumber = function(command) {
	return /^-?\d+$/.exec(command);
};

const isInDefaultDictionary = function(command) {
	return isNumber(command) || isSpecialDigitCommand(command) || defaultDictionary[command.toUpperCase()];
};

const searchDictionary = function(command, dictionary) {
	var
		indexes = [...Object.assign({ indexes: [] }, dictionary[command.toUpperCase()]).indexes],
		index = indexes.pop(),
		isInCustomDictionary = index >= 0 && dictionary.stack[index] ? true : false,
		isInDictionary = isInDefaultDictionary(command) ? true : false;
	;

	if (isInCustomDictionary === true) {
		return { type: dictionary.stack[index].command + "" };
	}

	if (isInDictionary === true) {
		return { type: command + "" };
	}
	
	return { type: "ERROR", payload: new WordNotFoundError(command) };
};

const numberStackReducer = function(state=[], action) {
	state = [...state];
	action = {...action};

	let command = action.type.toUpperCase();
	if (isNumber(command)) {
		state.push(action.type * 1);
		return state;
	}

	let specialDigitCommandMatch = isSpecialDigitCommand(command);
	if (specialDigitCommandMatch && specialDigitCommandMatch.length === 4) {
		command = specialDigitCommandMatch[2];
		state.push(specialDigitCommandMatch[1] * 1);
		return numberStackReducer(state, { type: command });
	}

	let word = defaultDictionary[command];
	if (word instanceof Word && word.command instanceof Function) {
		state = word.command(state);
		return isNaN(state[state.length - 1]) ? (state.pop(), state) : state;
	}

	if (command === "CLEAR_INTEGER_STACK") {
		return [];
	}

	return state;
};


const dictionaryReducer = function(state={stack: []}, action) {
	state = {...state, stack: [...state.stack] };
	action = {...action};

	switch(action.type.toUpperCase() ) {
		case "CREATE_NEW_COMMAND" :
			action.payload.command = action.payload.command.trim();
			action.payload.comment = action.payload.comment.trim();
			state.stack.push(action.payload);

			let command = state[action.payload.name] = Object.assign({ indexes: [] }, {...state[action.payload.name]});
			
			command.indexes = [...command.indexes];
			command.indexes.push(state.stack.length - 1);

			return state;
		case "CLEAR_DICTIONARY" :
			return { stack: [] };

		case "REMOVE_COMMAND" :
			command = state[action.payload.toUpperCase()];

			let index = command.indexes[command.indexes.length - 1];
			let stack = state.stack.slice(0, index);
			let wordsToRemove = state.stack.slice(index);
			wordsToRemove.forEach(function(word) {
				state[word.name].indexes.pop();

				if (state[word.name].indexes.length === 0) {
					delete state[word.name];
				}					
			});

			state.stack = stack;			
	}

	return state;
};

const displayStackReducer = function(state=[], action) {
	state = [...state];
	switch(action.type) {
		case "CLEAR_DISPLAY_STACK" :
			return [];
		case "PRINT" :
			return state.concat(action.payload);
		case "ERROR" :
			state.push(action.payload.getMessage() );
			return state;
	}

	return state;
};

const reducers = combineReducers({
	numberStack: numberStackReducer,
	dictionary: dictionaryReducer,
	displayStack: displayStackReducer
});

const processTree = function(commands, next, store) { 

	let totalCommands = commands.length;
	for (let index = 0; index < totalCommands; index++) {
		let
			action = {},
			command = commands[index].type.trim()
		;
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

				next({ type: "CREATE_NEW_COMMAND", payload: new Word(customWordName, comment, words.map(x => x.type).join(" ").toUpperCase() ) });
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
				next({ type: "DROP" });
				next({ type: "DROP" });

				do {
					if (showIndex) {
						next({type: startingValue + ""});
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

				next({ type: "DROP" });
				
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
				action = searchDictionary(command, {...store.getState().dictionary});
				
				if (action.type === "ERROR") { 
					next(action);
					return;
				}

				if (action.type.match(WHITE_SPACE_REGEX) === null) {
					next(action);
					continue;
				}

				processTree(action.type.split(WHITE_SPACE_REGEX).map(x => ({ type: x }) ), next, store);
		}
		
	}
};

const createTree = function(action, next, store) {
	var 
		commands = (action.type + "").split(WHITE_SPACE_REGEX),
		command,
		currentCondition = { type: "root", root: true, payload: [] },		
		rootCondition = currentCondition,
		stack = [],
		totalCommands = commands.length
	;

	stack.push(rootCondition);	
	for (let index = 0; index < totalCommands; index++) {
		command = commands[index];
		action = {};
		switch(command.toUpperCase() ) {
			case "CONSTANT" :
				if (currentCondition.root) {

					let word = defaultDictionary[command.toUpperCase()];
					action = word.command(commands[++index].toUpperCase(), [...store.getState().numberStack].pop(), next);

					continue;
				}

				action = { type: command };
				break;
				
			case "FORGET" :
				if (currentCondition.root) {

					let word = defaultDictionary[command.toUpperCase()];
					action = word.command(commands[++index], next);

					continue;
				}

				action = { type: command };
				break;
				
			case "DO" :
			case "IF" :
			case ":" :
			case "(" :
				if (currentCondition.else) {
					currentCondition.else.push({ type: command, payload: [] });
					currentCondition = currentCondition.else[currentCondition.else.length - 1];
				} else {
					currentCondition.payload.push({ type: command, payload: [] });
					currentCondition = currentCondition.payload[currentCondition.payload.length - 1];
				}
				stack.push(currentCondition);
				continue;
			case "ELSE" :
				currentCondition = stack.pop();
				currentCondition["else"] = [];
				stack.push(currentCondition);
				continue;

			case "LOOP" : 
			case "THEN" :
			case ";" :
			case ")" :
				stack.pop();
				currentCondition = stack[stack.length - 1];
				break;
			default :
				action = { type: command + "" };
		}

		if (action.type) {
			if (currentCondition.else) {
				currentCondition.else.push(action);
			} else {
				currentCondition.payload.push(action);
			}
		}

		if (currentCondition.root && currentCondition.payload.length > 0) {
			processTree([currentCondition.payload.pop()], next, store);
		}
	}
}


const createExecutionTree = store => next => action => {
	switch(action.type) {
		case "CLEAR_DISPLAY_STACK" :
		case "CLEAR_INTEGER_STACK" :
		case "CLEAR_DICTIONARY" :
			return next(action);
	}

	createTree(action, next, store);
};

const printCommands = store => next => action => {
	switch((action.type + "").toUpperCase() ) {
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

const middleware = applyMiddleware(createExecutionTree, printCommands);
window.store = createStore(reducers, middleware);
