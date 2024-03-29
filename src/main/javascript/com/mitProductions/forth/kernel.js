import { createStore } from "redux";
import { reducers } from "./reducers";
import { middleware } from "./middleware";

export const store = createStore(reducers, middleware);
export const actions = {
	input: function(command) { return { type: command }; } 
};
window.actions = actions;
window.store = store;