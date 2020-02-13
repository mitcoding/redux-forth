import NumberWord from "../dictionnary/definitions/NumberWord"

export default class NumberStack {
	constructor(mode = NumberWord.DEC, stack = []) {
		this.mode = mode;
		this.stack = stack;
	}

	push() {
		this.stack.push.apply(this.stack, arguments);
		return this;
	}

	pushDecimal(decimal) {
		decimal = NumberWord.create(decimal, NumberWord.DEC);

		if (decimal) {
			switch(this.mode) {
				case NumberWord.HEX :
					this.push(decimal.toHex() );
					break;
				case NumberWord.BIN :
					this.push(decimal.toBinary() );
					break;
				default :
					this.push(decimal.toDecimal() );
			}
		}
		
		return this;
	}

	pop() {
		return this.stack.pop();
	}

	popAsDecimal() {
		let value = this.pop();
		if (!value) { return value; }
		
		return NumberWord.create(value, this.mode).toDecimal();
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

	getLastItemAsDecimal() {
		let value = this.getLastItem();
		if (!value) { return value; }
		
		return NumberWord.create(value, this.mode).toDecimal();
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