var express = require('express'),
    app = express();


app.use(express.static('./dist'));
app.get('/data', function (req, res) {
    var header = [], rows = [], i, j, row;
    for (i = 0; i < 20; i++) {
        header.push({
            fieldId: 'field' + i,
            label: 'Поле №' + (i + 1) + (i==4? '<br>1':''),
            width: 200,
            isPin: i < 2
        });
    }

    for (i = 0; i < 1000; i++) {
        row = {};
        header.forEach(function (cell) {
            row[cell.fieldId] = i;
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