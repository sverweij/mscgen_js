var getopt = require('posix-getopt');
var parser, option;

parser = new getopt.BasicParser('T:(type)i:(infile)o:(outfile)pl', process.argv);

while ((option = parser.getopt()) !== undefined && !option.error) {
    switch (option.option) {
    case 'T':
        process.stdout.write('type: ' + option.optarg + '\n');
        break;

    case 'i':
        process.stdout.write('input: ' + option.optarg + '\n');
        break;

    case 'o':
        process.stdout.write('output: ' + option.optarg + '\n');
        break;

    case 'p':
        process.stdout.write('print parsed msc' + '\n');
        break;

    case 'l':
        process.stdout.write('license' + '\n');
        break;

    default:
        /* error message already emitted by getopt */
        break;
    }
}

/*
if (parser.optind() >= process.argv.length)
    process.stderr.write('missing required argument: "input"\n');
*/

// process.stdout.write('input = %s', process.argv[parser.optind()]);
