'use strict';

var ObjectId = require('bson').ObjectId;

ObjectId.index = Math.floor(Math.random() * 4095);

// http://stackoverflow.com/questions/12532871/how-to-convert-a-very-large-hex-number-to-decimal-in-javascript?answertab=votes#tab-top
var hex2dec = function (s) {
  var add = function (x, y) {
    var c = 0, r = [];
    var x = x.split('').map(Number);
    var y = y.split('').map(Number);
    while(x.length || y.length) {
      var s = (x.pop() || 0) + (y.pop() || 0) + c;
      r.unshift(s < 10 ? s : s - 10); 
      c = s < 10 ? 0 : 1;
    }
    if(c) r.unshift(c);
    return r.join('');
  }
  var dec = '0';
  s.split('').forEach(function(chr) {
    var n = parseInt(chr, 16);
    for(var t = 8; t; t >>= 1) {
      dec = add(dec, dec);
      if(n & t) dec = add(dec, '1');
    }
  });
  return dec;
};

module.exports = function () {
  return hex2dec((new ObjectId()).toHexString());
};
