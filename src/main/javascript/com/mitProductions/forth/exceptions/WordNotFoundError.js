import ForthCommandError from './ForthCommandError';

export default class WordNotFoundError extends ForthCommandError {
	constructor(command) {
		super(command, command + " ?");
	}
}