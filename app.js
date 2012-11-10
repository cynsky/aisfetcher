/**
 * Dependencies
 */

var net = require('net');

/**
 * Globals
 */

var host;
var port;
var key;
var value;
var data = '';
var aisClient;
var reconnectionTimeout;
var reconnectionCount = 0;

exports.init = function(options) {
  host = options.host;
  port = options.port;
  key = options.filter.split(':')[0];
  value = options.filter.split(':')[1];
  connectToAISStream();  
}

/**
 * AIS stream socket connection
 */

function connectToAISStream() {
  aisClient = net.connect({host: host, port: port}, function() {
    clearReconnectionTimeout();
    reconnectionCount = 0;
    aisClient.setEncoding('utf8');
    console.log('Connection to ' + host + ':' + port + ' established');

    aisClient.on('end', function() {
      console.log('Connection to ' + host + ':' + port + ' lost');
    });

    aisClient.on('close', function() {
      reconnectToAISStream();
    });

    aisClient.on('error', function(err) {
      console.log(err);
    });

    aisClient.on('data', function(chunk) {
      data += chunk;
      var messageSeperator = '\r\n';
      var messageSeperatorIndex = data.indexOf(messageSeperator);
      while (messageSeperatorIndex != -1) {
        var message = data.slice(0, messageSeperatorIndex);
        parseStreamMessage(message);
        data = data.slice(messageSeperatorIndex + 1);
        messageSeperatorIndex = data.indexOf(messageSeperator);
      }
      data = data.slice(messageSeperatorIndex + 1);
    });
  });
}

function reconnectToAISStream() {
  clearReconnectionTimeout();
  log('Trying to reconnect to ' + host + ':' + port);
  if (reconnectionCount == 0) {
    connectToAISStream();
  }
  else if (reconnectionCount > 60) {
    reconnectionTimeout = setTimeout(connectToAISStream, 300*1000);
  }
  else {
    reconnectionTimeout = setTimeout(connectToAISStream, reconnectionCount*1000);
  }
  reconnectionCount++;
}

function clearReconnectionTimeout() {
  if (reconnectionTimeout != null) {
    clearTimeout(reconnectionTimeout);
  }
}

function parseStreamMessage(message) {
  try {
    var json = JSON.parse(message);
  }
  catch (err) {
    log('Error parsing received JSON: ' + err + ', ' + data);
    return;
  }
  if (key != null) {
    if (json[key] == value) {
      console.log(JSON.stringify(json));
    }
  }
}