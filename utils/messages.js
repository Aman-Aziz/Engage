const moment = require('moment');
function formatMessage(userName, textMessage){
   
    return {
        userName,
        textMessage,
        time : moment().utcOffset('+0530').format('h:mm a')
    }
}
module.exports = formatMessage;