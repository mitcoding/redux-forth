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
		this.type = "ERROR";
		this.getMessage = function() { return message; };
	}

	modifyDisplayStack(state) {
		state.push(this.getMessage() );
		return state;
	}

	modifyIntegerStack(state) { return state; }
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
	constructor(type, comment = "( -- )", modifyIntegerStack) {
		this.type = type === undefined ? undefined : type + "";
		this.comment = comment.trim();
		if (modifyIntegerStack !== undefined) { this.modifyIntegerStack = modifyIntegerStack; }
	}

	build(buildTree, command) {
		// eslint-disable-next-line no-use-before-define
		let word = searchDictionary(command, buildTree.store.getState().dictionary, true);

		buildTree.currentCondition.addChildNode(
			addCustomDefinitionStackIndex(word, buildTree.store.getState().dictionary.stack),
			buildTree.next,
			buildTree.store
		);
		
	}

	modifyIntegerStack(state) { return state; }

	process(commands, index, store, next) {
		next(this);
		return this;
	}
}

class CarriageReturn extends Word {
	modifyDisplayStack(state) {
		state.push("\r");
		return state;
	}
}

class CustomWord extends Word {
	constructor(type, comment, payload) {
		super(type, comment);
		this.payload = payload;
	}
}

class AddCustomWord extends CustomWord {
	modifyDictionary(state) {
		state.stack.push(new CustomWord(this.type, this.comment, this.payload) );
		let command = state[this.type] = Object.assign({ indexes: [] }, {...state[this.type]});
		
		command.indexes = [...command.indexes];
		command.indexes.push(state.stack.length - 1);
		
		return state;
	}
}

class RemoveCustomWord extends CustomWord {
	modifyDictionary(state) { 
		let 
			command = state[this.type],
			index = command.indexes[command.indexes.length - 1],
			stack = state.stack.slice(0, index),
			wordsToRemove = state.stack.slice(index)
		;

		wordsToRemove.forEach(function(word) {
			state[word.type].indexes.pop();

			if (state[word.type].indexes.length === 0) {
				delete state[word.type];
			}					
		});

		state.stack = stack;
		return state; 
	}
}

class ForgetAll extends CustomWord {
	modifyDictionary() {
		return { stack: [] };
	}	
}

class IntegerWord extends Word {
	modifyIntegerStack(state) {
		state.push(this.type * 1);
		return state;
	}
}

class Print extends Word {
	constructor(type = "PRINT", comment) {
		super(type, comment);
		this.payload = [];
	}

	modifyDisplayStack(state) {
		return state.concat(this.payload);
	}
}

class EchoCopyOfIntegerStack extends Print {
	process(command, index, store, next) {
		let integerStack = [...store.getState().integerStack];
		this.payload = integerStack;
		next(this);
		return this;
	}
}

class MoveTopIntegerToDisplayStack extends Print {
	modifyIntegerStack(state) {
		state.pop();
		return state;
	}

	process(command, index, store, next) {
		let integerStack = [...store.getState().integerStack];
		this.payload.push(integerStack.pop() );

		next(this);
		return this;
	}
}

class SpecialIntegerWord extends Word {
	constructor(type, specialDigitCommandMatch) {
		super(type);
		this.specialDigitCommandMatch = specialDigitCommandMatch;
	}

	modifyIntegerStack(state) {
		let command = this.specialDigitCommandMatch[2];
		state.push(this.specialDigitCommandMatch[1] * 1);
		// eslint-disable-next-line no-use-before-define
		return integerStackReducer(state, { type: "EXECUTE_WORD", word: defaultDictionary[command.toUpperCase()] });
	}
}

