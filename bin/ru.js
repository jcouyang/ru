#!/usr/bin/env node

var exec = require('child_process').exec;
var args = process.argv.slice(2).join(' ')

exec('sjs -m ./node_modules/ru-lang/index.sjs -l ./node_modules/ru-lang/src/readtable.js ' + args ,function (error, stdout, stderr) {
  console.log(stdout);
  if (error !== null) {
    console.log('exec error: ' + error);
  }});
