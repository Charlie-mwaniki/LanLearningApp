
var reader = require ("buffered-reader");
var BinaryReader = reader.BinaryReader;
var DataReader = reader.DataReader;

var lineToReplace = "your_line_to_replace";
var startLineOffset = 0;
var endLineOffset = 0;

new BufferedReader("Attendance.txt", { encoding: "utf8" })
    .on ("error", function (error){
        console.log (error);
    })
    .on ("line", function (line, byteOffset){
        startLineOffset = endLineOffset;
        endLineOffset = byteOffset - 1; //byteOffset is the offset of the NEXT byte. -1 if it's the end of the file, if that's the case, endLineOffset = <the file size>

        if (line === lineToReplace ){
            console.log ("start: " + startLineOffset + ", end: " + endLineOffset +
                    ", length: " + (endLineOffset - startLineOffset));
            this.interrupt (); //interrupts the reading and finishes
        }
    })
    .read ();
