const path = require('path')
const fs = require('fs')
const exec = require('child_process').execSync

function findTemplate(dir){
    const dirSplit = dir.split('/')

    for(let i = dirSplit.length; i > 0; i--){
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
            return [path.resolve(dirJoin), template, template.split('/').slice(-1)]
        }
    }
}

module.exports = () => {
    const files = []
    const templatesDir = []

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

    console.log('Modified files:')
    console.log(' - ' + files.join('\n - '))

    files.map(file => {
        const dir = path.dirname(file)
        const template = findTemplate(dir)

        if(template && templatesDir.indexOf(template) === -1){
            templatesDir.push(template)
        }
    })

    console.log('\nFound template directories:')
    console.log(' - ' + templatesDir.join('\n - '))

    return templatesDir
}
