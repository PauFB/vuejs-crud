var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var CRYPTOCURRENCIES_FILE = path.join(__dirname, 'src/assets/js/components/cryptocurrencies-data.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Additional middleware which will set headers that we need on each request.
app.use(function (req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/cryptocurrencies', function (req, res) {
    fs.readFile(CRYPTOCURRENCIES_FILE, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.json(JSON.parse(data));
    });
});

app.get('/api/cryptocurrency/search', function (req, res) {
    const name = req.query.name;

    fs.readFile(CRYPTOCURRENCIES_FILE, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var jsonArray = JSON.parse(data);

        var searchResults = jsonArray.filter(
            (jsonObj) => { return jsonObj.name.toLowerCase().includes(name.toLowerCase()) }
        )

        res.json(searchResults);
    })
})

app.get('/api/cryptocurrency/:id', function (req, res) {

    fs.readFile(CRYPTOCURRENCIES_FILE, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        var json = JSON.parse(data);

        for (var i = 0; i <= json.length; i++) {
            if (json[i]['id'] == req.params.id) {
                res.json(json[i]);
                break;
            }
        }
    });
});

app.post('/api/cryptocurrency/create', function (req, res) {

    fs.readFile(CRYPTOCURRENCIES_FILE, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var cryptocurrencies = JSON.parse(data);

        var newCryptocurrency = {
            id: Date.now(),
            description: req.body.description,
            name: req.body.name,
            price: req.body.price,
            priceTimestamp: Date()
        };
        cryptocurrencies.push(newCryptocurrency);
        fs.writeFile(CRYPTOCURRENCIES_FILE, JSON.stringify(cryptocurrencies, null, 4), function (err) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            res.json(cryptocurrencies);
        });
    });
});

app.patch('/api/cryptocurrency/edit/:id', function (req, res) {
    fs.readFile(CRYPTOCURRENCIES_FILE, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var cryptocurrencies = JSON.parse(data);

        for (var i = 0; i <= cryptocurrencies.length; i++) {
            if (cryptocurrencies[i]['id'] == req.params.id) {
                var cryptocurrency = cryptocurrencies[i];
                cryptocurrency.description = req.body.description;
                cryptocurrency.name = req.body.name;
                cryptocurrency.price = req.body.price;
                cryptocurrency.priceTimestamp = req.body.priceTimestamp;

                cryptocurrencies.splice(i, 1);
                cryptocurrencies.push(cryptocurrency);

                fs.writeFile(CRYPTOCURRENCIES_FILE, JSON.stringify(cryptocurrencies, null, 4), function (err) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    res.json(cryptocurrencies);
                });
                break;
            }
        }
    });
});

app.delete('/api/cryptocurrency/delete/:id', function (req, res) {
    fs.readFile(CRYPTOCURRENCIES_FILE, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var cryptocurrencies = JSON.parse(data);

        for (var i = 0; i <= cryptocurrencies.length; i++) {
            if (cryptocurrencies[i]['id'] == req.params.id) {
                cryptocurrencies.splice(i, 1);

                fs.writeFile(CRYPTOCURRENCIES_FILE, JSON.stringify(cryptocurrencies, null, 4), function (err) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    res.json(cryptocurrencies);
                });
                break;
            }
        }
    });
});


app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

setInterval(() => {
    fs.readFile(CRYPTOCURRENCIES_FILE, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var json = JSON.parse(data);
        json.forEach(element => {
            element.price = parseFloat((element.price + (Math.random() * (10.0) - 5.0)).toFixed(4));
            if (parseFloat(element.price) < 0.0)
                element.price = 0.0;
        });
        fs.writeFile(CRYPTOCURRENCIES_FILE, JSON.stringify(json), function (err) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });
}, 5000);
