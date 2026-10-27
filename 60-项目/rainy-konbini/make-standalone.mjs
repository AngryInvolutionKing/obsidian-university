// Build one self-contained HTML file: dist/index.html + dist/scene.js inlined.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.');
const html = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'dist/scene.js'), 'utf8');

if (/<\/script/i.test(js)) throw new Error('bundle contains </script — needs escaping');

const tag = '<script type="module" src="./scene.js"></script>';
if (!html.includes(tag)) throw new Error('script tag not found in dist/index.html');

// NOTE: pass a function replacer — a string replacement would expand `$&` / `$'`
// sequences that occur inside the minified bundle and corrupt the output.
const out = html.replace(tag, () => '<script type="module">\n' + js + '\n</script>');
const file = path.join(root, 'rainy-konbini-standalone.html');
fs.writeFileSync(file, out, 'utf8');
console.log('wrote', file, fs.statSync(file).size, 'bytes');
