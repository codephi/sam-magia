cd $lambdaPath \
&& sam package --profile sophi --template-file $templateFilename --s3-bucket $s3BucketName --output-template-file $packagePath \
&& sam deploy --profile sophi  --template-file $packagePath --stack-name $stackName \
&& rm $packagePath
