var net = require('net');
var colors = require('colors');

var host = 'irc.quakenet.org';
var port = 6667;

var client = new net.Socket();
var rn = 1;
var registered = false;

var options = {
  user: 'USER evald070 8 * :ronny\r\n',
  nick: 'NICK n0d3b0t\r\n'
};

client.connect(port, host, function() {
  let info = 'Connected to ' + host + ':'+ port;
  console.log(info.yellow);
});

client.on('data', function(data) {
  let row = data.toString();
  checkPing(row, client);

  if(!registered && row.includes('No ident response')) {
    registerUser(client, options);
    registered = false;
  }

  rowNum = '['+rn+']';
  console.log(rowNum.cyan, row.green);
  rn++;
});

client.on('close', function() {
  console.log('Connection closed'.yellow);
});

function registerUser(client, opts) {
  console.log('Register user'.yellow);
  console.log(">> " + opts.user.yellow);
  client.write(opts.user);
  console.log(">> " + opts.nick.yellow);
  client.write(opts.nick);
}

function checkPing(row, client) {
  if(row.startsWith('PING')) {
    let pong = row.replace('PING', 'PONG');
    console.log(pong.magenta);
    client.write(row.replace('PING', 'PONG').concat('\r\n'));
  }
}
