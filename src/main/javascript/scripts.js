import {applyMiddleware, combineReducers, createStore} from "redux";
import {createLogger} from "redux-logger";

class WordNotFoundError extends Error {
	constructor(command) {
		super(command + " not found ");
		this.getCommand = function() { return command; };
	}
}

class Word {
	constructor(name, comment, command) {
		this.name = name;
		this.comment = comment;
		this.command = command;
	}
}

const defaultDictionary = {
	"ABS" : new Word(
		"ABS",
		"(n -- -n)",
		function abs(state) {
			state.push(Math.abs(state.pop() ) );
			return state;
		}
	),
	"CONSTANT" : new Word("CONSTANT", "( -- w)"),
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
	"FORGET" : new  Word("FORGET", "(w -- )"),
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
			
			state = state.filter(function(value, index, arr) { return index !== removeIndex });
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
			var topInt = state.pop();
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
			state = defaultDictionary["MOD"].command(state);
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

const numberStackReducer = function(state=[], action) {
	state = [...state];
	action = {...action};

	let command = action.type.toUpperCase();
	if (isNumber(command)) {
		state.push(action.type * 1);
		return state;
	}

	let specialDigitCommandMatch = isSpecialDigitCommand(command);
	if (specialDigitCommandMatch && specialDigitCommandMatch.length === 3) {
		command = specialDigitCommandMatch[2];
		state.push(specialDigitCommandMatch[1] * 1);
		return numberStackReducer(state, {...action, type: command});
	}

	let word = defaultDictionary[command];
	if (word instanceof Word) {
		return word.command(state);
	}

	if (command === "CLEAR_INTEGER_STACK") {
		return [];
	}

	return state;
};


const dictionaryReducer = function(state={stack: []}, action) {
	state = {...state, stack: [...state.stack] };
	action = {...action};
	switch(action.type) {
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
	}

	return state;
};

const isSpecialDigitCommand = function (command) {
	var 
		specialDigitCommandRegex = /^([\d]+)([\+\*\/\-<>=]{1,2})$/gi,
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

const displayStackReducer = function(state=[], action) {
	state = [...state];
	switch(action.type) {
		case "CLEAR_DISPLAY_STACK" :
			return [];
		case "PRINT" :
			return state.concat(action.payload);
		case "ERROR" :
			state.push(action.payload.getCommand() + " ?");
			return state;
	}

	return state;
};

const reducers = combineReducers({
	numberStack: numberStackReducer,
	dictionary: dictionaryReducer,
	displayStack: displayStackReducer
});

const searchDictionary = function(action, command, dictionary) {
	var 
		indexes = [...Object.assign({ indexes: [] }, dictionary[command.toUpperCase()]).indexes],
		index = indexes.pop(),
		isInCustomDictionary = index >= 0 && dictionary.stack[index] ? true : false,
		isInDictionary = isInDefaultDictionary(command) ? true : false;
	;

	if (isInCustomDictionary === true) {
		return {...action, type: dictionary.stack[index].command + "" };
	}

	if (isInDictionary === true) {
		return {...action, type: command + "" };
	}
	
	return {...action, type: "ERROR", payload: new WordNotFoundError(command) };	
};

const processCommands = function(action, next) {
	action = {...action, type: ((action.type + "") ).trim() };
	let searchForWhiteSpace = /\s+/gi;
	let returnActions = [];

	if (action.type.match(searchForWhiteSpace) === null) {
		returnActions.push(searchDictionary(action, action.type, {...store.getState().dictionary}) );
		return returnActions;
	}

	let commands = action.type.split(searchForWhiteSpace);
	let isWritingNewCommand = false;
	let isWritingNewComment = false;
	let customWords = [];
	let startOfCustomWordIndex = 0;
	let wasErrorThrown = false;
	commands.forEach(function(command, index) {
		if (wasErrorThrown === false) {
			if (isWritingNewComment === false || command === ")") {
				switch(command) {
					case ":" :
						isWritingNewCommand = true;
						startOfCustomWordIndex = index;
						customWords.push(new Word("", "", "") );
						return;
					case ";" :
						isWritingNewCommand = false;
						return next({...action, type: "CREATE_NEW_COMMAND", payload: customWords.pop() });
					case "(" :
						isWritingNewComment = true;
						break;
					case ")" :
						if (isWritingNewCommand) {
							customWords[customWords.length - 1].comment += " " + command;
						}
						isWritingNewComment = false;
						return;
				}
			}

			if (isWritingNewCommand === false && isWritingNewComment === false) {
				action = searchDictionary(action, command, {...store.getState().dictionary});
				if (action.type === "ERROR") { wasErrorThrown = true; return next(action); }
				
				returnActions = returnActions.concat(processCommands(action, next) );
				return; 
			} 
			
			if (isWritingNewCommand) {
				if (startOfCustomWordIndex + 1 === index) {
					customWords[customWords.length - 1].name = command.toUpperCase();
				} else if (isWritingNewComment)  {
					customWords[customWords.length - 1].comment += " " + command;
				} else {
					customWords[customWords.length - 1].command += " " + command;
				}
			}
		}
	});

	return returnActions;
};

const processInput = store => next => action => {
	switch(action.type) {
		case "CLEAR_DISPLAY_STACK" :
		case "CLEAR_INTEGER_STACK" :
		case "CLEAR_DICTIONARY" :
			return next(action);
	}

	let actions = processCommands(action, next);
	actions.forEach(function(action, index) {
		return next(action);
	});
};

const printCommands = store => next => action => {
	switch((action.type + "").toUpperCase() ) {
		case "." :
			let topInt = [...store.getState().numberStack].pop();
			next(action);
			return next({...action, type: "PRINT", payload: [topInt]});
		case ".S" :
			let numberStack = [...store.getState().numberStack];
			return next({...action, type: "PRINT", payload: numberStack });
	}

	return next(action);
};

const middleware = applyMiddleware(createLogger(), processInput, printCommands);
const store = window.store = createStore(reducers, middleware);
