import {applyMiddleware, combineReducers, createStore} from "redux";
import {createLogger} from "redux-logger";


const numberStackReducer = function(state=[], action) {
	state = [...state];

	let specialDigitCommandRegex = /^([\d]+)([\+\*\/\-])$/gi;
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
		case "ADD_NUMBER" :
			state.push(action.payload);
			return state;
		case "CLEAR_INTEGER_STACK" :
			return [];
		case "DUP" :
			state.push(state[state.length - 1]);
			console.log(state);
			return state;
		case "DROP" :
			return state.slice(0, state.length - 1);
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

	}

	return state;
};


const dictionaryReducer = function(state={}, action) {
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

const printCommands = store => next => action => {
	switch(action.type) {
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

const middleware = applyMiddleware(createLogger(), printCommands);
const store = window.store = createStore(reducers, middleware);
