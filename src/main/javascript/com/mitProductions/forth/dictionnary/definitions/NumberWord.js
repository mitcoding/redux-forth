import Word from "./Word";

let 
	binaryRegex = /^0b[01]+$/,
	binToHex = {
		"0000" : 0,
		"0001" : 1,
		"0010" : 2,
		"0011" : 3,
		"0100" : 4,
		"0101" : 5,
		"0110" : 6,
		"0111" : 7,
		"1000" : 8,
		"1001" : 9,
		"1010" : "A",
		"1011" : "B",
		"1100" : "C",
		"1101" : "D",
		"1110" : "E",
		"1111" : "F"
	},
	hexRegex = /^0x[0-9A-F]+$/i,
	hexToBin = {
		0 : "0000",
		1 : "0001",
		2 : "0010",
		3 : "0011",
		4 : "0100",
		5 : "0101",
		6 : "0110",
		7 : "0111",
		8 : "1000",
		9 : "1001",
		A : "1010",
		B : "1011",
		C : "1100",
		D : "1101",
		E : "1110",
		F : "1111"
	}
;

function padBinary(binary) {
	const bits = binary.length;

	if (bits < 4) { return binary.padStart(4, 0); }
	if (bits < 8) { return binary.padStart(8, 0); }
	if (bits < 16) { return binary.padStart(16, 0); }
	if (bits < 32) { return binary.padStart(32, 0); }

	return binary.padStart(64, 0);
}

function padHex(hex) {	
	return hex.padStart(hex.length + (hex.length % 2), 0);
}

export default class NumberWord extends Word {
	constructor(type, comment = "( -- n1 )") {
		super(type, comment);
	}

	modifyIntegerStack(state) {
		let value;
		switch(state.mode) {
			case "bin" :
				value = this.toBinary();
				break;
			case "hex" :
				value = this.toHex();
				break;
			default :
				value = this.toDecimal();
				break;
		}
		
		state.push(value);
		return state;
	}
}

NumberWord.isHex = function isHex(value) {
	if (!value) { return false; }
	value = ("0x" + value).replace("0x0x", "0x");
	
	hexRegex.lastIndex = 0;
	return hexRegex.exec(value) ? true : false;
}

NumberWord.isBinary = function isBinary(value) {
	if (!value) { return false; }

	binaryRegex.lastIndex = 0;
	return binaryRegex.exec(value) ? true : false;
}

NumberWord.isDecimal = function isDecimal(value) {
	return !isNaN((value + "").split(/^0x|b/gi).join("") ) && !this.isBinary(value) ? true : false;
}

class BinaryWord extends NumberWord {
	toBinary() {
		return this.type.split(/^0b/).join("");
	}

	toHex() {
		const
			binary = padBinary(this.toBinary() ), 
			size = binary.length
		;

		let 
			index = 0, 
			hex = ""
		;

		do {
			hex += binToHex[binary.substr(index, 4)];
			index += 4;
		} while (index < size)

		return hex.toUpperCase();
	}

	toDecimal() {
		const
			binary = padBinary(this.toBinary() ),
			size = binary.length
		;
		
		let decimal = 0;
		for(let i = 0; i < size; i++) {
			let 
				exp = size - i - 1,
				sign = (size - i === size ? -1 : 1)
			;

			decimal += sign * binary.substr(i, 1) * Math.pow(2, exp); 
		}

		return decimal;
	}
}

class HexWord extends NumberWord {
	toBinary() {
		const
			hex = padHex(this.toHex() ), 
			size = hex.length
		;

		let binary = "";
		for(let i = 0; i < size; i++) {
			let hexBit = hex.substr(i, 1);
			if (i === 0 && hexBit === "0") {
				continue;
			}
			
			binary += hexToBin[hexBit];
		}

		return binary;
	}

	toHex() {
		return this.type.split(/^0x/).join("").toUpperCase();
	}

	toDecimal() {
		return BinaryWord.prototype.toDecimal.call(this);
	}
}

class IntegerWord extends NumberWord {
	toBinary() {
		const decimal = this.toDecimal();

        if (decimal < 0) {
                const
                        twosComplement = Number.MAX_SAFE_INTEGER + decimal + 1,
                        signValue = 1
                ;

                return twosComplement.toString(2).padStart(53, '0').padStart(64, signValue);
        }

        return decimal.toString(2);
	}

	toHex() {
		return BinaryWord.prototype.toHex.call(this);
	}

	toDecimal() {
		return this.type * 1;
	}
}

NumberWord.create = function(value, mode) {
	switch(mode) {
		case "dec" :
			if (this.isDecimal(value) ) { return new IntegerWord(value); }
			if (this.isBinary(value) ) { return new BinaryWord(value); }
			if (this.isHex(value) ) { return new HexWord(value); }
			
			break;
		case "hex" :
			if (this.isHex(value) ) { return new HexWord(value); }
			break;
		case "bin" :
			if (this.isBinary("0b" + value) ) { return new BinaryWord(value); }
			break;
	}

	return false;
};