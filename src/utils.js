const { DAY_BY_MILLISECONDS } = require('./const');

exports.checkSearchTerm = (value, searchTerm) => value?.toLowerCase().includes(searchTerm);
exports.checkBeforeDateOrNull = (creation, from) => !from || creation >= from;
exports.checkAfterDateOrNull = (creation, to) => !to || creation <= to + DAY_BY_MILLISECONDS;
