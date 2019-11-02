import { applyMiddleware } from "redux";
import { createExecutionTree } from "./createExecutionTree";
import { convertWordClassToAction } from "./convertWordClassToAction";

export const middleware = applyMiddleware(createExecutionTree, convertWordClassToAction);