export const isPrimativeWrapper = function(object) {
	return (object instanceof Number || object instanceof String || object instanceof Boolean) ? true : false;
};