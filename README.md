# SAM Magia

Made to perform AWS SAM template deploy.

## What does SAM Magia do?
SAM Magia scans the project directories looking for files named template.yml, yaml or json. After the scan runs the script to package and deploy the SAM template in AWS CloudFormation.


## How it works?
 
First you need to install globally using npm: `npm install -g sam-magia` 
Then run it in the project root directory: `sam-magia .`.

SAM Magic will find all template.yml (yaml, json) files in the recursively directory and execute the following cli on each path:

*We use the project's .gitignore to ignore directories that may contain template files.* 

You can create your own deploy script by passing the filename as an argument to the command:`sam-magia deploy.sh`. Antes de executar o script de deploy, o SAM Magia definira algumas variavés, que s"ao:
 - *$templateFilename*: Name of the template file.
 - *$templateBasePath*: Name of the template file.
 - *$packagePath*: Package path.

### Deploy Script Example

```bash
cd $templateBasePath \
&& sam package --profile sophi --template-file $templateFilename --s3-bucket my-sam-deploy --output-template-file $packagePath \
&& sam deploy --profile sophi  --template-file $packagePath --stack-name my-stack-name \
&& rm $packagePath 
```
