#!/usr/bin/env node
const path = require('path')
const exec = require('child_process').execSync
const getTemplates = require('./libs/getTemplates')
const fs = require('fs')

const samCommands = []
let rootPath = process.cwd()

try {
    if(process.argv[2]){
        rootPath = path.resolve(process.argv[2])

        if(process.argv[3]){
            samCommands.push(fs.readFileSync(process.argv[3]).toString())
        } else {
            samCommands.push(fs.readFileSync(path.resolve(rootPath, 'deploy.sh')).toString())
        }
    } else {
        samCommands.push(fs.readFileSync(path.resolve(rootPath, 'deploy.sh')).toString())
    }
} catch(err) {
    return console.error('Deploy file not found.')
}

const templates = getTemplates(rootPath)

console.log('\nHANDLER COMMANDS...')

function packageOutputPath(key){
    return  path.resolve(rootPath, '.packages', `${Date.now()}-${key}.yml` )
}

const commandsRun = templates.map(template => {
    const commands = []

    for(let key in samCommands){
        const packageOutput = packageOutputPath(key)
        const comm = samCommands[key].replace(/\$templateBasePath/g , template[0])
            .replace(/\$templateFilename/g, template[2])
            .replace(/\$packagePath/g , packageOutput)

        commands.push(comm)
    }

    return commands
})

console.log('\n---=INIT DEPLOY=---')

try {
    commandsRun.forEach(command => {
        try {
            for(let i = 0; i < command.length; i++){
                console.log('\n-> Exec command', 1)
                console.log(`\n${command[i]}`)
                const stout = exec(command[i])
                console.log(stout.toString())
            }
        } catch (err){
            throw new Error(err.message.toString())
        }
    })

    console.log('\nFINISH!!!')
} catch (err){
    console.error(err.message)
}
