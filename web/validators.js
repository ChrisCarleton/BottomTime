import { addValidationRule } from 'formsy-react';
import moment from 'moment';

addValidationRule('isDateTime', (values, value, format = 'YYYY-MM-DD hh:mmA') => {
	if (!value) {
		return true;
	}

	const date = typeof (value) === 'string'
		? moment(value, format)
		: moment(value);

	return date.isValid();
});

addValidationRule('isGreaterThan', (values, value, min) => {
	if (typeof value === 'string' && value.length > 0) {
		const parsed = parseFloat(value);
		return isNaN(parsed) ? false : parsed > min;
	}

	return true;
});

addValidationRule('isGreaterThanOrEqual', (values, value, min) => {
	if (typeof value === 'string' && value.length > 0) {
		const parsed = parseFloat(value);
		return isNaN(parsed) ? false : parsed >= min;
	}

	return true;
});

addValidationRule('isGreaterThanOrEqualToField', (values, value, field) => {
	if (!values[field] || values[field].length === 0) {
		return true;
	}

	const otherField = parseFloat(values[field]);
	if (isNaN(otherField)) {
		return true;
	}

	if (value && value.length > 0) {
		const parsed = parseFloat(value);
		return isNaN(parsed) ? false : parsed >= otherField;
	}

	return true;
});

addValidationRule('isBetween', (values, value, { min, max }) => {
	if (typeof value === 'string' && value.length > 0) {
		const parsed = parseFloat(value);
		return isNaN(parsed) ? false : min <= parsed && parsed <= max;
	}

	return true;
});

addValidationRule('maxDate', (values, value, params) => {
	if (!value) {
		return true;
	}

	params = params || {};
	params.format = params.format || 'YYYY-MM-DD hh:mmA';

	const date = typeof (value) === 'string'
		? moment(value, params.format, false)
		: moment(value);

	return date.isValid() && date.isSameOrBefore(params.max);
});

addValidationRule('minDate', (values, value, min, params) => {
	if (!value) {
		return true;
	}

	params = params || {};
	params.format = params.format || 'YYYY-MM-DD hh:mmA';

	const date = typeof (value) === 'string'
		? moment(value, params.format, false)
		: moment(value);

	return date.isValid() && date.isSameOrAfter(params.min);
});
