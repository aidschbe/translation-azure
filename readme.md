# Azure AI Translation Script

A simple script to translate texts or documents with the help of Azure AI services, written in node.js.

## Installation

Authorization in the Azure environment is accomplished via SAS-tokens and implemented with dotenv (which has not been committed to the repo for security reasons).

Please make sure you review the env-template.txt file to see which variables are needed.


## Intended Usage

Documents: create translator (-> optionally upload glossary) -> upload files -> translate document -> download files -> delete files

Text: create translator (-> optionally upload glossary) -> translate text

See index for test code.

## TODO

- add GUI