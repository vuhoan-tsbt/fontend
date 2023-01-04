import moment from 'moment';

export const formatTime = (time: string) => {
  var formatted = moment(time).format('L');
  return formatted;
};
