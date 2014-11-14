process.stdin.resume();

process.stdin.on('data', function(data) {
    process.stdout.write(data);
});

process.stdin.on('end', function() {
    process.stdout.end();
});
