import * as T from 'three';
import {createCanvas,GlobalFonts} from '@napi-rs/canvas';
import fs from 'node:fs';
import {createWorld} from './world.mjs';
GlobalFonts.registerFromPath('C:/Windows/Fonts/msyh.ttc','Yu Gothic');
const {world,scene}=createWorld(createCanvas);world.updateMatrixWorld(true);
const meshes=[],materials={},textures={},geometries={},edges=[];
fs.mkdirSync('model/textures',{recursive:true});
world.traverse(o=>{if(o.isLineSegments&&!o.parent.parent?.name.startsWith('Automatic door')){const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){const v=new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);edges.push(...v.toArray());}}if(!o.isMesh)return;const g=o.geometry,m=o.material;
if(!materials[m.uuid]){let texture=null;if(m.map?.image){texture='textures/'+m.map.uuid+'.png';fs.writeFileSync('model/'+texture,m.map.image.toBuffer('image/png'));}materials[m.uuid]={color:(m.color||new T.Color(0x526b80)).toArray(),emissive:m.emissive?.toArray(),emissiveIntensity:m.emissiveIntensity||0,opacity:m.opacity,transparent:m.transparent,texture,metalness:m.metalness||0,roughness:m.roughness??.7};}
if(!geometries[g.uuid])geometries[g.uuid]={positions:Array.from(g.attributes.position.array),uv:g.attributes.uv?Array.from(g.attributes.uv.array):null,index:g.index?Array.from(g.index.array):null};
meshes.push({name:o.name||'Detail',geometry:g.uuid,material:m.uuid,matrix:o.matrixWorld.toArray(),door:o.parent.name.startsWith('Automatic door')?o.parent.name:null});
});
const lights=[];scene.traverse(o=>{if(o.isPointLight)lights.push({position:o.position.toArray(),color:o.color.toArray(),power:o.intensity});});
fs.writeFileSync('model/scene-data.json',JSON.stringify({meshes,geometries,materials,lights,edges}));
console.log(JSON.stringify({objects:meshes.length,materials:Object.keys(materials).length}));
