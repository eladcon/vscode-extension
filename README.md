# Rollout.io VS Code extension

This extension provides data about your Rollout.io's experiments from within VS Code.

Hover with the mouse on either your flag name or the isEnabled/getValue function to see the experiment data.

Currently only javascript and typescript are supported.

Guide for this sample: https://code.visualstudio.com/api/get-started/your-first-extension.

## Requirements

1. An active Rollout.io account
2. Obtain API Token from the dashboard (under App Settings -> Integrations)

## Installation
1. Install the extension
2. Update the `conf.rollout.apiToken` with your API Token

## Extension Settings

* `conf.rollout.apiToken`: API Token from the dashboard
* `conf.rollout.appId`: App Id - Limit the data to this app only 
* `conf.rollout.environmentName`: Environment Name - Limit the data to this environment only
* `conf.rollout.useLineForHover`: Hover anywhere in a line which contains a flag to see the experiment data

## Release Notes

### 0.0.1

Initial release of Rollout VS Code extension
