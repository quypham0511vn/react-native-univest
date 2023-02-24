import Moment from "moment";

const DEFAULT_DATE_FORMAT = "DD/MM/YYYY";
const DEFAULT_DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm:ss";

export const SERVER_DATE_FORMAT = "YYYY-MM-DD";

function formatSimpleDate(date: string) {
  return Moment(date).utc(true).format(DEFAULT_DATE_FORMAT);
}

function getCurrentYear() {
  return new Date().getFullYear();
}

function getCurrentTime() {
  return Moment().valueOf();
}

function getLongFromDate(date: number, format = DEFAULT_DATE_FORMAT) {
  if (date) return Moment(date * 1000).format(format);
  return null;
}

function getDateByLong(date: number) {
  return Moment(date * 1000).format("YYYY-MM-DD HH:mm:ss");
}

function formatDatePicker(date: string) {
  return Moment(date).utc(true).format(DEFAULT_DATE_FORMAT);
}

function getCurrentDateTime() {
  return Moment(Moment().valueOf()).utc(true).format("YYYY-MM-DD HH:mm");
}

function getCurrentDay() {
  return Moment(Moment().valueOf()).utc(true).format(DEFAULT_DATE_FORMAT);
}
/**
 *
 * date1: yyyy-MM-ddTHH:mm:ss, convert to milliseconds
 * date2: getTime from server, convert to milliseconds
 */
function isDateBeforeCurrent(date1: number, date2: number) {
  const dateObj = new Date(date1);
  const unixTime = formatUnixTime(date2);
  return dateObj.getTime() < unixTime;
}

/**
 *
 * input: server time
 * @returns milliseconds time
 */
function formatUnixTime(input: number) {
  return input / 10000 - 62135596800000;
}

function formatDateToTicks(date: string) {
  return (
    Moment(date, DEFAULT_DATE_FORMAT)
      .utc(true)
      .hours(23)
      .minutes(59)
      .seconds(59)
      .valueOf() *
      10000 +
    621355968000000000
  );
}

function getDateByFormat(date: string, format?: string) {
  return Moment(date).utc(true).format(format);
}

function getServerDateFormat(date: string) {
  return Moment(date).utc(true).format(SERVER_DATE_FORMAT);
}

function getServerDateByDiff(diff: number) {
  return Moment().utc(true).add(diff, "days").format(SERVER_DATE_FORMAT);
}

function getDateFromString(date?: string, format = DEFAULT_DATE_FORMAT) {
  return date ? Moment(date, format).toDate() : new Date();
}

function getDateFromServer(date?: string, format = SERVER_DATE_FORMAT) {
  if (date) return Moment(date, DEFAULT_DATE_FORMAT).format(format);
  return "";
}

function getDateFromClient(date?: string, format = DEFAULT_DATE_FORMAT) {
  if (date) {
    return Moment(date, SERVER_DATE_FORMAT).format(format);
  }
  return "";
}
function formatSimpleDateTimeHour(date: string) {
  return Moment(date).utc(true).format(DEFAULT_DATE_TIME_FORMAT);
}

// moment format unix timestamp to date
function formatUnixTimestampToDate(timestamp: number) {
  return Moment.unix(timestamp).format(DEFAULT_DATE_FORMAT);
}

function formatUnixTimestampToFullDate(timestamp: number) {
  return Moment.unix(timestamp).format(DEFAULT_DATE_TIME_FORMAT);
}

export default {
  formatSimpleDate,
  getCurrentYear,
  getCurrentTime,
  formatDatePicker,
  isDateBeforeCurrent,
  formatUnixTime,
  formatDateToTicks,
  getCurrentDateTime,
  getCurrentDay,
  getLongFromDate,
  getDateByLong,
  getDateByFormat,
  getServerDateFormat,
  getServerDateByDiff,
  getDateFromString,
  getDateFromServer,
  getDateFromClient,
  formatSimpleDateTimeHour,
  formatUnixTimestampToDate,
  formatUnixTimestampToFullDate
};
