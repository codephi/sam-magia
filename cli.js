#!/usr/bin/env node
const path = require('path')
const exec = require('child_process').execSync
const getTemplates = require('./libs/getTemplates')
const fs = require('fs')

const samCommands = []

try {
    samCommands.push(fs.readFileSync(process.argv[2] || path.resolve(__dirname, 'deploy.sh')).toString())
} catch(err) {
    return console.error('Deploy file not found.')
}

const templates = getTemplates()

console.log('\nHANDLER COMMANDS...')

function packageOutputPath(key){
    return  path.resolve(__dirname, 'packages', `${Date.now()}-${key}.yml` )
}

const commandsRun = templates.map(template => {
    const commands = []

    for(let key in samCommands){
        const packageOutput = packageOutputPath(key)
        const comm = samCommands[key].replace(/\$lambdaPath/g , template[0])
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
                console.log(stout)
            }
        } catch (err){
            throw err
        }
    })

    console.log('\nFINISH!!!')
} catch (err){
    console.error(err.message)
}
