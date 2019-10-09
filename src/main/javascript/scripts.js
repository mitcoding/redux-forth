import {applyMiddleware, combineReducers, createStore} from "redux";
import {createLogger} from "redux-logger";
const numberStackReducer = function(state=[], action) {
	state = [...state];
	switch(action.type) {
		case "ABS" :
			state.push(Math.abs(state.pop() ) );
			return state;
		case "ADD_NUMBER" :
			state.push(action.payload);
			return state;
		case "CLEAR_INTEGER_STACK" :
			return [];
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
		case "." :
			return state.slice(0, state.length - 1);
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

const  errorHandler = store => next => action => {
	try {
		return next(action);
	} catch(e) {
		console.log("Caught an action exception!", e);
	}
};

const reducers = combineReducers({
	numberStack: numberStackReducer,
	dictionary: dictionaryReducer 
});

const middleware = applyMiddleware(createLogger() );
const store = window.store = createStore(reducers, middleware);
