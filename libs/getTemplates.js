const path = require('path')
const fs = require('fs')
const exec = require('child_process').execSync
const gitignore = require('./gitignore')

function findTemplate(dir, ignore){
    const dirSplit = dir.split('/')

    for(let i = dirSplit.length; i > 0; i--){
        const dirJoin = dirSplit.splice(0,i).join('/')

        if(ignore.absolute.find(item => dirJoin.indexOf(item) === 0) ||
            ignore.relative.find(item => dirJoin.indexOf(`/${item}`) > -1)){
            continue
        }

        const pathSplit = [
            path.resolve(dirJoin, 'template.yml'),
            path.resolve(dirJoin, 'template.yaml'),
            path.resolve(dirJoin, 'template.json')
        ]

        const template = pathSplit.find(item => fs.existsSync(item))

        if(template){
            return [path.resolve(dirJoin), template, template.split('/').slice(-1)]
        }
    }
}


module.exports = (rootPath) => {
    const files = []
    const templatesDir = []

    exec(`cd ${rootPath} && git --no-pager log --name-status --max-count 1 --oneline | sed -n \'1!p\'`)
        .toString()
        .split('\n')
        .filter(item => item)
        .forEach(item => {
            item.split('\t').slice(1).forEach(file => {
                if(files.indexOf(file) === -1){
                    files.push(file)
                }
            })
        })

    console.log('Modified files:')
    console.log(' - ' + files.join('\n - '))

    const ignore = {relative: [], absolute: []}

    try {
        const gitIgnorePath = path.resolve(rootPath, '.gitignore')
        const gitIgnoreFile = fs.readFileSync(gitIgnorePath).toString()

        gitignore.parse(gitIgnoreFile).patterns.forEach(item => {
            if(item.indexOf('/') === 0){
                ignore.absolute.push(item)
            } else {
                ignore.relative.push(item)
            }
        })
    } catch (err){
        console.error('.gitignore not found.')
    }

    console.log('\nFound template directories:')

    files.map(file => {
        const dir = path.dirname(file)
        const template = findTemplate(dir, ignore)

        if(template && templatesDir.indexOf(template) === -1){
            templatesDir.push(template)
            console.log(' - ' + template[1])
        }
    })

    return templatesDir
}
