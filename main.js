/* jshint -W097 */// jshint strict:false
/*jslint node: true */
'use strict';


const utils =    require(__dirname + '/lib/utils'); // Get common adapter utils
const adapter = new utils.Adapter('wettersuedtirol');
var request = require('request');


// is called when adapter shuts down - callback has to be called under any circumstances!
adapter.on('unload', function (callback) {
    try {
        adapter.log.info('cleaned everything up...');
        adapter.setState('info.connection', false, true);
        callback();
    } catch (e) {
        callback();
    }
});

// is called if a subscribed object changes
adapter.on('objectChange', function (id, obj) {
    // Warning, obj can be null if it was deleted
    adapter.log.info('objectChange ' + id + ' ' + JSON.stringify(obj));
});

// is called if a subscribed state changes
adapter.on('stateChange', function (id, state) {
    // Warning, state can be null if it was deleted
    adapter.log.info('stateChange ' + id + ' ' + JSON.stringify(state));

    // you can use the ack flag to detect if it is status (true) or command (false)
    if (state && !state.ack) {
        adapter.log.info('ack is not set!');
    }
});

// Some message was sent to adapter instance over message box. Used by email, pushover, text2speech, ...
adapter.on('message', function (obj) {
    if (typeof obj === 'object' && obj.message) {
        if (obj.command === 'send') {
            // e.g. send email or pushover or whatever
            console.log('send command');

            // Send response in callback if required
            if (obj.callback) adapter.sendTo(obj.from, obj.command, 'Message received', obj.callback);
        }
    }
});

// is called when databases are connected and adapter received configuration.
// start here!
adapter.on('ready', function () {
    main();
});

function main() {

    refreshState();

}

function refreshState()
{
    adapter.log.debug('refreshing Wetter Südtirol state');

    buildRequest(
        function (content) {
            adapter.setState('info.connection', true, true);

            adapter.setState('wetter.id', { val: content.id, ack: true });
            adapter.setState('wetter.date', { val: content.date, ack: true });
            adapter.setState('wetter.hour', { val: content.hour, ack: true }); 
            adapter.setState('wetter.evolution', { val: content.evolution, ack: true });
            adapter.setState('wetter.evolutionTitle', { val: content.evolutionTitle, ack: true });

            adapter.setState('wetter.today.date', { val: content.today.date, ack: true });
            adapter.setState('wetter.today.hour,', { val: content.today.hour, ack: true });
            adapter.setState('wetter.today.title', { val: content.today.title, ack: true });
            adapter.setState('wetter.today.conditions', { val: content.today.conditions, ack: true });
            adapter.setState('wetter.today.temperatures', { val: content.today.temperatures, ack: true });
            adapter.setState('wetter.today.imageUrl', { val: content.today.imageUrl, ack: true });
            adapter.setState('wetter.today.weather', { val: content.today.weather, ack: true });
            adapter.setState('wetter.today.bulletinStatus', { val: content.today.bulletinStatus, ack: true });
            adapter.setState('wetter.today.type', { val: content.today.type, ack: true });
            adapter.setState('wetter.today.tMinMin', { val: content.today.tMinMin, ack: true });
            adapter.setState('wetter.today.tMinMax', { val: content.today.tMinMax, ack: true });
            adapter.setState('wetter.today.tMaxMin', { val: content.today.tMaxMin, ack: true });
            adapter.setState('wetter.today.tMaxMax', { val: content.today.tMaxMax, ack: true });
            adapter.setState('wetter.today.reliability', { val: content.today.reliability, ack: true });

            adapter.setState('wetter.today.schlanders.code', { val: content.today.stationData[0].symbol.code, ack: true });
            adapter.setState('wetter.today.schlanders.description', { val: content.today.stationData[0].symbol.description, ack: true });
            adapter.setState('wetter.today.schlanders.imageUrl', { val: content.today.stationData[0].symbol.imageUrl, ack: true });
            adapter.setState('wetter.today.schlanders.max', { val: content.today.stationData[0].max, ack: true });
            adapter.setState('wetter.today.schlanders.min', { val: content.today.stationData[0].min, ack: true });

            adapter.setState('wetter.today.meran.code', { val: content.today.stationData[1].symbol.code, ack: true });
            adapter.setState('wetter.today.meran.description', { val: content.today.stationData[1].symbol.description, ack: true });
            adapter.setState('wetter.today.meran.imageUrl', { val: content.today.stationData[1].symbol.imageUrl, ack: true });
            adapter.setState('wetter.today.meran.max', { val: content.today.stationData[1].max, ack: true });
            adapter.setState('wetter.today.meran.min', { val: content.today.stationData[1].min, ack: true });

            adapter.setState('wetter.today.bozen.code', { val: content.today.stationData[2].symbol.code, ack: true });
            adapter.setState('wetter.today.bozen.description', { val: content.today.stationData[2].symbol.description, ack: true });
            adapter.setState('wetter.today.bozen.imageUrl', { val: content.today.stationData[2].symbol.imageUrl, ack: true });
            adapter.setState('wetter.today.bozen.max', { val: content.today.stationData[2].max, ack: true });
            adapter.setState('wetter.today.bozen.min', { val: content.today.stationData[2].min, ack: true });

            adapter.setState('wetter.today.sterzing.code', { val: content.today.stationData[3].symbol.code, ack: true });
            adapter.setState('wetter.today.sterzing.description', { val: content.today.stationData[3].symbol.description, ack: true });
            adapter.setState('wetter.today.sterzing.imageUrl', { val: content.today.stationData[3].symbol.imageUrl, ack: true });
            adapter.setState('wetter.today.sterzing.max', { val: content.today.stationData[3].max, ack: true });
            adapter.setState('wetter.today.sterzing.min', { val: content.today.stationData[3].min, ack: true });

            adapter.setState('wetter.today.brixen.code', { val: content.today.stationData[4].symbol.code, ack: true });
            adapter.setState('wetter.today.brixen.description', { val: content.today.stationData[4].symbol.description, ack: true });
            adapter.setState('wetter.today.brixen.imageUrl', { val: content.today.stationData[4].symbol.imageUrl, ack: true });
            adapter.setState('wetter.today.brixen.max', { val: content.today.stationData[4].max, ack: true });
            adapter.setState('wetter.today.brixen.min', { val: content.today.stationData[4].min, ack: true });

            adapter.setState('wetter.today.bruneck.code', { val: content.today.stationData[5].symbol.code, ack: true });
            adapter.setState('wetter.today.bruneck.description', { val: content.today.stationData[5].symbol.description, ack: true });
            adapter.setState('wetter.today.bruneck.imageUrl', { val: content.today.stationData[5].symbol.imageUrl, ack: true });
            adapter.setState('wetter.today.bruneck.max', { val: content.today.stationData[5].max, ack: true });
            adapter.setState('wetter.today.bruneck.min', { val: content.today.stationData[5].min, ack: true });

        },
        'GET',
        null
    );
}

function buildRequest(callback, method, data)
{
    var url = 'http://daten.buergernetz.bz.it/services/weather/bulletin?format=json&lang=' + adapter.config.mySelect;

    adapter.log.info('sending request to ' + url + ' with data: ' + JSON.stringify(data));

    request(
        {
            url: url,
            method: method,
            json: data ? data : true
        },
        function (error, response, content) {
            if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
               callback(content);
            } else if (error) {
                adapter.log.error(error);
            } else {
                adapter.log.error('Status Code: ' + response.statusCode + ' / Content: ' + content);
            }
        }
    );
}
