// Reads macOS's own dynamic colours, in the light (Aqua) and dark (DarkAqua)
// appearances, and prints them as JSON: the ground truth for the macOS theme.
//
//   swiftc _scripts/dump-system-colors.swift -o /tmp/dump-system-colors \
//     && /tmp/dump-system-colors > system-colors.json
//
// Apple warns that these values "may fluctuate from release to release", so the
// output records the macOS version it was read on.
import AppKit
import Foundation

let colors: [(String, NSColor)] = [
  ("labelColor", .labelColor), ("secondaryLabelColor", .secondaryLabelColor),
  ("tertiaryLabelColor", .tertiaryLabelColor), ("quaternaryLabelColor", .quaternaryLabelColor),
  ("placeholderTextColor", .placeholderTextColor), ("disabledControlTextColor", .disabledControlTextColor),
  ("separatorColor", .separatorColor), ("gridColor", .gridColor),
  ("systemFill", .systemFill), ("secondarySystemFill", .secondarySystemFill),
  ("tertiarySystemFill", .tertiarySystemFill), ("quaternarySystemFill", .quaternarySystemFill),
  ("quinarySystemFill", .quinarySystemFill),
  ("windowBackgroundColor", .windowBackgroundColor), ("controlBackgroundColor", .controlBackgroundColor),
  ("underPageBackgroundColor", .underPageBackgroundColor), ("textBackgroundColor", .textBackgroundColor),
  ("controlColor", .controlColor),
  ("selectedContentBackgroundColor", .selectedContentBackgroundColor),
  ("unemphasizedSelectedContentBackgroundColor", .unemphasizedSelectedContentBackgroundColor),
  ("selectedControlColor", .selectedControlColor),
  ("keyboardFocusIndicatorColor", .keyboardFocusIndicatorColor),
  ("controlAccentColor", .controlAccentColor), ("linkColor", .linkColor),
  ("shadowColor", .shadowColor), ("highlightColor", .highlightColor),
  ("findHighlightColor", .findHighlightColor), ("headerTextColor", .headerTextColor),
]

func reading(_ color: NSColor, _ name: NSAppearance.Name) -> [String: Double] {
  var out: [String: Double] = [:]
  NSAppearance(named: name)!.performAsCurrentDrawingAppearance {
    if let c = color.usingColorSpace(.sRGB) {
      out = [
        "r": (c.redComponent * 255).rounded(), "g": (c.greenComponent * 255).rounded(),
        "b": (c.blueComponent * 255).rounded(), "a": (c.alphaComponent * 1000).rounded() / 1000,
      ]
    }
  }
  return out
}

let v = ProcessInfo.processInfo.operatingSystemVersion
var result: [String: Any] = ["macOS": "\(v.majorVersion).\(v.minorVersion).\(v.patchVersion)", "space": "sRGB, 0-255, alpha 0-1"]
var table: [String: Any] = [:]
for (name, color) in colors {
  table[name] = ["light": reading(color, .aqua), "dark": reading(color, .darkAqua)]
}
result["colors"] = table
let data = try JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted, .sortedKeys])
print(String(data: data, encoding: .utf8)!)
