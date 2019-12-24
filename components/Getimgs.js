var Converter = require('ppt-png');
var glob = require('glob');
// options is optional
exports.init = async function (file){
   
    await glob('assets/'+file, {}, function(error, files) {
        console.log('files: ', files);
        if (files) {
                new Converter({
                    files:           files,
                    output:          'assets/images/',
                    invert:          false,
                    greyscale:       false,
                    deletePdfFile:   true,
                    outputType:      'png',
                    logLevel:        5,
                    fileNameFormat:  '_vers_%d',
                    callback:        function(data) {
                        console.log(data);
                        return true;
                    }
                }).run();
        }
        return false;
      });  
      
};


