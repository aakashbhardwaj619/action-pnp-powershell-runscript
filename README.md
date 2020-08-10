# PnP PowerShell runscript GitHub action

GitHub action to to run a line of PnP PowerShell script supplied to it or run code in a script file supplied to it.

## Features
- Installs [PnP PowerShell](https://docs.microsoft.com/en-us/powershell/sharepoint/sharepoint-pnp/sharepoint-pnp-cmdlets?view=sharepoint-ps) module
- Connects to the specified site using the [Connect-PnPOnline](https://docs.microsoft.com/en-us/powershell/module/sharepoint-pnp/connect-pnponline?view=sharepoint-ps) command
- Executs the passed in script containing PnP PowerShell commands

## Usage
### Pre-requisites
Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#example-workflow---PnP-PowerShell-runscript) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Supported Opearting System
- This action only works with `Windows` Operations System
- This action only works for SharePoint Online

#### Optional requirement
Since this action requires user name and password which are sensitive pieces of information, it would be ideal to store them securely. We can achieve this in a GitHub repo by using [secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets). So, click on `settings` tab in your repo and add 2 new secrets:
- `adminUsername` - store the admin user name in this (e.g. user@contoso.onmicrosoft.com)
- `adminPassword` - store the password of that user in this.
These secrets are encrypted and can only be used by GitHub actions.

### Inputs
- `SHAREPOINT_SITE_URL` : **Required** URL of the SharePoint Site.
- `ADMIN_USERNAME` : **Required** Username of the admin.
- `ADMIN_PASSWORD` : **Required** Password of the admin.
- `PNP_POWERSHELL_SCRIPT_PATH` : Relative path of the script in your repo
- `PNP_POWERSHELL_SCRIPT` : PnP PowerShell script

### Example workflow - PnP PowerShell Runscript
On every `push` build the code, execute the script.

```yaml
name: SPFx CICD with PnP PowerShell

on: [push]

jobs:
  build:
    ##
    ## Build code omitted
    ##
        
  deploy:
    needs: build
    runs-on: windows-latest
    env:
      siteUrl: https://contoso.sharepoint.com/sites/teamsite
    
    steps:
    
    # PnP PowerShell runscript action option 1 (single line of script as input)
    - name: Add Site Collection App Catalog
      uses: aakashbhardwaj619/action-pnp-powershell-runscript@master
      with:
        SHAREPOINT_SITE_URL: ${{ env.siteUrl }}
        ADMIN_USERNAME: ${{ secrets.adminUsername }}
        ADMIN_PASSWORD: ${{ secrets.adminPassword }}
        PNP_POWERSHELL_SCRIPT: Add-PnPSiteCollectionAppCatalog -Site ${{ env.siteUrl }}
     
    # PnP PowerShell runscript action option 2 (script file as input)
    - name: Provision lists
      uses: aakashbhardwaj619/action-pnp-powershell-runscript@master
      with:
        SHAREPOINT_SITE_URL: ${{ env.siteUrl }}
        ADMIN_USERNAME: ${{ secrets.adminUsername }}
        ADMIN_PASSWORD: ${{ secrets.adminPassword }}
        PNP_POWERSHELL_SCRIPT_PATH: ./script/provisioning.ps1
    # Option 2 - ends
```
