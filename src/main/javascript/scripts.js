import {applyMiddleware, combineReducers, createStore} from "redux";
import {createLogger} from "redux-logger";


const numberStackReducer = function(state=[], action) {
	state = [...state];
	action = {...action};

	if (/^-?\d+$/.exec(action.type)) {
		state.push(action.type * 1);
		return state;
	}

	let specialDigitCommandRegex = /^([\d]+)([\+\*\/\-<>=]{1,2})$/gi;
	let specialDigitCommandMatch = specialDigitCommandRegex.exec(action.type);
	if (specialDigitCommandMatch && specialDigitCommandMatch.length === 3) {
		let command = specialDigitCommandMatch[2];
		state.push(specialDigitCommandMatch[1] * 1);
		return numberStackReducer(state, {...action, type: command});
	}

	switch(action.type) {
		case "ABS" :
			state.push(Math.abs(state.pop() ) );
			return state;
		case "CLEAR_INTEGER_STACK" :
			return [];
		case "DUP" :
			state.push(state[state.length - 1]);
			return state;
		case "DROP" :
			return state.slice(0, state.length - 1);
		case "FALSE" :
			state.push(0);
			return state;
		case "MAX" :
			let topInt = state.pop();
			let nextInt = state.pop();
			state.push(Math.max(topInt, nextInt) );
			return state;
		case "MIN" :
			topInt = state.pop();
			nextInt = state.pop();
			state.push(Math.min(topInt, nextInt) );
			return state;
		case "MOD" :
			topInt = state.pop();
			nextInt = state.pop();
			state.push(nextInt % topInt);
			return state;
		case "NEGATE" : 
			topInt = state.pop();
			state.push(topInt * -1);
			return state;
		case "NOT" :
			topInt = state.pop();
			state.push(topInt === 0 ? -1 : 0);
			return state;
		case "OVER" :
			nextInt = state[state.length - 2];
			state.push(nextInt);
			return state;
		case "PICK" :
			topInt = state[state.length - 1];
			let copyInt = state[state.length - (topInt + 1)];
			state.push(copyInt);
			return state;
		case "ROT" :
			let removeIndex = state.length - 3;
			nextInt = state[removeIndex];
			state = state.filter(function(value, index, arr) { return index !== removeIndex });
			state.push(nextInt);
			return state;
		case "SWAP" :
			topInt = state.pop();
			nextInt = state.pop();
			state.push(topInt);
			state.push(nextInt);
			return state;
		case "TRUE" :
			state.push(-1);
			return state;
		case "." :
			topInt = state.pop();
			return state;
		case "+" :
			topInt = state.pop();
			nextInt = state.pop();
			state.push(nextInt + topInt);
			return state;
		case "-" :
			topInt = state.pop();
			nextInt = state.pop();
			state.push(nextInt - topInt);
			return state;
		case "*" :
			topInt = state.pop();
			nextInt = state.pop();
			state.push(nextInt * topInt);
			return state;
		case "/" :
			topInt = state.pop();
			nextInt = state.pop();
			state.push(Math.floor(nextInt / topInt) );
			return state;
		case "*/" :
			topInt = state.pop();
			state = numberStackReducer(state, {...action, type: '*'});
			state.push(topInt);
			return numberStackReducer(state, {...action, type: '/'});
		case "*/MOD" :
			topInt = state.pop();
			state = numberStackReducer(state, {...action, type: '*'});
			state.push(topInt);
			let divState = numberStackReducer(state, {...action, type: '/'});
			state = numberStackReducer(state, {...action, type: 'MOD'});
			state.push(divState.pop());
			return state;
		case "<" :
			topInt = state.pop();
			nextInt = state.pop();
			state.push(nextInt < topInt ? -1 : 0);
			return state;
		case ">" :
			topInt = state.pop();
			nextInt = state.pop();
			state.push(nextInt > topInt ? -1 : 0);
			return state;
		case "=" :
			topInt = state.pop();
			nextInt = state.pop();
			state.push(nextInt === topInt ? -1 : 0);
			return state;
		case "<>" :
			topInt = state.pop();
			nextInt = state.pop();
			state.push(nextInt !== topInt ? -1 : 0);
			return state;
	}

	return state;
};


const dictionaryReducer = function(state={stack: []}, action) {
	state = {...state, stack: [...state.stack] };
	action = {...action};
	switch(action.type) {
		case "CREATE_NEW_COMMAND" :
			if (action.payload instanceof CustomCommand) {
				action.payload.command = action.payload.command.trim();
				action.payload.comment = action.payload.comment.trim();
				state.stack.push(action.payload);
				let command = state[action.payload.name] = Object.assign({ indexes: [] }, {...state[action.payload.name]});
				command.indexes.push(state.stack.length - 1);
			} else {
				throw new CreateCustomCommandError();
			}

			return state;
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
	}

	return state;
};

const reducers = combineReducers({
	numberStack: numberStackReducer,
	dictionary: dictionaryReducer,
	displayStack: displayStackReducer
});

const searchDictionary = function(command, dictionary) {
	let indexes = [...Object.assign({ indexes: [] }, dictionary[command]).indexes]; 
	let index = indexes.pop();
	let customCommand = index >= 0 ? dictionary.stack[index].command : command	
	return customCommand;
};

class CustomCommand {
	constructor() {
		this.comment = "";
		this.command = "";
	}
}

class CreateCustomCommandError extends Error {
	constructor() {
		super("expected payload to be of type CustomCommand");
	}
}

const processCommands = function(action, next) {
	action = {...action, type: (action.type + "").trim() };
	let searchForWhiteSpace = /\s/gi;
	let returnActions = [];

	if (action.type.match(searchForWhiteSpace) !== null) {
		let commands = action.type.split(searchForWhiteSpace);
		let isWritingNewCommand = false;
		let isWritingNewComment = false;
		let customCommands = [];
		let startOfCustomCommandIndex = 0;
		commands.forEach(function(command, index) {
			switch(command) {
				case ":" :
					isWritingNewCommand = true;
					startOfCustomCommandIndex = index;
					customCommands.push(new CustomCommand() );
					break;
				case ";" :
					isWritingNewCommand = false;
					return next({...action, type: "CREATE_NEW_COMMAND", payload: customCommands.pop() });
				case "(" :
					isWritingNewComment = true;
					break;
				case ")" :
					if (isWritingNewCommand) {
						customCommands[customCommands.length - 1].comment += " " + command;
					}
					isWritingNewComment = false;
					return;
			}

			if (isWritingNewCommand === false && isWritingNewComment === false) {
				command = searchDictionary(command, {...store.getState().dictionary});
				returnActions = returnActions.concat(processCommands({...action, type: command }, next) );
				return; 
			} else if (isWritingNewCommand) {
				if (startOfCustomCommandIndex + 1 === index) {
					customCommands[customCommands.length - 1].name = command;
				} else if (isWritingNewComment === false && command !== ":")  {
					customCommands[customCommands.length - 1].command += " " + command;
				} else {
					customCommands[customCommands.length - 1].comment += " " + command;
				}
			}
		});
	} else {
		returnActions.push({...action, type: searchDictionary(action.type, {...store.getState().dictionary}) } );
	}

	return returnActions;
};

const processInput = store => next => action => {
	let actions = processCommands(action, next);
	actions.forEach(function(action, index) {
		return next(action);
	});
};

const printCommands = store => next => action => {
	switch(action.type.toUpperCase() ) {
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
