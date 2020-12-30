
exports.getDate = function(){
    var today = new Date();; 
    var options = {
        day:'numeric',
        weekday: 'short',
        month: 'long'
    };
    return today.toLocaleString('en-IN',options);
}
exports.getDay = function(){
    var today = new Date();; 
    var options = {
        weekday: 'long',
    };
    return today.toLocaleString('en-IN',options);
}