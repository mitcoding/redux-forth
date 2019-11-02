import ForthCommandError from './ForthCommandError';

export default class ControlStructureMismatchError extends ForthCommandError {
	constructor(command) {
		super(command, "Control structure mismatch");
	}
}