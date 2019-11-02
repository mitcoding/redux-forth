import Word from "./Word";
import WordNotFoundError from "../../exceptions/WordNotFoundError";

export default class UnknownWord extends Word {
	process(commands, index, store, next) {
		next(new WordNotFoundError(commands[index].type) );
		return this;
	}
}