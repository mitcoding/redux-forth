import { store } from "../../../main/javascript/com/mitProductions/forth/kernel.js"

function booleanFlagToLowerCase(arrayJson) {
	arrayJson = arrayJson.replace(/([,\s]*)?true([,\s]*)/gi, "$1true$2").replace(/([,\s]*)false([,\s]*)/gi, "$1false$2");
	return arrayJson;
}

function convertStringNumberToNumber(array) {
	array = array.map((item) => {
		switch (true) {
			case (/^FALSE$/i).test(item):
				return 0;
			case (/^TRUE$/i).test(item):
				return -1;
			case /^[-]?\d+$/.test(item):
				return item * 1;
		}
		return item;
	});
	return array;
}

defineParameterType({
	name: "array", 
	regexp: /(\[[^\]]*\])/,
	transformer: function(arrayJson) {
		arrayJson = booleanFlagToLowerCase(arrayJson);

		return convertStringNumberToNumber(JSON.parse(arrayJson) );
	}
});

Before(function() {
	store.dispatch({type: "CLEARSTACK"});
	store.dispatch({type: "FORGETALL"});
	store.dispatch({type: "PAGE"});
	[...store.getState().integerStack].should.be.empty;
	[...store.getState().dictionary.stack].should.be.empty;
	[...store.getState().displayStack].should.eql(["ok"]);
});

Given('User has entered {int}', function (int) {
	store.dispatch({type: int});
});

When("User runs {string}", function (command) {
	store.dispatch({type: command});
});

Then('{string} should equal {array}', function (stackName, expectedArray) {
	stackName = stackName.substring(0,1).toLowerCase() + stackName.substring(1);

    let stack = store.getState()[stackName].slice();
	stack = convertStringNumberToNumber(stack);
	
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