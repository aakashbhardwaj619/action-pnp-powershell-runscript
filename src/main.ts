import * as core from '@actions/core';
import { existsSync } from 'fs';
import PowerShellToolRunner from './PowerShellToolRunner';

async function main() {
    try {
        const siteUrl: string = core.getInput("SHAREPOINT_SITE_URL", { required: true });
        const username: string = core.getInput("ADMIN_USERNAME", { required: true });
        const password: string = core.getInput("ADMIN_PASSWORD", { required: true });
        const pnpPowerShellScriptPath = core.getInput("PNP_POWERSHELL_SCRIPT_PATH");
        const pnpPowerShellScript = core.getInput("PNP_POWERSHELL_SCRIPT");

        core.info("ℹ️ Executing script...");

        await PowerShellToolRunner.init();

        let script = `$ErrorActionPreference = "Stop"
            $WarningPreference = "SilentlyContinue"
            Install-Module -Name SharePointPnPPowerShellOnline -Force -Verbose -Scope CurrentUser
            $encpassword = convertto-securestring -String ${password} -AsPlainText -Force
            $cred = new-object -typename System.Management.Automation.PSCredential -argumentlist ${username}, $encpassword
            Write-Output "Connecting to SharePoint Online. Site Url: ${siteUrl}, Username: ${username}"
            Connect-PnPOnline -Url ${siteUrl} -Credentials $cred
            Write-Output "Connected."
        `;

        if (pnpPowerShellScriptPath) {
            if (!existsSync(pnpPowerShellScriptPath)) {
                throw new Error("Please check if the script path - PNP_POWERSHELL_SCRIPT_PATH - is correct.");
            }
            if (!pnpPowerShellScriptPath.toUpperCase().match(/\.PS1$/)) {
                throw new Error("Invalid file extension. Only .ps1 files are supported.");
            }
            script += `. ${pnpPowerShellScriptPath}`;
        } else {
            script += pnpPowerShellScript;
        }

        await PowerShellToolRunner.executePowerShellScriptBlock(script);

        core.info("✅ Script execution successful.");
    } catch (err) {
        core.error("🚨 Some error occurred");
        core.setFailed(err);
    }
}

main();