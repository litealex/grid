var express = require('express'),
    app = express();


app.use(express.static('./dist'));
app.get('/data', function (req, res) {
    var header = [], rows = [], i, j, row;
    for (i = 0; i < 20; i++) {
        header.push({filedId: 'filed' + i, label: 'Поле №' + (i + 1)});
    }

    for (i = 0; i < 1000; i++) {
        row = {};
        header.forEach(function (cell) {
            row[cell.filedId] = i;
        });
        rows.push(row);
    }

    res.send({header: header, rows: rows});

});
app.get('/', function (req, res) {
    res.sendFile('./dist/index.html')
});

app.listen(3000, function () {
});