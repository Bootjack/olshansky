# Olshansky
A Morse Code input and interpretation library
Created for ATS Hack Day 2016

# [Live Demo](http://bootjack.github.io/olshansky/)

## Conventions with git
Initial setup
* clone the original repository
* create a new local branch
`$ git checkout -b local`

While you're working locally
* commit your changes
`$ git commit -am "Commit message"`

When you're ready to share
* check out master branch
`$ git checkout master`
* pull any changes from the shared repository
`$ git pull origin master`
* switch back to local branch
`$ git checkout local`
* rebase your local branch onto master
`$ git rebase master`
* switch to master again
`$ git checkout master`
* merge your local onto master (should be a simple fast-forward merge)
`$ git merge local`
* push your changes to the shared repository
`$ git push origin master`
