const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const { version } = require('./package.json')

module.exports = () => {
    program
    .name('secrecy')
    .version(`v${version}`, '-v, --version')
    .option('-E, --encrypt', 'encrypt files')
    .option('-D, --decrypt', 'decrypt files')
    .option('-k, --key <password>', 'password for encryption/decryption')
    .option('-f, --file <file-name>', 'file to encrypt/decrypt')
    .parse(process.argv)

    function encrypt (password, data) {
        if (!password) {
            console.log('Specify a key')
            console.log('Use -h flag for help')
            process.exit(9)
        }

        if (!fs.existsSync(data)) {
            console.log('The specified file was not found')
            process.exit(9)
        }

        const algorithm = 'aes-192-cbc'
        const key = crypto.scryptSync(password, 'salt', 24)
        const iv = Buffer.alloc(16)
        
        const cipher = crypto.createCipheriv(algorithm, key, iv)

        const input = fs.createReadStream(data)
        const output = fs.createWriteStream(`${data}.sec`);

        input.pipe(cipher).pipe(output);
        
        // discard original file from disk
        fs.unlinkSync(data)
        console.log(chalk.green('Encryption successfull!!!'))
    }

    function decrypt (password, data) {
        if (!password) {
            console.log('Specify a key')
            console.log('Use -h flag for help')
            process.exit(9)
        }

        if (!fs.existsSync(data)) {
            console.log('The specified file was not found')
            process.exit(9)
        }

        const algorithm = 'aes-192-cbc'
        const key = crypto.scryptSync(password, 'salt', 24)
        const iv = Buffer.alloc(16)
        
        const decipher = crypto.createDecipheriv(algorithm, key, iv)
        const input = fs.createReadStream(data);
        const output = fs.createWriteStream(data.slice(0, data.length-4));

        input.pipe(decipher).pipe(output);

        // discard original file from disk
        fs.unlinkSync(data)
        console.log(chalk.green('Decryption successfull!!!'))
    }

    function secrecy () {
        if (program.encrypt && !program.decrypt) {
            if(program.file) {
                encrypt(program.key, program.file)
            }
            else {
                console.error('Please specify a file')
                console.error('Use -h flag for help')
            }
        } 
        else if (program.decrypt && !program.encrypt) {
            if(program.file) {
                decrypt(program.key, program.file)
            }
            else {
                console.error('Please specify a file')
                console.error('Use -h flag for help')
            }
        }
        else {
            if(program.decrypt && program.encrypt) {
                console.error('Cannot encrypt and decrypt at the same time')
                console.error('Use -h flag for help')
            }
            else{
                console.log(`Secrecy ${version} - Cryptographic tool for file encryption`)
                console.log('(C) Copyright 2019 Ekene Izukanne')
                console.log()
                console.log('Use -h flag for help')
            }
        }
    }
    secrecy()
}
