export const convertWordClassToAction = () => next => action => {
	return next({ type: "EXECTUE_WORD", word: action });
};