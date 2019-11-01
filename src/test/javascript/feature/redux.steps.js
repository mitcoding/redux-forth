defineParameterType({
	name: "array", 
	regexp: /(\[[^\]]*\])/,
	transformer: function(arrayJson) {
		arrayJson = arrayJson.replace(/([,\s]*)?true([,\s]*)/gi, "$1-1$2").replace(/([,\s]*)false([,\s]*)/gi, "$10$2");

		return JSON.parse(arrayJson);
	}
});

Before(function() {
	store.dispatch({type: "CLEARSTACK"});
	store.dispatch({type: "PAGE"});
	store.dispatch({type: "FORGETALL"});
	[...store.getState().integerStack].should.be.empty;
	[...store.getState().dictionary.stack].should.be.empty;
	[...store.getState().displayStack].should.be.empty;
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

	stack.should.eql(expectedArray);
});

Then('{string} should be added to the dictionary', function (command) {
	let dictionary = JSON.parse(JSON.stringify(store.getState().dictionary) );
	let customWord = dictionary[command.toUpperCase()];
	let customDefinition = dictionary.stack[customWord.indexes.pop()];

	if (command) {
		should.exist(customWord);
		should.exist(customDefinition);
	}
});

Then('{string} should not be added to the dictionary', function (command) {
	let dictionary = JSON.parse(JSON.stringify(store.getState().dictionary) );
	let customWord = dictionary[command];
	
	should.not.exist(customWord);
});


Then('{string} should have a comment of {string}', function (command, comment) {
	let dictionary = JSON.parse(JSON.stringify(store.getState().dictionary) );
	let customWord = (dictionary[command.toUpperCase()] || { indexes: [] });
	let customDefinition = dictionary.stack[customWord.indexes.pop()] || { comment: '' };
	
	customDefinition.comment.should.equal(comment);
});
