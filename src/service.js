const tickets = require("../data.json");
const { checkSearchTerm, checkBeforeDateOrNull, checkAfterDateOrNull } = require("./utils");

const checkIfMatchBySearch = ({ title, userEmail, content }, searchTerm) => !searchTerm || [title, userEmail, content].some(value => checkSearchTerm(value, searchTerm));
const checkIfMatchByDates = ({ creationTime }, from, to) => checkBeforeDateOrNull(creationTime, from) && checkAfterDateOrNull(creationTime, to);

exports.getFilteredTickets = ({ searchTerm, from, to }) => {
    const loweredSearchTerm = searchTerm?.toLowerCase();
    const timeFromDate = from?.getTime();
    const timeToDate = to?.getTime();

    return tickets.filter((ticket) => checkIfMatchBySearch(ticket, loweredSearchTerm) && checkIfMatchByDates(ticket, timeFromDate, timeToDate));
}
