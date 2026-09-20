Add-Type -TypeDefinition @"
using System;
using System.IO;
using System.Text;

public class TextCleaner {
    public static void Clean(string filePath) {
        if (!File.Exists(filePath)) return;
        string text = File.ReadAllText(filePath, Encoding.UTF8);
        string orig = text;

        // Fix mangled sequences:
        text = text.Replace("\u00E2\u20AC\u201D", "\u2014"); // em-dash —
        text = text.Replace("\u00E2\u20AC\u2013", "\u2013"); // en-dash –
        text = text.Replace("\u00E2\u20AC\u2122", "\u2019"); // right single quote ’
        text = text.Replace("\u00E2\u20AC\u02DC", "\u2018"); // left single quote ‘
        text = text.Replace("\u00E2\u20AC\u0153", "\u201C"); // left double quote “
        text = text.Replace("\u00E2\u20AC\u009D", "\u201D"); // right double quote ”
        text = text.Replace("\u00E2\u2020\u2019", "\u2192"); // right arrow →
        text = text.Replace("\u00E2\u2020\u0090", "\u2190"); // left arrow ←
        text = text.Replace("\u00E2\u02DC\u2026", "\u2605"); // star ★
        text = text.Replace("\u00C2\u00A9", "\u00A9");       // copyright ©
        text = text.Replace("\u00E2\u201A\u00AC", "\u20AC"); // euro €
        text = text.Replace("102\u00C2\u00B0", "102\u00B0"); // degree 102°

        if (text != orig) {
            File.WriteAllText(filePath, text, new UTF8Encoding(false));
            Console.WriteLine("Cleaned: " + filePath);
        }
    }
}
"@

$rootDir = "D:\riya\Shriya's Portfolio\Shriya's Remake"
$files = @(
    (Join-Path $rootDir "index.html"),
    (Join-Path $rootDir "about.html"),
    (Join-Path $rootDir "work.html"),
    (Join-Path $rootDir "contact.html"),
    (Join-Path $rootDir "privacy-statement.html")
)

$projDir = Join-Path $rootDir "projecten"
if (Test-Path $projDir) {
    Get-ChildItem -Path $projDir -Filter "*.html" | ForEach-Object {
        $files += $_.FullName
    }
}

foreach ($f in $files) {
    [TextCleaner]::Clean($f)
}
Write-Output "Done cleaning text!"
