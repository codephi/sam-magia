#!/bin/node
const path = require('path')
const exec = require('child_process').execSync
const command = process.argv[2]

const folders = []

exec('git --no-pager log --name-only --max-count 1 --oneline | sed -n \'1!p\'')
    .toString()
    .split('\n')
    .filter(item => item)
    .map(item => {
        const dir = path.dirname(item)
        if(!~folders.indexOf(dir)){
            folders.push(dir)
        }
    })



console.log(folders)
