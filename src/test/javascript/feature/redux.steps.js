Before(function() {
	store.dispatch({type: "CLEAR_INTEGER_STACK"});
	store.dispatch({type: "CLEAR_DISPLAY_STACK"});
	store.dispatch({type: "CLEAR_DICTIONARY"});
});

Given('User has entered {int}', function (int) {
	store.dispatch({type: int});
});

When("User runs {string}", function (command) {
	store.dispatch({type: command});
});

Then('{string} should equal {string}', function (stackName, arrayJson) {
	stackName = stackName.substring(0,1).toLowerCase() + stackName.substring(1);

	let expectedArray = JSON.parse(arrayJson.replace(/([,\s]*)?true([,\s]*)/gi, "$1-1$2").replace(/([,\s]*)false([,\s]*)/gi, "$10$2") );
        let stack = store.getState()[stackName].slice();

	expect(stack).to.eql(expectedArray);
});

Then('{string} should be added to the dictionary', function (command) {
	let dictionary = JSON.parse(JSON.stringify(store.getState().dictionary) );

	if (command) {
		expect(dictionary[command.toUpperCase()]).to.exist;
		expect(dictionary.stack[dictionary[command.toUpperCase()].indexes.pop()]).to.exist;
	}
});

Then('{string} should not be added to the dictionary', function (command) {
	let dictionary = JSON.parse(JSON.stringify(store.getState().dictionary) );

	expect(dictionary[command]).to.not.exist;
});


Then('{string} should have a comment of {string}', function (command, comment) {
		command = command.toUpperCase();

		let dictionary = JSON.parse(JSON.stringify(store.getState().dictionary) );
		let customCommand = dictionary.stack[(dictionary[command] || { indexes: [] }).indexes.pop()] || { comment: '' };

		expect(customCommand.comment, "customCommand.comment to equal '" + comment + "' but got '" + customCommand.comment + "' instead").to.equal(comment);
	
});
