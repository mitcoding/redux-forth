import React from "react"
Before(function() {
	store.dispatch({type: "CLEAR_INTEGER_STACK"});
});

Given('User has entered {int}', function (int) {
	store.dispatch({type: "ADD_NUMBER", payload: int});
	return true; 
});

When(/User runs ([^\s]+)$/i, function (command) {
	store.dispatch({type: command});
	return true;
});

Then(/^(\d+) should be on top of ([^\s]*)$/i, function (expectedInt, stackName) {
	stackName = stackName.substring(0,1).toLowerCase() + stackName.substring(1);
	expect([...store.getState()[stackName]].pop()).to.equal(expectedInt);
});

Then(/^([^\s]*) should only have (\d+) (numbers?|value)$/i, function(stackName, int, foo) {
	stackName = stackName.substring(0,1).toLowerCase() + stackName.substring(1);
	expect([...store.getState()[stackName]]).to.have.length(int);
});

Then('{int} should be under {int}', function(expectedUnderInt1, expectedInt1) {
	console.log(store.getState());
	let temp = [...store.getState().numberStack];
	let int1 = temp.pop();
	let intUnderInt1 = temp.pop();
	expect(int1, "top integer " + int1 + " to equal " + expectedInt1).to.equal(expectedInt1);
	expect(intUnderInt1, "integer under integer " + int1 + " to equal " + expectedUnderInt1).to.equal(expectedUnderInt1);
});
