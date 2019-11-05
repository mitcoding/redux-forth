import DictionaryService from "../dictionnary/search/DictionaryService";
import { BuildTree } from "./BuildTree";

export const createExecutionTree = store => next => action => {
	var buildTree = new BuildTree(action, next, store, new DictionaryService); 
	return buildTree.run();
};