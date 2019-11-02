import { isPrimativeType } from "./isPrimativeType";
import { isPrimativeWrapper } from "./isPrimativeWrapper";

export const deepCopy = (object) => {
	if (isPrimativeType(object) ) {
		return object;
	}

	return Object.keys(object).reduce(function (output, key) {
		output[key] = deepCopy.call(this, object[key]);

		return output;
	}, isPrimativeWrapper(object) ? new object.constructor(object.valueOf() ) : new object.constructor() );
};