import ForthCommandError from './ForthCommandError';

export default class UnexpectedEndOfLineError extends ForthCommandError {
	constructor(command) {
		super(command, "Unexpected end-of-line");
	}
}