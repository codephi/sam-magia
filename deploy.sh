#!/bin/sh

deployLambda()
{
name=$(basename "$0")
echo "$name"
}


###
# Main body of script starts here
###
# shellcheck disable=SC1073
files=$(git --no-pager log --name-only --max-count 1 --oneline | sed -n '1!p')

files | while read -r a; do echo $a; done

