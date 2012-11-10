#!/usr/bin/env node

var app = require('../app');
var argv = require('optimist')
  .usage('Use this tool to fetch real-time messages from an AIS TCP stream.\nYou can optionally pass a filter argument to only get specific messages.\n\nUsage: $0 -h [string] -p [num] -f [key:value]')
  .options({
    host: {
      demand: true,
      alias: 'h',
      description : 'Host to connect to (e.g. "-h example.com")'
    },
    port: {
      demand: true,
      alias: 'p',
      description: 'Port to connect to (e.g. "-p 12345")'
    },
    filter: {
      alias: 'f',
      description: 'Optional key/value pair to filter for (e.g. "-f msgid:5")'
    }
  })
  .argv;

var options = {
  host: argv.h,
  port: argv.p,
  filter: argv.f
}

app.init(options);