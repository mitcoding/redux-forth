import AbortCompile from "./AbortCompile";
import AddCustomWord from "./AddCustomWord";
import CustomWord from "./CustomWord";
import TreeWord from "./TreeWord";

export default class Colon extends TreeWord {
	constructor(type = ":", comment) {
		super(type, comment);
	}
	
	build(buildTree, command) {
		return buildTree.currentCondition.openNode(buildTree, command);
	}

	closeNode(buildTree, command) {
		if (command.toUpperCase() !== ";") {
			buildTree.stack[0].closeNode.call(this, buildTree, command);
			return buildTree.next(new AbortCompile() );
		}

		return super.closeNode(buildTree, command);
	}

	openNode(buildTree, command) {
		
		if (buildTree.commands[buildTree.index - 1] === ":") {
			return this.addChildNode(new CustomWord(command), buildTree.next, buildTree.store);				
		}

		super.openNode(buildTree, command);
	}

	process(commands, index, store, next) {
		let 
			command = commands[index],
			customWordName = command.payload[0].type.toUpperCase(),
			words = command.payload.slice(1),
			comment = ""
		;

		if ((words[0] || {}).type === "(") {
			comment = "( " + words[0].payload.map(x => x.type).join(" ") + " )"
			words = words.slice(1);
		}
		
		next(new AddCustomWord(customWordName, comment, words) );

		return this;
	}
}