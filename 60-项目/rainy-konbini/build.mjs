import {build} from 'esbuild';
await build({entryPoints:['main.mjs'],bundle:true,format:'esm',outfile:'dist/scene.js',minify:true,target:'es2022'});
console.log('Built scene.js');
