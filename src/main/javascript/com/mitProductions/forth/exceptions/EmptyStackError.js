import ForthCommandError from './ForthCommandError';

export default class EmptyStackError extends ForthCommandError {
	constructor(command) {
		super(command, "Empty");
	}
}