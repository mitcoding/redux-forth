export default class NumberStack {
	constructor(mode = "dec", stack = []) {
		this.mode = mode;
		this.stack = stack;
	}

	push() {
		this.stack.push.apply(this.stack, arguments);
		return this;
	}

	pop() {
		return this.stack.pop();
	}

	clone() {
		return new NumberStack(this.mode, [...this.stack]);
	}
	
	filter() {
		this.stack = this.stack.filter.apply(this.stack, arguments);
		return this;
	}

	getByIndex(index) {
		return this.stack[index];
	}

	getLastItem() {
		return this.stack[this.length() - 1];
	}

	length() {
		return this.stack.length;
	}
	
	reduce() {
		return this.stack.reduce.apply(this.stack, arguments);
	}

	slice() {
		this.stack = this.stack.slice.apply(this.stack, arguments);
		return this;
	}
}