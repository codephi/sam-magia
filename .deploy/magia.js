#!/bin/node
const path = require('path')
const fs = require('fs')
const exec = require('child_process').execSync
const command = process.argv[2] || ''

const files = []
const templates = []

function findTemplate(dir){
    const dirSplit = dir.split('/')

    for(let i = dirSplit.length - 1; i > 0; i--){
        const dirJoin = dirSplit.splice(0,i).join('/')

        if(dirJoin.indexOf('lambdas/') === -1){
            return null
        }

        const pathSplit = [
            path.resolve(dirJoin, 'template.yml'),
            path.resolve(dirJoin, 'template.yaml'),
            path.resolve(dirJoin, 'template.json')
        ]

        const template = pathSplit.find(item => fs.existsSync(item))

        if(template){
            return template
        }
    }
}


exec(`cd ${process.cwd()} && git --no-pager log --name-status --max-count 1 --oneline | sed -n \'1!p\'`)
    .toString()
    .split('\n')
    .filter(item => item)
    .forEach(item => {
        item.split('\t').slice(1).forEach(file => {
            if(file.indexOf('lambdas/') === 0 && files.indexOf(file) === -1){
                files.push(file)
            }
        })
    })

files.map(file => {
    const dir = path.dirname(file)
    const template = findTemplate(dir)

    if(templates.indexOf(template) === -1){
        templates.push(template)
    }
})


console.log(templates)
