import DictionaryService from "../dictionnary/search/DictionaryService";
import Print from "../dictionnary/definitions/Print";
import { BuildTree } from "./BuildTree";

export const createExecutionTree = store => next => action => {
	printActionTypeOnDisplayStack(action.type, next);

	let buildTree = new BuildTree(action, next, store, new DictionaryService);
	return buildTree.run();
};

function printActionTypeOnDisplayStack(type, next) {
	let print = new Print();
	print.payload.push(type);
	print.payload.push("\r");
	next(print);
}
