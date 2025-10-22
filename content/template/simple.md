---
visibility: private
---
# Simple Template Layout


Base Layout

```html
<!DOCTYPE html>
<html lang="{{ language or metadata.language or "en" }}">
    <head>
      {% include "meta.njk" %}
    </head>
	{% standardAssets  %}
	<body class="prose md">
			{{ content | safe  }}
	</body>
</html>
```

```js
// Run the Sass compiler before the main Eleventy build
// Need -> import { execSync } from "child_process";
eleventyConfig.on("beforeBuild", () => {
  console.log("Compiling Sass...");
  try {
    // Run the sass command-line tool.
    // This compiles the files from the source to the destination.
    execSync(
      `sass --load-path=node_modules src/styles/standard.scss dist/standard.css --no-source-map`,
    );
    console.log("Sass compiled successfully.");
  } catch (error) {
    console.error("Error compiling Sass:", error.message);
  }
});
```
