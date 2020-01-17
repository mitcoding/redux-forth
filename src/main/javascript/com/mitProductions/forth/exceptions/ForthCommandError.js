export default class ForthCommandError extends Error {
	constructor(command, message) {
		super(command + " " + message);
		this.type = "ERROR";
		this.getMessage = function() { return message; };
	}

	modifyDisplayStack(state) {
		state.push(this.getMessage() );
		state.push("\r");
		return state;
	}

	modifyIntegerStack(state) { return state; }
}