class TreeWord extends Word {
	constructor(type, comment, command) {
		super(type, comment, command);
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

class UnknownWord extends Word {
	process(commands, index, store, next) {
		next(new WordNotFoundError(commands[index].type) );
		return this;
	}
}

class Root extends TreeWord {
	constructor(type, comment, command) {
		super(type, comment, command);
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
		buildTree.index = buildTree.commands.length;
		return buildTree.next(new ControlStructureMismatchError(buildTree.commands[buildTree.index]) );
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

	build(buildTree, command) {
		return buildTree.currentCondition.openNode(buildTree, command);
	}

	openNode(buildTree, command) {
		
		/* disabling eslint's "no-use-before-define" rule
		 * because there is a circular reference with
		 * defaultDictionary and If class
		 */
		// eslint-disable-next-line no-use-before-define
		buildTree.currentCondition = this.addChildNode(new defaultDictionary[command.toUpperCase()].constructor(command) );
		buildTree.stack.push(buildTree.currentCondition);
	}

	process(commands, index, store, next) {
		let flag = [...store.getState().integerStack].pop();
		if (isNaN(flag) ) { 
			next( new StackUnderFlowError() );
			return this;
		}

		// eslint-disable-next-line no-use-before-define
		next(defaultDictionary["DROP"]);

		let 
			command = commands[index],
			else_commands = command.else, 
			if_commands = command.payload,
			isIfConditionTrue = (flag !== 0)
		;
		
		if (isIfConditionTrue) {
			// eslint-disable-next-line no-use-before-define
			processTree(if_commands, next, store)
		} else if (else_commands !== undefined) {
			// eslint-disable-next-line no-use-before-define
			processTree(else_commands, next, store);
		}

		return this;
	}	
}

class CloseTreeWord extends TreeWord {
	build(buildTree, command) {
		return buildTree.currentCondition.closeNode(buildTree, command);
	}
}

class Colon extends TreeWord {
	build(buildTree, command) {
		return buildTree.currentCondition.openNode(buildTree, command);
	}

	openNode(buildTree, command) {
		
		if (buildTree.commands[buildTree.index - 1] === ":") {
			return this.addChildNode(new CustomWord(command), buildTree.next, buildTree.store);				
		}

		TreeWord.prototype.openNode.apply(this, arguments);
	}

	process(commands, index, store, next) {
		let 
			command = commands[index],
			customWordName = command.payload[0].type.toUpperCase(),
			words = command.payload.slice(1),
			comment = ""
		;

		if ((words[0] || {}).type === "(") {
			comment = "( " + words[0].payload.map(x => x.type).join(" ") + " )"
			words = words.slice(1);
		}
		
		next(new AddCustomWord(customWordName, comment, words) );

		return this;
	}
}
class Comment extends TreeWord {
	build(buildTree, command) {
		return buildTree.currentCondition.openNode(buildTree, command);
	}

	process() {
		return this;
	}
}
class Constant extends TreeWord {
	build(buildTree, command) {
		buildTree.currentCondition.openNode(buildTree, command);
		
		let newConstant = buildTree.commands[++buildTree.index] || "";

		buildTree.currentCondition.addChildNode(
			// eslint-disable-next-line no-use-before-define
			searchDictionary(newConstant, buildTree.store.getState().dictionary, true),
			buildTree.next,
			buildTree.store
		);

		buildTree.currentCondition.closeNode(buildTree);
	}

	process(commands, index, store, next) {
		let 
			name = commands[index].payload[0].type,
			command = [...store.getState().integerStack].pop()
		;

		if (isNaN(command) ) {
			return next(new StackUnderFlowError() );
		}

		/* disabling eslint's "no-use-before-define" rule
		 * because there is a circular reference with
		 * defaultDictionary and Constant class
		 */
		// eslint-disable-next-line no-use-before-define
		next(defaultDictionary["DROP"]);
		next(new AddCustomWord(name.toUpperCase(), "( -- " + command + ")", [new IntegerWord(command)]) );
		return this;
	}
}

class Do extends TreeWord {
	build(buildTree, command) {
		return buildTree.currentCondition.openNode(buildTree, command);
	}

	process(commands, index, store, next) {
		let 
			command = commands[index],
			state = [...store.getState().integerStack],
			startingValue = state.pop(),
			limit  = state.pop(),
			showIndex = (command.payload[0].type.toUpperCase() === "I"),
			loopCommands = showIndex ? command.payload.slice(1) : command.payload
		;

		// eslint-disable-next-line no-use-before-define
		next(defaultDictionary["DROP"]);

		// eslint-disable-next-line no-use-before-define
		next(defaultDictionary["DROP"]);

		do {
			if (showIndex) {
				next(new IntegerWord(startingValue));
			}

			// eslint-disable-next-line no-use-before-define
			processTree(loopCommands, next, store);
		
		} while (++startingValue < limit);

		return this;
	}
}

class Echo extends TreeWord {
	build(buildTree, command) {
		return buildTree.currentCondition.openNode(buildTree, command);
	}

	process(commands, index, store, next) {
		let
			command = commands[index],
			message = command.payload.map((x) => x.type).join(" "),
			print = new Print();
		;

		print.payload.push(message);
		next(print);
		return this;
	}
}

class Else extends TreeWord {
	build(buildTree, command) {
		
		if (buildTree.currentCondition.root) {
			buildTree.index = buildTree.commands.length;
			return buildTree.next(new ControlStructureMismatchError(command) );
		}

		buildTree.currentCondition = buildTree.stack.pop();
		buildTree.currentCondition["else"] = [];
		buildTree.stack.push(buildTree.currentCondition);

		return this;
	}
}

class Forget extends Constant {
	process(commands, index, store, next) {

		let command = (commands[index].payload[0] || {}).type;
		if (command === undefined) {
			return next(new UnexpectedEndOfLineError("FORGET") );
		}
		
		let 
			word = commands[index].payload[0],
			action = word instanceof UnknownWord ? new WordNotFoundError(command) : new RemoveCustomWord(command)
		;
		
		next(action);

		return this;
	}
}

class Page extends Word {
	modifyDisplayStack() {
		return [];
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
	"CLEARSTACK" : new Word(
		"CLEARSTACK",
		"( ... -- )",
		function clearStack() {
			return [];
		}
	),
	"CONSTANT" : new Constant(
		"CONSTANT",
		"( -- w)"
	),
	"CR" : new CarriageReturn("CR"),
	"DO" : new Do(
		"DO",
		"(limit starting_value -- )",
		null
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
	"ELSE" : new Else("ELSE"),
	"FALSE" : new Word(
		"FALSE",
		"( -- flag)",	
		function add_false_flag(state) {
			state.push(0);
			return state;
		}
	),
	"FORGET" : new  Forget("FORGET"),
	"FORGETALL" : new ForgetAll("FORGETALL"),
	"IF" : new If(
		"IF",
		"(flag -- )"
	),
	"LOOP" : new CloseTreeWord("LOOP"),
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
	"PAGE" : new Page("PAGE"),
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
	"THEN" : new CloseTreeWord("THEN"),
	"TRUE" : new Word(
		"TRUE",
		"( -- flag)",
		function add_true_flag(state) {
			state.push(-1);
			return state;
		}
	),
	"." : new MoveTopIntegerToDisplayStack(
		".",
		"(n -- )"
	),
	'."' : new Echo('."'),
	'"' : new CloseTreeWord('"'),
	".S" : new EchoCopyOfIntegerStack(".S"),
	";" : new CloseTreeWord(";"),
	":" : new Colon(":"),
	"(" : new Comment("("),
	")" : new CloseTreeWord(")"),
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
			state = defaultDictionary["*"].modifyIntegerStack(state);
			state.push(topInt);
			return defaultDictionary["/"].modifyIntegerStack(state);
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

			state = defaultDictionary["*"].modifyIntegerStack(state);
			state.push(topInt);
			divState = defaultDictionary["/"].modifyIntegerStack([...state]);
			state = defaultDictionary.MOD.modifyIntegerStack(state);
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

	return specialDigitCommandMatch ? new SpecialIntegerWord(command, specialDigitCommandMatch) : false;
};

const isNumber = function(command) {
	return /^-?\d+$/.exec(command) ? new IntegerWord(command) : false;
};

const isInDefaultDictionary = function(command) {
	let defaultWord = defaultDictionary[command.toUpperCase()];
	return isNumber(command) || isSpecialDigitCommand(command) || (defaultWord ? new defaultWord.constructor(command.toUpperCase(), defaultWord.comment, defaultWord.modifyIntegerStack) : undefined);
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
		dictionary.stack[index].payload.forEach(function search(word) {
			if (word.index > -1) {
				dictionary.stack[word.index].payload.forEach(search);
			} else {
				customDefinitionTree.push(word);
			}
		});

		return customDefinitionTree;
	}

	if (defaultDictionaryWord) { 
		return defaultDictionaryWord;
	}
	
	return new UnknownWord(command);
};

const compileStackReducer = function(state = [new Root("ROOT")]) {
	return state;
};

const integerStackReducer = function(state=[], action) {
	state = [...state];
	
	if (action.word && action.word.modifyIntegerStack) {
		state = action.word.modifyIntegerStack(state);
		return isNaN(state[state.length - 1]) ? (state.pop(), state) : state;
	}

	return state;
};


const dictionaryReducer = function(state={stack: []}, action) {
	state = {...state, stack: [...state.stack] };

	action = action.word || action;
	if (action.modifyDictionary) {
		return action.modifyDictionary(state);
	}

	return state;
};

const displayStackReducer = function(state=[], action) {
	state = [...state];
	action = action.word || {};

	if (action.modifyDisplayStack) {
		return action.modifyDisplayStack(state);
	}

	return state;
};

const reducers = combineReducers({
	compileStack: compileStackReducer,
	dictionary: dictionaryReducer,
	displayStack: displayStackReducer,
	integerStack: integerStackReducer
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

		action.process(commands, index, store, next);		
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
				action = searchDictionary(command, buildTree.store.getState().dictionary, true)
			;

			action.build(buildTree, command);
		}
	}
}

const createExecutionTree = store => next => action => {
	var buildTree = new BuildTree(action, next, store); 
	return buildTree.run();
};

const convertWordClassToAction = store => next => action => {
	[...store.getState().integerStack];
	return next({type: "EXECTUE_WORD", word: action });
};

const middleware = applyMiddleware(createExecutionTree, convertWordClassToAction);
window.store = createStore(reducers, middleware);
