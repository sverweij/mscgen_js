/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */

function wrap(pText, pMaxLength) {
    var lCharCount = 0;
    var lRetval = [];
    var lStart = 0;
    var lNewStart = 0;
    var lEnd = 0;

    var i = 0;
    var lText = pText.replace(/[\t\n]+/g, " ").replace(/\\n/g, "\n");

    while (i <= lText.length) {
        if (i >= (lText.length)) {
            lRetval.push(lText.substring(lStart, i));
        } else if (lText[i] === '\n') {
            lCharCount = 0;
            lEnd = i;
            lRetval.push(lText.substring(lStart, lEnd));
            lStart = lEnd + 1;
        } else if ((lCharCount++ >= pMaxLength)) {
            lEnd = lText.substring(0, i).lastIndexOf(' ');
            if (lEnd === -1 || lEnd < lStart) {
                lCharCount = 1;
                lEnd = i;
                lNewStart = i;
            } else {
                lCharCount = 0;
                lNewStart = lEnd + 1;
            }
            lRetval.push(lText.substring(lStart, lEnd));
            lStart = lNewStart;
        }
        i++;
    }
    return lRetval;
}

var gInput = "";

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
    gInput += chunk;
});

process.stdin.on('end', function() {
    var lThings = wrap(gInput, 40);
    for (var i = 0; i < lThings.length; i++) {
        process.stdout.write(lThings[i]);
        process.stdout.write('\n');
    }
    process.stdin.pause();
});
