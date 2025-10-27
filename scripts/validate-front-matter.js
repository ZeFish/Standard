
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import matter from 'gray-matter';

const docsDir = path.join(process.cwd(), 'content/docs');
const files = globSync('**/*.md', { cwd: docsDir });

let hasErrors = false;

for (const file of files) {
  const filePath = path.join(docsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  try {
    const { data } = matter(content);

    if (data) {
      for (const key in data) {
        if (typeof key !== 'string') {
          console.error(`Error: Invalid front matter in ${filePath}`);
          console.error(`Invalid key: ${key}`);
          hasErrors = true;
        }
      }
    }
  } catch (e) {
    if (e.name === 'YAMLException') {
      console.error(`Error parsing YAML front matter in ${filePath}:`);
      console.error(e.message);
      hasErrors = true;
    } else {
      throw e;
    }
  }
}

if (hasErrors) {
  process.exit(1);
}
