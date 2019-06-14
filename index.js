const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rl.stdoutMuted) rl.output.write("*");
  else rl.output.write(stringToWrite);
};
function help() {
  return {
    protocol : 
    [
      "Select Your Server Protocol(s)\n",
      "Enter one of: http | https | both \n",
      "Example(s) :",
      "https\tStarts the Secure Server.\n",
      "s\tAlso starts the Secure Server.\n",
      "both\tStart both the secure and standard servers.\n",
      "h\tOnly start the standard server.\n\n",
    ],
    
}
function main() {
    console.log(...help().protocol);
    //TODO: Add Command Line Argument ByBass
    return new Promise((resolve, reject) => {
      rl.stdoutMuted = false;
      rl.question("Enter Server Protocol (h)ttp|http(s)|(b)oth: \n", protocol => {
        if((protocol.substr(0, 1).toLowerCase() !== 'h' 
            && protocol.substr(0, 1).toLowerCase() !== 'b' 
            &&  protocol.substr(protocol.length - 1, 1).toLowerCase() !=='s') === true) {
          reject(main());
        }
        if(protocol.substr(0, 1).toLowerCase() === 'h' && protocol.substr(protocol.length - 1, 1).toLowerCase() ==='s') {
          resolve('https');
        } else if(protocol.substr(0, 1).toLowerCase() === 'b') {
          resolve('both');
        } else {
          resolve('http');
        }
      });
      rl.stdoutMuted = false;
    });
};
main().then(protocol => {
  const port = '443::80';
  const { spawn } = require('child_process');
  const child = spawn('node', ['server.js', protocol, port], {
    detached: true,
    stdio: 'ignore'
  });
  console.log('Server started. PID : ' ,  child.pid);
  child.unref();
  process.exit();
}).catch(error => {
  console.log('Ooops. Something went wrong trying to read input from the command line.');
  return main();
});
