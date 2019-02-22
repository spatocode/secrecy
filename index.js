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

    function encrypt () {
        
    }

    function decrypt () {

    }

    function multiple () {

    }
}
