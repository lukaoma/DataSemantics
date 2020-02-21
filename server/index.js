const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const fetch = require("node-fetch");
var convert = require('xml-js');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
    console.error(`Node cluster master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
    });

} else {
    const app = express();

    // Priority serve any static files.
    app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

    // Answer API requests.
    app.get('/api', async function (req, res) {
        res.set('Content-Type', 'application/json');
        const url = "https://www.cs.utexas.edu/~devdatta/traffic_camera_data.xml";
        await fetch(url).then(response => response.text())
            .then(text => {
                const reports = JSON.parse(convert.xml2json(text, {compact: true}));
                res.send(createSend(reports));
            });
    });

    function createSend(reports) {
        const responseJson = [{
            Camera_Attribute: "camera_status",
            Camera_Attribute_Value: "DESIRED",
            Count: 0
        }, {
            Camera_Attribute: "camera_status",
            Camera_Attribute_Value: "REMOVED",
            Count: 0
        }, {
            Camera_Attribute: "camera_status",
            Camera_Attribute_Value: "TURNED_ON",
            Count: 0
        }, {
            Camera_Attribute: "camera_status",
            Camera_Attribute_Value: "VOID",
            Count: 0
        }, {
            Camera_Attribute: "camera_mfg",
            Camera_Attribute_Value: "Advidia",
            Count: 0
        }, {
            Camera_Attribute: "camera_mfg",
            Camera_Attribute_Value: "Axis",
            Count: 0
        }, {
            Camera_Attribute: "camera_mfg",
            Camera_Attribute_Value: "Sarix",
            Count: 0
        }, {
            Camera_Attribute: "camera_mfg",
            Camera_Attribute_Value: "Spectra",
            Count: 0
        }, {
            Camera_Attribute: "ip_comm_status",
            Camera_Attribute_Value: "NO COMMUNICATION",
            Count: 0
        }, {
            Camera_Attribute: "ip_comm_status",
            Camera_Attribute_Value: "OFFLINE",
            Count: 0
        }, {
            Camera_Attribute: "ip_comm_status",
            Camera_Attribute_Value: "ONLINE",
            Count: 0
        }];
        // check each element and compare against each
        // report
        for (let report of reports["response"]["row"]) {
            for (let resJson of responseJson) {
                if (report[resJson.Camera_Attribute] != null) {
                    //better to do contains since has mutiple words
                    if (report[resJson.Camera_Attribute]["_text"].toLowerCase().includes(resJson.Camera_Attribute_Value.toLowerCase())) {
                        resJson.Count += 1;
                    }
                }
            }
        }
        return responseJson;
    }


    // All remaining requests return the React app, so it can handle routing.
    app.get('*', function (request, response) {
        response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
    });


    app.listen(PORT, function () {
        console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
    });
}
