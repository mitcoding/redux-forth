import React from "react"
Before(function() {
	store.dispatch({type: "CLEAR_INTEGER_STACK"});
});

Given('User has entered {int}', function (int) {
	store.dispatch({type: "ADD_NUMBER", payload: int});
	return true; 
});

When('User runs {string}', function (command) {
	store.dispatch({type: command});
	return true;
});

Then('{int} should be on top', function (expectedInt) {
	expect([...store.getState().numberStack].pop()).to.equal(expectedInt);
});

Then(/^NumberStack should only have (\d+) numbers?$/, function(int) {
	expect([...store.getState().numberStack]).to.have.length(int);
});

Then('{int} should be under {int}', function(expectedUnderInt1, expectedInt1) {
	console.log(store.getState());
	let temp = [...store.getState().numberStack];
	let int1 = temp.pop();
	let intUnderInt1 = temp.pop();
	expect(int1, "top integer " + int1 + " to equal " + expectedInt1).to.equal(expectedInt1);
	expect(intUnderInt1, "integer under integer " + int1 + " to equal " + expectedUnderInt1).to.equal(expectedUnderInt1);
});
