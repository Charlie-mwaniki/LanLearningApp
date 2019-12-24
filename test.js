var fs = require('fs')
fs.readFile("Attendance.txt", 'utf8', function (err,data) {

  var formatted = data.replace(/2/g, 'This new line replaces the old line');

 fs.writeFile("Attendance.txt", formatted, 'utf8', function (err) {
    if (err) return console.log(err);
 });
});