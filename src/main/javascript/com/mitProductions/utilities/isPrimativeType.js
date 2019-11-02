export const isPrimativeType = function (object) {
	return object === null || ({"bigint":1, "boolean":1, "number":1, "string":1, "symbol":1, "undefined":1})[(typeof object).toLowerCase()] ? true : false;
};