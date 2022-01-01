# watersupply

````js
const ws = require('watersupply);

ws.get('/', function (req, res) {
    console.log(req.params);
    res.send('Hello Get World.');
});

ws.post('/test', function (req, res) {
    console.log(req.params);
    res.send('Hello Post World.');
});

ws.listen(3000);
```

#Installation
```bash
npm install watersupply
```
````
