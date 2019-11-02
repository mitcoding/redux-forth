export const convertWordClassToAction = store => next => action => {
	[...store.getState().integerStack];
	return next({type: "EXECTUE_WORD", word: action });
};