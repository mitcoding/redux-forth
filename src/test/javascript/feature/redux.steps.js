import { store, actions } from "../../../main/javascript/com/mitProductions/forth/kernel.js"

function convertAllStringNumbersToNumber(array) {
	return array.map(parseStringToNumber);
}

function parseStringToArray(string) {
	string = string.replace(/([,\s]*)?true([,\s]*)/gi, "$1true$2").replace(/([,\s]*)false([,\s]*)/gi, "$1false$2");
	return JSON.parse(string, (key, value) => {
		return parseStringToNumber(value);
	});
}

function parseStringToNumber(value) {
	switch (true) {
		case Array.isArray(value) :
			return value;
		case (/^FALSE$/i).test(value):
			return 0;
		case (/^TRUE$/i).test(value):
			return -1;
		case /^[-]?\d+$/.test(value):
			return value * 1;
	}

	return value;
};

defineParameterType({
	name: "array", 
	regexp: /(\[.*\])/,
	transformer: parseStringToArray
});

Before(function() {
	store.dispatch(actions.input("CLEARSTACK") );
	store.dispatch(actions.input("FORGETALL") );
	store.dispatch(actions.input("PAGE") );
	[...store.getState().integerStack].should.be.empty;
	[...store.getState().dictionary.stack].should.be.empty;
	[...store.getState().displayStack].should.eql(["ok", " "]);
});

Given('User has entered {int}', function (int) {
	store.dispatch(actions.input(int) );
});

When("User runs {string}", function (command) {
	if (command) {
		store.dispatch(actions.input(command) );
	}
});

Then('{string} should equal {array}', function (stackName, expectedArray) {
	stackName = stackName.substring(0,1).toLowerCase() + stackName.substring(1);

    let stack = store.getState()[stackName].slice();
	stack = convertAllStringNumbersToNumber(stack);
	
	stack.should.eql(expectedArray);
});

Then('{string} should be added to the dictionary', function (command) {
	let
		dictionary = JSON.parse(JSON.stringify(store.getState().dictionary) ),
		customWord = dictionary[command.toUpperCase()],
		customDefinition = dictionary.stack[customWord.indexes.pop()]
	;

	if (command) {
		should.exist(customWord);
		should.exist(customDefinition);
	}
});

Then('{string} should not be added to the dictionary', function (command) {
	let 
		dictionary = JSON.parse(JSON.stringify(store.getState().dictionary) ),
		customWord = dictionary[command]
	;
	
	should.not.exist(customWord);
});


Then('{string} should have a comment of {string}', function (command, comment) {
	let 
		dictionary = JSON.parse(JSON.stringify(store.getState().dictionary) ),
		customWord = (dictionary[command.toUpperCase()] || { indexes: [] }),
		customDefinition = dictionary.stack[customWord.indexes.pop()] || { comment: '' }
	;
	
	customDefinition.comment.should.equal(comment);
});