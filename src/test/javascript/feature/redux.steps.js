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

function getStack(store, name) {
	if (name.toLowerCase() === "integerstack") {
		return store[name].stack.slice();
	}

	return store[name].slice();
}

defineParameterType({
	name: "array", 
	regexp: /(\[.*\])/,
	transformer: parseStringToArray
});

Before(function() {
	store.dispatch(actions.input("CLEARSTACK") );
	store.dispatch(actions.input("DECIMAL") );
	store.dispatch(actions.input("FORGETALL") );
	store.dispatch(actions.input("PAGE") );
	[...store.getState().integerStack.stack].should.be.empty;
	[...store.getState().dictionary.stack].should.be.empty;
	[...store.getState().displayStack].should.eql(["ok", " "]);
});

Given(/^User has entered (.*)/, function (command) {
	store.dispatch(actions.input(command) );
});

When("User runs {string}", function (command) {
	if (command) {
		store.dispatch(actions.input(command) );
	}
});

Then('{string} should equal {array}', function (stackName, expectedArray) {
	stackName = stackName.substring(0,1).toLowerCase() + stackName.substring(1);

    let stack = getStack(store.getState(), stackName);
	stack = convertAllStringNumbersToNumber(stack);
	
	stack.should.eql(expectedArray);
});

Then('{string} should be added to the dictionary', function (command) {
	let
		dictionary = JSON.parse(JSON.stringify(store.getState().dictionary) ),
		customWord = dictionary.terms[command.toUpperCase()],
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
		customWord = dictionary.terms[command]
	;
	
	should.not.exist(customWord);
});


Then('{string} should have a comment of {string}', function (command, comment) {
	let 
		dictionary = JSON.parse(JSON.stringify(store.getState().dictionary) ),
		customWord = (dictionary.terms[command.toUpperCase()] || { indexes: [] }),
		customDefinition = dictionary.stack[customWord.indexes.pop()] || { comment: '' }
	;
	
	customDefinition.comment.should.equal(comment);
});

Then('{string} mode should equal {string}', function (stackName, expectedMode) {
	stackName = stackName.substring(0,1).toLowerCase() + stackName.substring(1);
	
	let stackMode = store.getState()[stackName].mode;
	stackMode.should.equal(expectedMode);
});