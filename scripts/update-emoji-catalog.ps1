param(
    [string]$UnicodeVersion = '17.0'
)

$ErrorActionPreference = 'Stop'

$sourceUrl = "https://www.unicode.org/Public/$UnicodeVersion.0/emoji/emoji-test.txt"
$projectRoot = Split-Path -Parent $PSScriptRoot
$outputPath = Join-Path $projectRoot 'src\pages\components\emoji-catalog.ts'
$response = Invoke-WebRequest -Uri $sourceUrl -UseBasicParsing

$group = ''
$subgroup = ''
$entries = [System.Collections.Generic.List[object]]::new()

foreach ($rawLine in ($response.Content -split "`n")) {
    $line = $rawLine.Trim()

    if ($line -match '^# group: (.+)$') {
        $group = $Matches[1]
        continue
    }

    if ($line -match '^# subgroup: (.+)$') {
        $subgroup = $Matches[1]
        continue
    }

    if ($line -match '^([0-9A-F ]+)\s*;\s*(?:fully-qualified|component)\s*#\s*(\S+)\s+E([0-9.]+)\s+(.+)$') {
        $entries.Add([PSCustomObject]@{
            emoji = $Matches[2]
            name = $Matches[4]
            group = $group
            subgroup = $subgroup
            version = $Matches[3]
        })
    }
}

$lines = [System.Collections.Generic.List[string]]::new()
$lines.Add('// Generated from the official Unicode emoji-test.txt data file.')
$lines.Add("// Unicode Emoji version: $UnicodeVersion")
$lines.Add("// Source: $sourceUrl")
$lines.Add('// License: https://www.unicode.org/license.txt')
$lines.Add('')
$lines.Add('export interface EmojiCatalogEntry {')
$lines.Add('  emoji: string')
$lines.Add('  name: string')
$lines.Add('  group: string')
$lines.Add('  subgroup: string')
$lines.Add('  version: string')
$lines.Add('}')
$lines.Add('')
$lines.Add("export const emojiCatalogVersion = '$UnicodeVersion'")
$lines.Add('')
$lines.Add('export const emojiCatalog: EmojiCatalogEntry[] = [')

foreach ($entry in $entries) {
    $emoji = ConvertTo-Json $entry.emoji -Compress
    $name = ConvertTo-Json $entry.name -Compress
    $entryGroup = ConvertTo-Json $entry.group -Compress
    $entrySubgroup = ConvertTo-Json $entry.subgroup -Compress
    $version = ConvertTo-Json $entry.version -Compress
    $lines.Add("  { emoji: $emoji, name: $name, group: $entryGroup, subgroup: $entrySubgroup, version: $version },")
}

$lines.Add(']')
$lines.Add('')

Set-Content -LiteralPath $outputPath -Value $lines -Encoding utf8
Write-Output "Generated $($entries.Count) emoji entries at $outputPath"
