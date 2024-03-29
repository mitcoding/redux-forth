import AbortCompile from "../definitions/AbortCompile";
import Abs from "../definitions/Abs";
import Addition from "../definitions/Addition";
import And from "../definitions/And";
import Binary from "../definitions/Binary";
import CarriageReturn from "../definitions/CarriageReturn";
import ClearStack from "../definitions/ClearStack";
import Colon from "../definitions/Colon";
import Constant from "../definitions/Constant";
import Decimal from "../definitions/Decimal";
import Divide from "../definitions/Divide";
import Do from "../definitions/Do";
import DoubleQuote from "../definitions/DoubleQuote";
import Drop from "../definitions/Drop";
import Dup from "../definitions/Dup";
import Else from "../definitions/Else";
import Emit from "../definitions/Emit";
import Equals from "../definitions/Equals";
import False from "../definitions/False";
import Forget from "../definitions/Forget";
import ForgetAll from "../definitions/ForgetAll";
import GreaterThan from "../definitions/GreaterThan";
import Hex from "../definitions/Hex";
import If from "../definitions/If";
import NumberWord from "../definitions/NumberWord";
import LeftParenthesis from "../definitions/LeftParenthesis";
import LessThan from "../definitions/LessThan";
import Loop from "../definitions/Loop";
import Max from "../definitions/Max";
import Min from "../definitions/Min";
import Minus from "../definitions/Minus";
import Mod from "../definitions/Mod";
import Multiply from "../definitions/Multiply";
import MultiplyDivide from "../definitions/MultiplyDivide";
import MultiplyDivideModulo from "../definitions/MultiplyDivideModulo";
import Negate from "../definitions/Negate";
import Not from "../definitions/Not";
import NotEqual from "../definitions/NotEqual";
import Or from "../definitions/Or";
import Over from "../definitions/Over";
import Page from "../definitions/Page";
import Period from "../definitions/Period";
import PeriodDoubleQuote from "../definitions/PeriodDoubleQuote";
import PeriodEss from "../definitions/PeriodEss";
import Pick from "../definitions/Pick";
import RightParenthesis from "../definitions/RightParenthesis";
import Rot from "../definitions/Rot";
import Semicolon from "../definitions/Semicolon";
import SpecialIntegerWord from "../definitions/SpecialIntegerWord";
import Swap from "../definitions/Swap";
import Then from "../definitions/Then";
import True from "../definitions/True";
import UnknownWord from "../definitions/UnknownWord";
import Word from "../definitions/Word";

import { deepCopy } from "../../../utilities/deepCopy";


const defaultDictionary = {
	"ABORTCOMPILE" : AbortCompile,
	"ABS" : Abs,
	"AND" : And,
	"BINARY" : Binary,
	"CLEARSTACK" : ClearStack,
	"CONSTANT" : Constant,
	"CR" : CarriageReturn,
	"DECIMAL" : Decimal,
	"DO" : Do,
	"DUP" : Dup,
	"DROP" : Drop,
	"ELSE" : Else,
	"EMIT" : Emit,
	"FALSE" : False,
	"FORGET" :  Forget,
	"FORGETALL" : ForgetAll,
	"HEX" : Hex,
	"IF" : If,
	"LOOP" : Loop,
	"MAX" : Max,
	"MIN" : Min,
	"MOD" : Mod,
	"NEGATE" : Negate,
	"NOT" : Not,
	"OR" : Or,
	"OVER" : Over,
	"PAGE" : Page,
	"PICK" : Pick,
	"ROT" : Rot,
	"SWAP" : Swap,
	"THEN" : Then,
	"TRUE" : True,
	"." : Period,
	'."' : PeriodDoubleQuote,
	'"' : DoubleQuote,
	".S" : PeriodEss,
	";" : Semicolon,
	":" : Colon,
	"(" : LeftParenthesis,
	")" : RightParenthesis,
	"+" : Addition,
	"-" : Minus,
	"*" : Multiply,
	"/" : Divide,
	"*/" : MultiplyDivide,
	"*/MOD" : MultiplyDivideModulo,
	"<" : LessThan,
	">" : GreaterThan,
	"=" : Equals,
	"<>" : NotEqual
};

const getWord = function (command) {
	if (command instanceof Word) {
		return command.type.trim();
	}

	return command || "";
}

const isNumber = function (command, mode) {
	if (command instanceof NumberWord) {
		return command;
	}
	
	return NumberWord.create(command, mode);
}

const isSpecialDigitCommand = function (command) {
	let 
		specialDigitCommandRegex = /^([\d]+)([\+\*\/\-<>=]|(<>))$/gi,
		specialDigitCommandMatch = specialDigitCommandRegex.exec(command)
	;

	return specialDigitCommandMatch ? new SpecialIntegerWord(command, specialDigitCommandMatch) : false;
}

export default class DictionaryService {
	addCustomDefinitionStackIndex(word, customDictionaryStack) {

		let index = customDictionaryStack.length - 1;
		while (index > -1) {
			let customWord = customDictionaryStack[index];
			if (customWord.type.toUpperCase() === word.type.toUpperCase()) {
				word.index = index;
				break;
			}
			index--;
		}

		return word;
	}
		
	searchAll(command, customDictionary, findCommandOnly) {
		return this.searchCustom(command, customDictionary, findCommandOnly) || this.searchDefault(command, customDictionary.mode) || new UnknownWord(command);
	}

	searchCustom(command, customDictionary, findDefinitionOnly) {
		let 
			word = getWord(command),
			_dictionary = deepCopy(customDictionary),
			indexes = (_dictionary.terms[word.toUpperCase()] || { indexes: [] }).indexes,
			index = indexes.pop()
		;

		if (index >= 0 && _dictionary.stack[index]) {
			if (findDefinitionOnly) {
				return _dictionary.stack[index];
			}

			let customDefinitionTree = [];
			_dictionary.stack[index].payload.forEach(function search(word) {
				if (word.index > -1) {
					_dictionary.stack[word.index].payload.forEach(search);
				}
				else {
					customDefinitionTree.push(word);
				}
			});

			return customDefinitionTree;
		}

		return undefined;
	}

	searchDefault(command, mode = NumberWord.DEC) {
		let 
			word = getWord(command),
			Definition = isNumber(command, mode) || isSpecialDigitCommand(word) || defaultDictionary[word.toUpperCase()],
			notInstanceOfWordClass = !(Definition instanceof Word)
		;
		
		if (Definition && notInstanceOfWordClass) {
			return new Definition();
		}

		return Definition;
	}
}