import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { createWorld } from './world.mjs';

const canvas=document.querySelector('#world');
let renderer;
try{renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});}catch(e){document.querySelector('#fallback').style.display='block';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.00;
const {scene,world,doors,sign,signals,frontLight,rand}=createWorld((w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;});
scene.fog=new T.FogExp2(0x24334e,.018);
const camera=new T.PerspectiveCamera(33,innerWidth/innerHeight,.1,100);
scene.fog=new T.Fog(0x121d2e,20,58);camera.position.set(13.2,11.0,16.7);const controls=new OrbitControls(camera,canvas);camera.layers.enable(1);controls.target.set(0,1.2,0);controls.enableDamping=true;controls.dampingFactor=.065;controls.minDistance=7;controls.maxDistance=35;controls.minPolarAngle=.20;controls.maxPolarAngle=Math.PI*.485;controls.panSpeed=.55;controls.rotateSpeed=.65;controls.zoomSpeed=.8;controls.update();
// Batch static architecture and stock into material groups for smooth interaction.
const hullGroup=new T.Group();const outlineMat=new T.ShaderMaterial({uniforms:{uThick:{value:.014},uColor:{value:new T.Color(0x060c14)}},vertexShader:'uniform float uThick;void main(){vec3 n=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.0);mv.xyz+=n*uThick;gl_Position=projectionMatrix*mv;}',fragmentShader:'uniform vec3 uColor;void main(){gl_FragColor=vec4(uColor,1.0);}',side:T.BackSide});
world.updateMatrixWorld(true);
const batches=new Map(),lineParts=[];const remove=[];
world.traverse(o=>{if(!o.isMesh)return;let p=o;while(p){if(doors.some(d=>d.object===p))return;p=p.parent;}const g=o.geometry.clone();g.applyMatrix4(o.matrixWorld);if(g.index) {const u=g.toNonIndexed();g.dispose();batches.has(o.material)||batches.set(o.material,[]);batches.get(o.material).push(u);}else{batches.has(o.material)||batches.set(o.material,[]);batches.get(o.material).push(g);}for(const child of o.children){if(child.isLineSegments){const q=child.geometry.clone();q.applyMatrix4(child.matrixWorld);lineParts.push(q);}}remove.push(o);});
for(const o of remove)o.removeFromParent();
for(const [material,parts] of batches){for(const g of parts){for(const a of Object.keys(g.attributes))if(!['position','normal','uv'].includes(a))g.deleteAttribute(a);}const geometry=mergeGeometries(parts);if(geometry){const o=new T.Mesh(geometry,material);o.castShadow=true;o.receiveShadow=true;world.add(o);if(!material.transparent&&material.isMeshToonMaterial){const hull=new T.Mesh(geometry,outlineMat);hull.renderOrder=-2;hullGroup.add(hull);}}parts.forEach(g=>g.dispose());}
if(lineParts.length){const l=new T.LineSegments(mergeGeometries(lineParts),new T.LineBasicMaterial({color:0x090f19,transparent:true,opacity:.82}));world.add(l);}
// Reflections use a second camera and moving water distortion, confined to the base.
const reflectShader={...Reflector.ReflectorShader,uniforms:T.UniformsUtils.clone(Reflector.ReflectorShader.uniforms)};
reflectShader.uniforms.uTime={value:0};
reflectShader.fragmentShader=reflectShader.fragmentShader.replace('uniform vec3 color;','uniform vec3 color; uniform float uTime;').replace('vec4 base = texture2DProj( tDiffuse, vUv );','vec4 uv = vUv; uv.x += sin(uv.y*170.0+uTime*1.6)*0.0012*uv.w; uv.y += sin(uv.x*210.0-uTime)*0.0007*uv.w; vec4 base = texture2DProj( tDiffuse, uv );').replace('vec4( blendOverlay( base.rgb, color ), 1.0 )','vec4( mix(vec3(0.025,0.045,0.075), base.rgb, 0.32), 1.0 )');
const water=new Reflector(new T.PlaneGeometry(11.18,11.18),{color:0x6a8597,textureWidth:768,textureHeight:768,clipBias:.003,multisample:0,shader:reflectShader});water.rotation.x=-Math.PI/2;water.position.y=.022;scene.add(water);world.add(hullGroup);const origRender=renderer.render.bind(renderer);renderer.render=(s,c)=>{const skip=c!==camera;if(skip)hullGroup.visible=false;origRender(s,c);if(skip)hullGroup.visible=true;};
// Rain remains entirely over the square miniature and respects the roof.
const rainCount=1700,positions=new Float32Array(rainCount*6),drops=[];
for(let i=0;i<rainCount;i++)drops.push({x:(rand()-.5)*11.1,z:(rand()-.5)*11.1,y:rand()*7.3,speed:5.5+rand()*2.5,length:.12+rand()*.20});
const rainGeo=new T.BufferGeometry();rainGeo.setAttribute('position',new T.BufferAttribute(positions,3).setUsage(T.DynamicDrawUsage));
const rain=new T.LineSegments(rainGeo,new T.LineBasicMaterial({color:0xc9dcee,transparent:true,opacity:.30,depthWrite:false}));rain.frustumCulled=false;scene.add(rain);
const ripples=[];
for(let i=0;i<58;i++){let x,z;do{x=(rand()-.5)*10.9;z=(rand()-.5)*10.9;}while(x>-3.5&&x<3.3&&z<1.8);const m=new T.MeshBasicMaterial({color:0x9cbbc9,transparent:true,opacity:.2,depthWrite:false,side:T.DoubleSide});const ring=new T.Mesh(new T.RingGeometry(.94,1,32),m);ring.rotation.x=-Math.PI/2;ring.position.set(x,x>-3.4&&z<2.65?.301:.058,z);scene.add(ring);ripples.push({ring,phase:rand(),rate:.45+rand()*.5});}
// Drips along the canopy and sliding raindrops on front glazing.
const dripGeo=new T.BufferGeometry(),dp=new Float32Array(34*6);dripGeo.setAttribute('position',new T.BufferAttribute(dp,3));const drips=new T.LineSegments(dripGeo,new T.LineBasicMaterial({color:0xc2d4d5,transparent:true,opacity:.45,depthWrite:false}));scene.add(drips);
const glassGeo=new T.BufferGeometry(),gp=new Float32Array(38*6);glassGeo.setAttribute('position',new T.BufferAttribute(gp,3));const streaks=new T.LineSegments(glassGeo,new T.LineBasicMaterial({color:0xe0e8dc,transparent:true,opacity:.23,depthWrite:false}));scene.add(streaks);
const grade=new ShaderPass({uniforms:{tDiffuse:{value:null},uVig:{value:1.00},uSat:{value:1.15},uCon:{value:1.10}},
 vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uVig,uSat,uCon;varying vec2 vUv;
 void main(){vec4 c=texture2D(tDiffuse,vUv);vec3 col=c.rgb;
 float l=dot(col,vec3(.2126,.7152,.0722));
 col=mix(vec3(l),col,uSat);
 col=(col-.5)*uCon+.5;
 float lum=clamp(dot(col,vec3(.2126,.7152,.0722)),0.,1.);
 col*=mix(vec3(1.07,1.00,.92),vec3(.79,.92,1.13),smoothstep(.62,.05,lum));
 vec2 q=vUv-.5;col*=1.-dot(q,q)*uVig;
 gl_FragColor=vec4(clamp(col,0.,1.),c.a);}`});
const composer=new EffectComposer(renderer,new T.WebGLRenderTarget(innerWidth,innerHeight,{type:T.HalfFloatType,samples:4}));composer.addPass(new RenderPass(scene,camera));const bloom=new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),.26,.40,1.25);composer.addPass(bloom);composer.addPass(new OutputPass());composer.addPass(grade);
let last=performance.now(),elapsed=0;
function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;elapsed+=dt;const t=elapsed;controls.update();
 water.material.uniforms.uTime.value=t;
 for(let i=0;i<rainCount;i++){const d=drops[i];d.y-=d.speed*dt;d.x-=dt*.16;const roof=d.x>-3.50&&d.x<3.24&&d.z>-3.45&&d.z<1.75;const floor=roof?3.45:(d.x>-3.4&&d.z<2.65?.30:.05);if(d.y<floor){d.y=6.6+rand()*.8;d.x=(rand()-.5)*11.0;}const k=i*6;positions[k]=d.x;positions[k+1]=d.y;positions[k+2]=d.z;positions[k+3]=d.x+.012;positions[k+4]=d.y+d.length;positions[k+5]=d.z;}
 rainGeo.attributes.position.needsUpdate=true;
 for(const r of ripples){const a=(t*r.rate+r.phase)%1;r.ring.scale.setScalar(.02+a*.24);r.ring.material.opacity=(1-a)*.25;}
 for(let i=0;i<34;i++){let y=2.51-((t*(1.3+(i%4)*.21)+i*.19)%2.15);let k=i*6,x=-3.27+i*.193;dp[k]=x;dp[k+1]=y;dp[k+2]=1.72;dp[k+3]=x;dp[k+4]=y+.06;dp[k+5]=1.72;}dripGeo.attributes.position.needsUpdate=true;
 for(let i=0;i<38;i++){let k=i*6,x=-3.03+(i/38)*5.79,y=2.47-((t*.13+i*.147)%1.47);if(x>.05&&x<1.40){y=-3;}gp[k]=x;gp[k+1]=y;gp[k+2]=1.126;gp[k+3]=x+.008;gp[k+4]=y+.04+(i%4)*.012;gp[k+5]=1.126;}glassGeo.attributes.position.needsUpdate=true;
 const cycle=t%19;const open=cycle>9&&cycle<14?Math.min(1,(cycle-9)*1.8,(14-cycle)*1.8):0;const eased=open*open*(3-2*open);doors.forEach(d=>d.object.position.x=d.base+d.sign*.49*eased);
 const flutter=1-.025*Math.sin(t*3.5)-((t%27)>25.7&&Math.sin(t*53)>.8?.10:0);sign.material.emissiveIntensity=.92*flutter;frontLight.intensity=7*flutter;
 const traffic=Math.floor((t%33)/11);signals.forEach((m,i)=>m.emissiveIntensity=i===traffic?1.7:.03);
 composer.render();requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);if(innerWidth<650&&camera.position.length()<28)camera.position.multiplyScalar(1.25);}
addEventListener('resize',resize);resize();
canvas.addEventListener('keydown',e=>{if(e.key==='Home'){camera.position.set(13.2,11.0,16.7);controls.target.set(0,1.2,0);e.preventDefault();}if(e.key==='+'||e.key==='=')camera.position.lerp(controls.target,.1);if(e.key==='-')camera.position.sub(controls.target).multiplyScalar(1.1).add(controls.target);});
document.addEventListener('visibilitychange',()=>{last=performance.now();});
