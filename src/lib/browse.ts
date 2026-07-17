import {exec} from 'node:child_process'
import {promisify} from 'node:util'

const execAsync = promisify(exec)

export async function browseDirectory(defaultPath: string): Promise<string | undefined> {
  try {
    if (process.platform === 'win32') {
      const script = `
        Add-Type -AssemblyName System.Windows.Forms;
        $d = New-Object System.Windows.Forms.OpenFileDialog;
        $d.ValidateNames = $false;
        $d.CheckFileExists = $false;
        $d.CheckPathExists = $true;
        $d.FileName = 'Select Folder';
        $d.Filter = 'Folders|*.none';
        $d.Title = 'Select Download Location';
        $d.InitialDirectory = '${defaultPath.replace(/'/g, "''")}';
        if ($d.ShowDialog() -eq 'OK') {
          Write-Output ([System.IO.Path]::GetDirectoryName($d.FileName))
        }
      `
      const {stdout} = await execAsync(`powershell -Sta -NoProfile -Command "${script.replace(/\n/g, ' ')}"`)
      const path = stdout.trim()
      return path ? path : undefined
    } else if (process.platform === 'darwin') {
      const {stdout} = await execAsync(
        `osascript -e 'tell application "System Events" to return POSIX path of (choose folder default location "${defaultPath.replace(/"/g, '\\"')}")'`
      )
      const path = stdout.trim()
      return path ? path : undefined
    } else {
      // Linux
      try {
        const {stdout} = await execAsync(
          `zenity --file-selection --directory --filename="${defaultPath.replace(/"/g, '\\"')}"`
        )
        return stdout.trim()
      } catch {
        try {
          const {stdout} = await execAsync(
            `kdialog --getexistingdirectory "${defaultPath.replace(/"/g, '\\"')}"`
          )
          return stdout.trim()
        } catch {
          return undefined
        }
      }
    }
  } catch (error) {
    return undefined // User cancelled or error
  }
}
