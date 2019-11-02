import ForthCommandError from './ForthCommandError';

export default class StackUnderFlowError extends ForthCommandError {
	constructor(command) {
		super(command, "Stack Underflow");
	}
}