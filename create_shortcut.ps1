Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 64, 64
$g = [System.Drawing.Graphics]::FromImage($bmp)
$emerald = [System.Drawing.Color]::FromArgb(255, 46, 204, 113)
$g.Clear($emerald)
$font = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center
$rect = New-Object System.Drawing.RectangleF(0, 0, 64, 64)
$g.DrawString("IT", $font, $brush, $rect, $format)
$iconHandle = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)
$stream = New-Object System.IO.FileStream("C:\Users\Galax\OneDrive\Escritorio\IdarThur\IdarThur.ico", [System.IO.FileMode]::Create)
$icon.Save($stream)
$stream.Close()
$g.Dispose()
$bmp.Dispose()

$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("C:\Users\Galax\OneDrive\Escritorio\IdarThur.lnk")
$Shortcut.TargetPath = "cmd.exe"
$Shortcut.Arguments = "/c cd /d C:\Users\Galax\OneDrive\Escritorio\IdarThur && start http://localhost:3000 && npm run dev"
$Shortcut.WorkingDirectory = "C:\Users\Galax\OneDrive\Escritorio\IdarThur"
$Shortcut.WindowStyle = 7
$Shortcut.IconLocation = "C:\Users\Galax\OneDrive\Escritorio\IdarThur\IdarThur.ico"
$Shortcut.Save()
