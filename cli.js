#!/usr/bin/env node
const path = require('path')
const exec = require('child_process').execSync
const getTemplates = require('./libs/getTemplates')
const fs = require('fs')

const samCommands = []
const rootPath = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd()
const deployFile = process.argv[3] || path.resolve(rootPath, 'deploy.sh')

try {
  samCommands.push(fs.readFileSync(deployFile).toString())
} catch (err) {
  console.error('Deploy file not found.')
  process.exit()
}

const templates = getTemplates(rootPath)

console.log('\nHANDLER COMMANDS...')

function packageOutputPath (key) {
  return path.resolve(rootPath, '.packages', `${Date.now()}-${key}.yml`)
}

const commandsRun = templates.map(template => {
  const commands = []

  for (const key in samCommands) {
    const packageOutput = packageOutputPath(key)
    const comm = samCommands[key].replace(/\$templateBasePath/g, template[0])
      .replace(/\$templateFilename/g, template[2])
      .replace(/\$packagePath/g, packageOutput)

    commands.push(comm)
  }

  return commands
})

console.log('\n---=INIT DEPLOY=---')

try {
  commandsRun.forEach(command => {
    try {
      for (let i = 0; i < command.length; i++) {
        console.log('\n-> Exec command', 1)
        console.log(`\n${command[i]}`)
        const stout = exec(command[i])
        console.log(stout.toString())
      }
    } catch (err) {
      throw new Error(err.message.toString())
    }
  })

  console.log('\nFINISH!!!')
} catch (err) {
  console.error(err.message)
}
