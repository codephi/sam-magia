#!/bin/node
const path = require('path')
const fs = require('fs')
const exec = require('child_process').execSync
const command = process.argv[2]

const folders = []

exec('git --no-pager log --name-status --max-count 1 --oneline | sed -n \'1!p\'')
    .toString()
    .split('\n')
    .filter(item => item)
    .forEach(item => {
        item.split('\t').forEach(file => {
            const dir = path.dirname(file)
            if(~dir.indexOf('lambdas/') & fs.existsSync(dir) && folders.indexOf(dir) === -1){
                folders.push(command.replace('$file', dir))
            }
        })
    })

console.log(folders)
