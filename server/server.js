var express = require('express'),
    app = express();


app.use(express.static('./dist'));
app.get('/data', function (req, res) {
    var header = [];
    for (var i = 0; i < 20; i++) {
        header.push({filedId: 'filed' + i, label: 'Поле №' + (i + 1)});
    }

    //for(var)

});
app.get('/', function (req, res) {
    res.sendFile('./dist/index.html')
});

app.listen(3000, function () {
});