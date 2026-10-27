import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function createWorld(canvasFactory) {
 const scene = new T.Scene();
 const world = new T.Group(); world.name='AMAYADORI — rain at the corner'; scene.add(world);
 let seed=71028; const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
 const gradient=new T.DataTexture(new Uint8Array([82,145,208,255]),4,1,T.RedFormat); gradient.needsUpdate=true;
 const mats=new Map();
 function mat(c){if(!mats.has(c))mats.set(c,new T.MeshToonMaterial({color:c,gradientMap:gradient}));return mats.get(c);}
 const ink=new T.LineBasicMaterial({color:0x0a1420,transparent:true,opacity:.84});
 const colors={cream:0xd2c9b2,frame:0x354b56,teal:0x287c79,road:0x273445,metal:0x647889,roof:0x355364,white:0xdfded0,pink:0xe596ac};
 const warm=new T.MeshStandardMaterial({color:0xfff2cb,emissive:0xffc37a,emissiveIntensity:1.30,roughness:.4});
 const cool=new T.MeshStandardMaterial({color:0xbcf6ef,emissive:0x74e1e2,emissiveIntensity:1.5});
 const glass=new T.MeshPhysicalMaterial({color:0x89c3c9,roughness:.14,metalness:.18,transparent:true,opacity:.095,depthWrite:false,side:T.DoubleSide});
 function mesh(g,m,x,y,z,name='',outline=false,parent=world){const o=new T.Mesh(g,typeof m==='number'?mat(m):m);o.position.set(x,y,z);o.name=name;o.castShadow=true;o.receiveShadow=true;parent.add(o);if(outline){const l=new T.LineSegments(new T.EdgesGeometry(g,35),ink);o.add(l);}return o;}
 function box(w,h,d,x,y,z,m,name='',out=true,parent=world){return mesh(new T.BoxGeometry(w,h,d),m,x,y,z,name,out,parent);}
 function rounded(w,h,d,x,y,z,m,name=''){return mesh(new RoundedBoxGeometry(w,h,d,2,.045),m,x,y,z,name,false);}
 function cylinder(r,h,x,y,z,m,name='',r2=r){return mesh(new T.CylinderGeometry(r,r2,h,12),m,x,y,z,name);}
 function rod(a,b,r,m,name=''){const A=new T.Vector3(...a),B=new T.Vector3(...b),o=cylinder(r,A.distanceTo(B),...(A.clone().add(B).multiplyScalar(.5).toArray()),m,name);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),B.sub(A).normalize());return o;}
 function curve(points,r,m,name=''){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),32,r,6,false),m,0,0,0,name);}
 function label(text,w,h,x,y,z,opt={}){const c=canvasFactory(1024,Math.max(128,Math.round(1024*h/w)));const q=c.getContext('2d');q.fillStyle=opt.bg||'#fff1d2';q.fillRect(0,0,c.width,c.height);if(opt.stripe){q.fillStyle=opt.stripe;q.fillRect(0,c.height*.86,c.width,c.height*.14);}q.fillStyle=opt.fg||'#2d6664';q.textAlign='center';q.textBaseline='middle';q.font=`${opt.weight||600} ${Math.floor(c.height*(opt.size||.60))}px "Yu Gothic", "Noto Sans CJK JP", sans-serif`;q.fillText(text,c.width/2,c.height*(opt.stripe?.43:.51),c.width*.94);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const m=new T.MeshStandardMaterial({map:tex,roughness:.65,emissive:opt.glow?0xffffff:0x000000,emissiveMap:opt.glow?tex:null,emissiveIntensity:opt.glow||0,side:T.DoubleSide});const o=mesh(new T.PlaneGeometry(w,h),m,x,y,z,text);if(opt.side)o.rotation.y=Math.PI/2;return o;}
 function lamp(x,y,z,color,power,range){const l=new T.PointLight(color,power,range,2);l.position.set(x,y,z);scene.add(l);return l;}

 // A complete collectible square plinth and the two arms of the street.
 rounded(11.4,.54,11.4,0,-.31,0,0x172638,'Square solid display base');
 box(11.2,.06,11.2,0,-.015,0,0x2c4050,'Wet asphalt');
 box(8.55,.23,8.1,.88,.12,-1.35,0x56616b,'Raised pavement');
 box(8.6,.06,8.15,.88,.255,-1.35,0x77838b,'Paving slabs');
 for(let x=-3.4;x<5.15;x+=.55)box(.015,.006,8.1,x,.29,-1.35,0x505e69,'Pavement joint',false);
 for(let z=-5.25;z<2.65;z+=.55)box(8.5,.006,.014,.88,.292,z,0x505e69,'Pavement joint',false);
 for(let x=-3.45;x<5.1;x+=.43)box(.4,.22,.18,x,.12,2.71,0x8d9aa2,'Kerbstone');
 for(let z=-5.3;z<2.65;z+=.43)box(.18,.22,.4,-3.45,.12,z,0x8d9aa2,'Kerbstone');
 for(let i=0;i<7;i++)box(.43,.012,1.8,-1.8+i*.82,.035,4.15,0x9dabb1,'Zebra crossing',false);
 for(let z=-4.5;z<2.4;z+=1.8)box(.065,.015,.8,-4.6,.038,z,0xacae9b,'Street marking',false);
 box(5.5,.012,.055,.8,.04,5.22,0xb1baa9,'Edge line',false);
 for(let x=3.45;x<5;x+=1.35){box(.055,.01,1.6,x,.30,1.5,0xc6c4b3,'Parking bay line',false);box(1.2,.01,.055,x+.6,.3,2.27,0xc6c4b3,'Parking bay line',false);}
 const parking=label('P',.48,.48,4.1,.305,1.3,{bg:'#76818b',fg:'#cbd3d0'});parking.rotation.x=-Math.PI/2;
 for(let x of [-2.7,.3,3.3]){box(.66,.025,.19,x,.04,2.94,0x162531,'Storm drain');for(let i=0;i<8;i++)box(.025,.025,.15,x-.28+i*.08,.056,2.94,0x607480,'Drain grate',false);}
 const manhole=cylinder(.42,.016,-4.55,.04,2.6,0x526472,'Manhole');for(let i=-3;i<=3;i++)box(.49,.012,.018,-4.55,.056,2.6+i*.08,0x293b4b,'Manhole grooves',false);

 // Store shell: two glazed faces keep the entire shop legible.
 box(6.15,.18,4.35,-.15,.38,-1.03,0xb2aea1,'Store foundation');
 box(5.9,.04,4.1,-.15,.49,-1.03,0xd4c7a9,'Warm tiled interior');
 for(let x=-3;x<=2.8;x+=.45)box(.013,.004,4.05,x,.513,-1.03,0xaaa48f,'Interior tile seam',false);
 for(let z=-3;z<1;z+=.45)box(5.85,.004,.013,-.15,.514,z,0xaaa48f,'Interior tile seam',false);
 box(6.1,2.58,.15,-.15,1.78,-3.12,colors.cream,'Back wall');
 box(.15,2.58,4.2,-3.12,1.78,-1.02,colors.cream,'Left wall');
 box(.13,.45,4.2,2.82,.72,-1.02,colors.teal,'East sill');
 box(6,.38,.12,-.15,.68,1.1,colors.teal,'Front sill');
 for(let x of [-3.1,-1.48,.05,1.38,2.82])box(.075,2.56,.10,x,1.78,1.1,colors.frame,'Front window mullion');
 for(let z of [-3.05,-1.68,-.3,1.07])box(.095,2.56,.075,2.82,1.78,z,colors.frame,'Side window mullion');
 for(let y of [.9,2.91]){box(5.95,.065,.12,-.15,y,1.1,colors.frame,'Front frame');box(.1,.065,4.15,2.82,y,-1.01,colors.frame,'Side frame');}
 for(let pair of [[-2.3,1.5],[-.71,1.45],[2.10,1.36]])mesh(new T.PlaneGeometry(pair[1],1.98),glass,pair[0],1.91,1.112,'Clear storefront glazing');
 for(let z of [-2.36,-.99,.39]){const g=mesh(new T.PlaneGeometry(1.31,1.98),glass,2.837,1.91,z,'Clear side glazing');g.rotation.y=Math.PI/2;}
 const doors=[];
 for(let s of [-1,1]){const group=new T.Group();group.position.set(.72+s*.305,0,1.14);group.name=s<0?'Automatic door left':'Automatic door right';world.add(group);box(.61,2.26,.045,0,1.65,0,glass,'Door glass',false,group);for(let x of [-.30,.30])box(.03,2.26,.06,x,1.65,0,colors.frame,'Door stile',true,group);for(let y of [.54,1.48,2.77])box(.60,.035,.065,0,y,0,colors.frame,'Door rail',true,group);doors.push({object:group,base:group.position.x,sign:s});}
 box(1.36,.13,.23,.72,2.88,1.16,0x293e46,'Automatic door motor');
 box(.13,.04,.04,.72,2.81,1.31,0x122e31,'Door sensor');
 box(1.43,.025,.62,.72,.305,1.53,0x334c52,'Welcome mat');
 for(let x=.15;x<1.34;x+=.07)box(.018,.009,.53,x,.323,1.53,0x536b6b,'Mat ribs',false);
 label('自動ドア',.48,.12,.72,1.44,1.18,{bg:'#d2dfce',fg:'#2e5a55',size:.6});
 box(6.52,.22,4.65,-.15,3.15,-1,colors.roof,'Overhanging flat roof');
 box(6.68,.09,4.81,-.15,3.30,-1,0x537481,'Roof cap');
 for(let x of [-3.4,3.1])box(.09,.17,4.76,x,3.42,-1,0x587f8b,'Raised roof rim');
 for(let z of [-3.35,1.35])box(6.6,.17,.09,-.15,3.42,z,0x587f8b,'Raised roof rim');
 for(let z=-3.1;z<1.25;z+=.38)box(6.4,.008,.014,-.15,3.35,z,0x314f5c,'Roof standing seam',false);
 box(6.7,.64,.24,-.15,2.90,1.28,colors.frame,'Front fascia');
 const sign=label('雨宿り  AMAYADORI',6.45,.49,-.15,2.94,1.412,{bg:'#f0ead7',fg:'#246e69',stripe:'#df9776',glow:.95,size:.57});
 box(.24,.64,4.43,3.08,2.90,-1,colors.frame,'East fascia');
 label('雨宿り  •  24 OPEN',4.21,.49,3.21,2.94,-1,{bg:'#f0ead7',fg:'#246e69',stripe:'#df9776',glow:.95,size:.56,side:true});
 box(6.52,.095,.48,-.15,2.55,1.48,colors.teal,'Rain canopy');
 box(5.8,.035,.12,-.15,2.49,1.5,warm,'Warm under-canopy strip',false);
 cylinder(.047,2.40,-3.24,1.53,1.40,0x557783,'Rain downpipe');
 curve([[-3.24,.34,1.4],[-3.24,.19,1.49],[-3.24,.10,1.67]],.05,0x557783,'Drainpipe elbow');

 // Stocked, detailed shop interior; all packages are geometry, not an empty window decal.
 const goods=[0xc36b58,0xdbb758,0x73a58e,0xc895aa,0x658ba6,0xd9c6a2,0x9c7c9f];
 function product(x,y,z,i,kind=0){const color=goods[i%goods.length];if(kind===1){cylinder(.046,.19,x,y,z,color,'Drink bottle');cylinder(.026,.035,x,y+.112,z,0xe5e1ce,'Bottle cap');box(.077,.06,.072,x,y-.01,z,0xeee3c6,'Bottle label',false);}else{box(.115,.19,.09,x,y,z,color,'Snack package',false);box(.079,.048,.003,x,y+.018,z+.047,0xf0dfb2,'Package label',false);}}
 function shelf(x,z,width=1.6){box(width,.16,.47,x,.61,z,0xc7b998,'Shelf plinth');box(width,1.21,.055,x,1.24,z-.20,0xb2ad9b,'Shelf backing');for(let y of [.70,1.10,1.50]){box(width,.055,.5,x,y,z,0xe5d8b6,'Shelf deck');box(width,.075,.035,x,y-.01,z+.26,0xe7bc79,'Price strip',false);for(let k=0;k<Math.floor(width/.16);k++)for(let row=0;row<2;row++)product(x-width/2+.12+k*.16,y+.13,z+.12-row*.18,k+row+Math.round(x*10+30));}}
 shelf(-1.8,-1.06,1.9);shelf(-1.8,-2.20,1.9);shelf(.26,-1.68,1.55);
 // Refrigerated drink wall with shelves, bottles, doors, handles, top lightboxes.
 for(let x of [-2.37,-1.49,-.61]){box(.83,2.1,.43,x,1.58,-2.82,0x647c7a,'Drink refrigerator cabinet');box(.73,1.72,.05,x,1.60,-2.565,0xbeddd2,'Fridge luminous back');for(let y of [.85,1.25,1.65,2.05]){box(.72,.035,.3,x,y,-2.52,0xbccdc0,'Fridge shelf');for(let k=0;k<5;k++)product(x-.29+k*.143,y+.13,-2.43,k+Math.round(y*7),1);}box(.77,1.81,.018,x,1.59,-2.29,glass,'Refrigerator glass',false);rod([x+.29,.87,-2.265],[x+.29,1.9,-2.265],.018,0x324d50,'Fridge handle');label('DRINKS',.74,.19,x,2.61,-2.58,{bg:'#d5f0de',fg:'#3a7976',glow:.5});}
 // Fresh food with triangular onigiri and bento trays.
 box(1.2,.87,.65,1.50,.94,-2.70,0xd3cbbb,'Bento refrigerated case');
 for(let y of [.92,1.30]){box(1.14,.045,.62,1.5,y,-2.67,0xa8b6ad,'Food shelf');for(let k=0;k<4;k++){box(.235,.055,.24,1.1+k*.27,y+.055,-2.55,0x273b41,'Bento tray');box(.12,.025,.16,1.05+k*.27,y+.098,-2.55,0xf0e4c1,'Bento rice',false);box(.07,.035,.15,1.15+k*.27,y+.10,-2.55,0xd48253,'Bento topping',false);}}
 label('お弁当・おにぎり',1.28,.23,1.5,1.70,-2.35,{bg:'#efc984',fg:'#735649',size:.5});
 for(let k=0;k<5;k++){const o=mesh(new T.CylinderGeometry(.11,.11,.065,3),0xe8e0c9,1.04+k*.23,1.46,-2.40,'Onigiri rice triangle');o.rotation.x=Math.PI/2;box(.07,.085,.075,1.04+k*.23,1.42,-2.4,0x25473d,'Nori wrapper',false);}
 // Checkout, coffee and oden, visible from the side window.
 box(.76,.88,1.66,2.13,.98,-.40,0xc4b690,'Checkout counter');box(.86,.09,1.77,2.13,1.46,-.40,0x36585a,'Checkout worktop');
 box(.31,.11,.30,1.95,1.57,.16,0x343e44,'Register base');const screen=box(.34,.26,.045,1.95,1.76,.11,0x344a51,'POS terminal');screen.rotation.x=-.20;
 label('¥  680',.28,.15,1.95,1.76,.14,{bg:'#9ccebb',fg:'#275554',size:.55});
 box(.31,.45,.35,2.12,1.72,-.90,0x263f47,'Coffee machine');box(.25,.20,.02,2.12,1.77,-.715,0xa5b3b2,'Coffee face');cylinder(.055,.10,2.12,1.55,-.68,0xefdbc4,'Coffee cup');
 label('挽きたて COFFEE',.57,.21,2.21,2.23,-.78,{bg:'#dfb978',fg:'#72513a',size:.5,side:true});
 box(.54,.11,.43,2.11,1.58,-.30,0x6a7776,'Oden hot tray');for(let i=0;i<3;i++)for(let j=0;j<2;j++)cylinder(.063,.045,1.94+i*.16,1.66,-.42+j*.20,0xd5a46a,'Oden food');box(.58,.28,.015,2.11,1.77,-.055,glass,'Oden display glass',false);
 // Chest freezer, magazines, rear service door and ceiling fixtures.
 box(.85,.64,.59,.12,.85,-.15,0xe2dbc6,'Ice cream chest');box(.79,.035,.53,.12,1.19,-.15,glass,'Freezer glass lid');
 label('ICE CREAM',.65,.16,.12,.99,.153,{bg:'#d6b7b1',fg:'#665b6c',size:.5});
 box(.90,.72,.30,-2.34,.90,.67,0x8d8071,'Magazine rack');for(let j=0;j<2;j++)for(let i=0;i<5;i++){const book=box(.15,.23,.025,-2.68+i*.17,.78+j*.29,.855,goods[(i+j)%7],'Magazine cover',false);book.rotation.x=-.12;box(.11,.033,.008,-2.68+i*.17,.84+j*.29,.877,0xe6dfc8,'Magazine title',false);}
 box(.64,1.88,.025,2.31,1.46,-3.026,0x8e9c95,'Staff room door');label('STAFF ONLY',.45,.11,2.31,1.87,-3.003,{bg:'#8e9c95',fg:'#e0e3ce',size:.5});cylinder(.028,.08,2.53,1.35,-2.99,0x30474b,'Door knob');
 for(let x of [-1.85,.15,1.9])for(let z of [-2.0,.15]){box(.9,.045,.18,x,2.63,z,warm,'Interior ceiling fluorescent',false);}
 label('新発売',.55,.68,-2.55,1.80,1.13,{bg:'#e5b07b',fg:'#a74e50',size:.37});label('おいしい毎日',.59,.27,-2.55,1.48,1.135,{bg:'#f0ddae',fg:'#81654c',size:.38});
 label('24',.29,.30,2.85,2.1,.50,{bg:'#e5cc85',fg:'#45766b',side:true});
 const aisle=label('レジ →',.62,.30,1.00,.52,-.30,{bg:'#c6b992',fg:'#4b776d',size:.6});aisle.rotation.x=-Math.PI/2;

 // Rooftop plant, condensers, vents and maintenance conduit.
 for(let x of [-2,-.85]){box(.90,.54,.75,x,3.63,-1.89,0x91a3a2,'Roof air conditioning unit');box(.81,.44,.035,x,3.64,-1.495,0x354f5b,'Condenser grille');for(let i=0;i<9;i++)box(.76,.018,.024,x,3.46+i*.045,-1.468,0x91a9aa,'Condenser fins',false);const f=cylinder(.24,.025,x,3.92,-1.89,0x263e4a,'Top fan');for(let i=0;i<8;i++){const a=i*Math.PI/4;rod([x+.05*Math.cos(a),3.94,-1.89+.05*Math.sin(a)],[x+.21*Math.cos(a+.3),3.94,-1.89+.21*Math.sin(a+.3)],.012,0x799496,'Fan blade');}}
 curve([[-2,3.39,-2.2],[-2,3.40,-2.8],[.1,3.40,-2.8],[.1,3.40,-3.25]],.03,0x839d9e,'AC pipe');
 cylinder(.13,.44,1.8,3.6,-2.55,0x9aada9,'Roof vent');cylinder(.22,.08,1.8,3.86,-2.55,0x58727e,'Vent rain cap');

 // Vending machine, bins, umbrella stand and a parked city bicycle.
 rounded(.86,1.87,.71,-2.59,1.23,1.94,0x568e96,'Blue vending machine');
 box(.73,1.01,.026,-2.59,1.44,2.31,0xd4e5d8,'Vending display');
 for(let r=0;r<3;r++)for(let k=0;k<5;k++){product(-2.87+k*.14,1.15+r*.29,2.35,k+r,1);cylinder(.027,.02,-2.87+k*.14,1.015+r*.29,2.39,warm,'Selection button').rotation.x=Math.PI/2;}
 label('つめた〜い',.69,.18,-2.59,2.09,2.31,{bg:'#d7eee5',fg:'#426d77',size:.5,glow:.5});
 box(.45,.14,.04,-2.67,.58,2.32,0x213c4a,'Vending dispensing slot');box(.10,.20,.04,-2.28,.86,2.33,0x2e4951,'Coin slot');
 for(let i=0;i<2;i++){rounded(.43,.76,.44,-1.81+i*.51,.68,1.74,0xabb5ad,'Recycling bin');box(.30,.12,.025,-1.81+i*.51,.94,1.975,0x2f4d56,'Bin opening');label(i?'缶':'PET',.24,.17,-1.81+i*.51,.70,1.98,{bg:'#abb5ad',fg:'#47646c',size:.65});}
 box(.42,.40,.35,1.70,.53,1.46,0x697981,'Umbrella stand');for(let i=0;i<4;i++){const x=1.57+i*.085;rod([x,.55,1.46],[x+.04,1.30,1.46],.014,0xc2bcac,'Umbrella shaft');curve([[x+.04,1.29,1.46],[x+.06,1.37,1.46],[x+.13,1.37,1.46],[x+.14,1.29,1.46]],.017,0x415f6b,'Umbrella handle');const u=mesh(new T.ConeGeometry(.055,.50,8),i%2?0xb18c9d:0x8ca6ae,x+.01,.83,1.46,'Folded umbrella');u.rotation.z=-.05;}
 function bicycle(x,z){for(let dx of [-.51,.51]){const tire=mesh(new T.TorusGeometry(.33,.035,8,28),0x1b2f3b,x+dx,.66,z,'Bicycle tyre');const rim=mesh(new T.TorusGeometry(.292,.014,6,28),0xb3bdac,x+dx,.66,z,'Bicycle rim');for(let i=0;i<10;i++){const a=i*Math.PI/5;rod([x+dx,.66,z],[x+dx+.29*Math.cos(a),.66+.29*Math.sin(a),z],.006,0x9aa7a7,'Wheel spoke');}}
 const p=[[x-.51,.66,z],[x-.10,1.18,z],[x+.10,.66,z],[x+.37,1.2,z],[x+.51,.66,z]];for(let [a,b] of [[0,1],[1,2],[2,0],[1,3],[3,2],[3,4]])rod(p[a],p[b],.024,0xcfa77d,'Bicycle frame');rod([x-.1,1.18,z],[x-.15,1.31,z],.022,0x9ca9a6);box(.25,.06,.15,x-.15,1.32,z,0x2e4149,'Bicycle saddle');rod([x+.37,1.2,z],[x+.36,1.43,z],.023,0x9ca9a6);rod([x+.36,1.43,z-.17],[x+.36,1.43,z+.17],.023,0x2e444e,'Handlebar');box(.30,.24,.30,x+.51,1.24,z, new T.MeshStandardMaterial({color:0x708790,wireframe:true}),'Wire bicycle basket',false);rod([x+.1,.66,z],[x+.2,.33,z+.15],.017,0x6d8289,'Kickstand');}
 bicycle(3.99,.85);
 // Back alley service details.
 box(.56,.72,1.05,3.3,.78,-2.15,0xa9b5ad,'External condenser');for(let z=-2.6;z<-1.7;z+=.09)box(.03,.55,.025,3.6,.80,z,0x637e84,'External condenser grille',false);
 box(.57,.57,.55,4.52,.58,-3.65,0x3f686b,'Alley crate');box(.50,.21,.49,4.52,.94,-3.65,0x62877e,'Crate lip');
 label('止まれ',.65,.32,-3.215,1.43,-1.95,{bg:'#b64d5b',fg:'#f0ded3',side:true,size:.56});
 box(.13,1.9,1.45,4.85,1.28,-4.5,0x435968,'Alley wall');for(let z=-5.05;z<-3.9;z+=.31)box(.018,.018,.26,4.778,1.25,z,0x71828a,'Brick detail',false);
 // Street furniture, signs, utility pole and sagging overhead cables.
 for(let x of [-2.65,-1.1,1.94]){cylinder(.045,.63,x,.61,2.55,0xd7ba7b,'Guardrail post');}
 rod([-2.65,.87,2.55],[-1.1,.87,2.55],.037,0xd7ba7b,'Corner guardrail');
 rod([-2.65,.58,2.55],[-1.1,.58,2.55],.027,0xd7ba7b,'Lower guardrail');
 cylinder(.065,3.92,4.77,2.19,2.24,0x374c5d,'Street lamp pole');curve([[4.77,3.95,2.24],[4.77,4.15,2.23],[4.57,4.29,2.23],[4.1,4.29,2.23]],.045,0x506978,'Street lamp arm');box(.66,.10,.29,4.1,4.25,2.23,0x5d7989,'Street lamp hood');box(.54,.025,.23,4.1,4.19,2.23,warm,'Street lamp');
 cylinder(.12,5.65,-3.95,2.84,-3.75,0x526673,'Utility pole');for(let y of [.35,.66,.97]){cylinder(.124,.20,-3.95,y,-3.75,0xd8b36c,'Pole hazard stripe');}
 box(.32,.48,.25,-3.95,3.75,-3.75,0x8c9a9e,'Transformer housing');rod([-4.55,5.0,-3.75],[-3.36,5.0,-3.75],.045,0x3a4e5a,'Utility crossarm');
 for(let x of [-4.46,-3.98,-3.5]){cylinder(.075,.20,x,5.13,-3.75,0x91a6ac,'Ceramic insulator');curve([[x,5.22,-3.75],[x+.5,4.75,-1],[x+1.1,4.65,1.5],[x+1.45,5.02,4.9]],.015,0x152733,'Overhead cable');}
 cylinder(.065,4.84,-2.5,2.46,4.9,0x415566,'Front cable anchor');
 rod([-3.16,4.90,4.9],[-1.89,4.90,4.9],.036,0x415566,'Front cable crossarm');
 for(let x of [-3.01,-2.53,-2.05])cylinder(.055,.12,x,4.97,4.9,0x91a6ac,'Front cable insulator');
 const signpost=cylinder(.038,1.92,-3.79,.99,1.55,0x7c97a1,'Road sign post');
 const disk=mesh(new T.CircleGeometry(.27,32),0x567fa3,-3.79,2.07,1.57,'Blue direction sign');label('↑',.35,.38,-3.79,2.08,1.58,{bg:'#567fa3',fg:'#e5e3d0',size:.85});
 box(.90,1.07,.12,3.80,1.38,-3.13,0x465d66,'Community notice board');for(let i=0;i<3;i++)label(['夏祭り','お知らせ','町内会'][i],.23,.69,3.51+i*.29,1.39,-3.06,{bg:['#d6c598','#b9cfc1','#d2adad'][i],fg:'#5f685f',size:.21});
 for(let x of [3.43,4.17])rod([x,.3,-3.13],[x,.87,-3.13],.035,0x60777e,'Noticeboard legs');
 cylinder(.05,3.22,-4.8,1.65,-4.65,0x3d5665,'Traffic signal pole');box(.81,.29,.27,-4.54,3.20,-4.65,0x263c4b,'Small traffic signal');
 const signals=[];for(let i=0;i<3;i++){const m=new T.MeshStandardMaterial({color:[0x63c1b0,0xe9c16d,0xe57986][i],emissive:[0x63c1b0,0xe9c16d,0xe57986][i],emissiveIntensity:i===2?2:.04});const o=cylinder(.079,.025,-4.80+i*.26,3.2,-4.50,m,'Signal lens');o.rotation.x=Math.PI/2;signals.push(m);}
 // Small vegetation softens the hard architecture, without any people.
 for(let p of [[3.35,2.14],[-3.06,-4.15]]){cylinder(.20,.28,p[0],.44,p[1],0x9d796a,'Terracotta planter',.15);for(let i=0;i<9;i++){const a=rand()*Math.PI*2,r=rand()*.17;const leaf=mesh(new T.IcosahedronGeometry(.18,0),[0x58877a,0x699985,0x477567][i%3],p[0]+Math.cos(a)*r,.76+rand()*.27,p[1]+Math.sin(a)*r,'Planter foliage');leaf.scale.set(.70,1.4,.70);}}
 // Soft painted pools of spilled light, also exported to Blender.
 function pool(x,z,sx,sz,color,opacity){const m=new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false});const o=mesh(new T.CircleGeometry(1,40),m,x,.065,z,'Light reflected in a puddle');o.rotation.x=-Math.PI/2;o.scale.set(sx,sz,1);return o;}
 pool(-.15,3.28,2.7,.30,0x88b6a2,.07);pool(3.82,3.62,.48,.74,0xd5ae7e,.10);pool(-2.7,3.45,.35,.60,0x6cc9d2,.12);
 const ambient=new T.HemisphereLight(0xb4cced,0x566079,1.18);scene.add(ambient);
 const moon=new T.DirectionalLight(0xa9c6ee,1.50);moon.position.set(-3,9,6);moon.castShadow=true;moon.shadow.mapSize.set(2048,2048);Object.assign(moon.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:.1,far:30});moon.shadow.bias=-.0005;moon.shadow.normalBias=.03;scene.add(moon);
 const rim=new T.DirectionalLight(0x8fbfff,.35);rim.position.set(6.5,4.2,-7.5);scene.add(rim);
  lamp(-1.7,2.25,-1.4,0xffb871,13,6);lamp(1.45,2.25,-.5,0xffcf96,10,5);const frontLight=lamp(-.4,2.32,1.8,0xffb060,10,6);lamp(-2.5,1.4,2.6,0x7acbe5,2,3);lamp(4.1,3.8,2.23,0xffd499,9,6);
 return {scene,world,doors,sign,signals,frontLight,glass,rand};
}
