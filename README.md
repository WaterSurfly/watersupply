# watersupply
minimal http server

```js
const ws = require('watersupply);

ws.get('/', function (req, res) {
    console.log(req.params);
    res.send('Hello Get World.');
});

ws.post('/test', function (req, res) {
    console.log(req.params);
    res.send('Hello Post World.');
});

ws.get('/test2', function (req, res) {
    res.send('index');
});

ws.get('/test3', function (req, res) {
    res.render('index');
});

ws.listen(3000);
```

#Installation
```bash
npm install watersupply
```