import fs from 'fs';
import path from 'path';

function generateHATheme(name, config) {
  let themeStr = `${name}:\n`;
  const C = config.colors;
  
  // Minimal set of portable variables for Home Assistant
  const vars = {
    "primary-color": C.accent,
    "accent-color": C.accent,
    "primary-background-color": C.background,
    "primary-text-color": C.foreground,
    "secondary-text-color": C.blue || C.foreground,
    "divider-color": C.border || C.background,
    "card-background-color": C.background,
    "error-color": C.red,
    "warning-color": C.orange,
    "success-color": C.green,
    "info-color": C.blue,
  };

  for (const [k, v] of Object.entries(vars)) {
    if (v) themeStr += `  ${k}: "${v}"\n`;
  }
  return themeStr;
}

function build(config, options) {
  const displayName = options.displayName || 'Forest';
  const outputDir = options.outputDir || process.cwd();

  const lightStr = generateHATheme(`${displayName} Light`, config.light);
  const darkStr = generateHATheme(`${displayName} Dark`, config.dark);

  const finalYaml = lightStr + "\n" + darkStr;

  const destPath = path.join(outputDir, 'homeassistant.yaml');
  fs.writeFileSync(destPath, finalYaml);
  console.log(`    [HomeAssistant] Generated: ${destPath}`);
}

export { build };
