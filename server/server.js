var express = require('express'),
    app = express();


app.use(express.static('./dist'));
app.get('/data', function (req, res) {
    var header = [], rows = [], i, j, row;
    for (i = 0; i < 20; i++) {
        header.push({
            fieldId: 'field' + i,
            label: 'Поле №' + (i + 1) + (i==0? '<br>1':''),
            width: 200,
            isPin: i == 0
        });
    }

    for (i = 0; i < 1000; i++) {
        row = {};
        header.forEach(function (cell, index) {
            row[cell.fieldId] = i + (index?'':'<br>3');
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