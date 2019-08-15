#!/usr/bash
sam package \
    --template-file template.yaml \
    --s3-bucket deploy-sam \
    --output-template-file packaged-.yaml \
    && \
sam deploy \
    --template-file ./packaged.yaml \
    --stack-name heimdall-authorizer-prod
