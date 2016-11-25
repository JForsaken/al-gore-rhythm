export default null;

/**
 * Formats a date to the follow format 'DD-MM-YYYY@hh-mm-ss'
 */
export const getDateTime = () => {
  const d = new Date();
  let dateTime = '';

  dateTime += `${(`00${d.getDate()}`).slice(-2)}-`;
  dateTime += `${(`00${(d.getMonth() + 1)}`).slice(-2)}-`;
  dateTime += `${d.getFullYear()}@`;
  dateTime += `${(`00${d.getHours()}`).slice(-2)}-`;
  dateTime += `${(`00${d.getMinutes()}`).slice(-2)}-`;
  dateTime += (`00${d.getSeconds()}`).slice(-2);

  return dateTime;
};
