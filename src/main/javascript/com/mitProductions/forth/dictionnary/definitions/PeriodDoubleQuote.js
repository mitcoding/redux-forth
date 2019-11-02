import Print from "./Print";
import TreeWord from "./TreeWord";

export default class PeriodDoubleQuote extends TreeWord {
	constructor(type = '."', comment) {
		super(type, comment);
	}
	
	build(buildTree, command) {
		return buildTree.currentCondition.openNode(buildTree, command);
	}

	process(commands, index, store, next) {
		let
			command = commands[index],
			message = command.payload.map((x) => x.type).join(" "),
			print = new Print();
		;

		print.payload.push(message);
		next(print);
		return this;
	}
}