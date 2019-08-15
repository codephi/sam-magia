#!/bin/node
const path = require('path')
const exec = require('child_process').execSync
const getTemplates = require('./getTemplates')

const { S3_BUCKET_NAME, STACK_NAME } = process.env

const samCommands = {
    package: `cd $path && \
sam package \
--template-file $templateFilename \
--s3-bucket $s3BucketName \
--output-template-file $packagePath`,
    deploy: `sam deploy \
--template-file $packagePath \
--stack-name $stackName`
}

const templates = getTemplates()

console.log('\n---=INIT DEPLOY =---')

const commandsRun = []
templates.map(template => {
    const samPackage = samCommands.package
        .replace('$path', template[0])
        .replace('$templateFilename', template[2])
        .replace('$s3BucketName', S3_BUCKET_NAME)
        .replace('$packagePath', path.resolve(__dirname, 'packages'))

    const deployPackage = samCommands.deploy
        .replace('$templateFilename', template[2])
        .replace('$stackName', STACK_NAME)

    commandsRun.push(samPackage, deployPackage)
})

console.log(commandsRun)
