const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const { version } = require('./package.json')

module.exports = () => {
    program
    .name('secrecy')
    .version(`v${version}`, '--v, --version')
    .option('-e, --encrypt', 'encrypts files')
    .option('-d, --decrypt', 'decrypts files')
    .option('-k, --key', 'password for encryption/decryptions')
    .option('-f, --file <file-name>', 'file to encrypt/decrypt')
    .option('-a, --all', 'encrypts/decrypts all files')
    .parse(process.argv)

    function encrypt (password, data) {
        const algorithm = 'aes-192-cbc'
        const key = crypto.scryptSync(password, 'salt', 24)
        const iv = Buffer.alloc(16)
        
        const cipher = crypto.createCipheriv(algorithm, key, iv)
        const input = fs.createReadStream(data);
        const output = fs.createWriteStream(`${data}.sec`);

        input.pipe(cipher).pipe(output);
    }

    function decrypt (password, data) {
        const algorithm = 'aes-192-cbc'
        const key = crypto.scryptSync(password, 'salt', 24)
        const iv = Buffer.alloc(16)
        
        const decipher = crypto.createDecipheriv(algorithm, key, iv)
        const input = fs.createReadStream(data);
        const output = fs.createWriteStream(data.slice(0, data.length-4));

        input.pipe(decipher).pipe(output);
    }

    function discard () {
        
    }

    function multiple () {

    }
}
