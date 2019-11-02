import Constant from "./Constant";
import RemoveCustomWord from "./RemoveCustomWord";
import UnknownWord from "./UnknownWord";
import UnexpectedEndOfLineError from "../../exceptions/UnexpectedEndOfLineError";
import WordNotFoundError from "../../exceptions/WordNotFoundError";

export default class Forget extends Constant {
	constructor(type = "FORGET", comment) {
		super(type, comment);
	}

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