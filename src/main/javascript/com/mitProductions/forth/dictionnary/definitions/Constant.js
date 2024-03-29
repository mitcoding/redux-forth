import AddCustomWord from "./AddCustomWord";
import NumberWord from "./NumberWord";
import StackUnderFlowError from  "../../exceptions/StackUnderFlowError";
import TreeWord from "./TreeWord";

export default class Constant extends TreeWord {
	constructor(type = "CONSTANT", comment = "( -- w)") {
		super(type, comment);
	}

	build(buildTree, command) {
		buildTree.currentCondition.openNode(buildTree, command);
		
		let newConstant = buildTree.commands[++buildTree.index] || "";

		buildTree.currentCondition.addChildNode(
			buildTree.dictionaryService.searchAll(newConstant, buildTree.store.getState().dictionary, true),
			buildTree.next,
			buildTree.store
		);

		buildTree.currentCondition.closeNode(buildTree);
	}

	process(commands, index, store, next, processTree, dictionaryService) {
		let 
			mode = store.getState().integerStack.mode,
			name = commands[index].payload[0].type,
			number = NumberWord.create(store.getState().integerStack.clone().pop(), mode);
		;

		if (!number) {
			return next(new StackUnderFlowError() );
		}

		next(dictionaryService.searchDefault("DROP"), mode);
		next(new AddCustomWord(name.toUpperCase(), "( -- " + number.toDecimal() + ")", [number]) );
		return this;
	}
}