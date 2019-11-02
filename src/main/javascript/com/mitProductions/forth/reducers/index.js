import { combineReducers } from "redux";
import { compileStackReducer } from "./compileStackReducer";
import { dictionaryReducer } from "./dictionaryReducer";
import { displayStackReducer } from "./displayStackReducer";
import { integerStackReducer } from "./integerStackReducer";

export const reducers = combineReducers({
	compileStack: compileStackReducer,
	dictionary: dictionaryReducer,
	displayStack: displayStackReducer,
	integerStack: integerStackReducer
});