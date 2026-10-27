import bpy, json, math, random
from pathlib import Path
from mathutils import Matrix, Vector

ROOT = Path(__file__).resolve().parent
data = json.loads((ROOT / 'model/scene-data.json').read_text(encoding='utf-8'))
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=48
scene.cycles.use_denoising=True
scene.render.resolution_x=1400
scene.render.resolution_y=1400
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.fps=24
scene.frame_end=456
scene.world.color=(.055,.075,.12)
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.13,.18,.29,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.35
scene.view_settings.view_transform='AgX'
scene.view_settings.look='AgX - Medium High Contrast'
scene.view_settings.exposure=.4

collections={}
for name in ['01 Architecture','02 Interior and stock','03 Street details','04 Ink outlines','05 Weather','06 Lighting']:
 c=bpy.data.collections.new(name);scene.collection.children.link(c);collections[name]=c
def put(obj,col):
 collections[col].objects.link(obj)
def simple(name,color,emission=0,rough=.65,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
 p.inputs['Emission Color'].default_value=(*color,1);p.inputs['Emission Strength'].default_value=emission
 return m
materials={}
for uid,src in data['materials'].items():
 m=simple('Surface '+uid[:8],src['color'],src['emissiveIntensity'],src['roughness'],src['metalness'])
 p=m.node_tree.nodes.get('Principled BSDF')
 if src.get('emissive'):p.inputs['Emission Color'].default_value=(*src['emissive'],1)
 if src['texture']:
  im=bpy.data.images.load(str(ROOT/'model'/src['texture']));im.pack();t=m.node_tree.nodes.new('ShaderNodeTexImage');t.image=im
  m.node_tree.links.new(t.outputs['Color'],p.inputs['Base Color'])
  if src['emissiveIntensity']:m.node_tree.links.new(t.outputs['Color'],p.inputs['Emission Color'])
 if src['transparent']:
  out=m.node_tree.nodes.get('Material Output');mix=m.node_tree.nodes.new('ShaderNodeMixShader');clear=m.node_tree.nodes.new('ShaderNodeBsdfTransparent')
  mix.inputs[0].default_value=src['opacity'];m.node_tree.links.new(clear.outputs[0],mix.inputs[1]);m.node_tree.links.new(p.outputs[0],mix.inputs[2]);m.node_tree.links.new(mix.outputs[0],out.inputs['Surface'])
 materials[uid]=m
conversion=Matrix(((1,0,0,0),(0,0,-1,0),(0,1,0,0),(0,0,0,1)))
geo={};door_parts=[]
for uid,g in data['geometries'].items():
 a=g['positions'];vertices=[a[i:i+3] for i in range(0,len(a),3)];idx=g['index'] or list(range(len(vertices)));faces=[idx[i:i+3] for i in range(0,len(idx),3)]
 me=bpy.data.meshes.new('Geometry '+uid[:8]);me.from_pydata(vertices,[],faces);me.update()
 if g['uv']:
  uv=me.uv_layers.new(name='UVMap');a=g['uv']
  for loop in me.loops:uv.data[loop.index].uv=(a[loop.vertex_index*2],a[loop.vertex_index*2+1])
 geo[uid]=me
for src in data['meshes']:
 me=geo[src['geometry']].copy();me.materials.append(materials[src['material']]);o=bpy.data.objects.new(src['name'],me)
 a=src['matrix'];o.matrix_world=conversion@Matrix([[a[col*4+row] for col in range(4)] for row in range(4)])
 name=src['name'].lower();col='02 Interior and stock' if any(w in name for w in ['shelf','bottle','snack','package','bento','rice','coffee','checkout','oden','magazine','freezer','fridge','refrigerator','pos','staff','register']) else '01 Architecture' if any(w in name for w in ['wall','roof','store','glass','window','door','fascia','canopy','sill','floor','tile','frame']) else '03 Street details'
 put(o,col)
 if src['door']:
  base=o.location.x;direction=-1 if 'left' in src['door'] else 1
  for frame,offset in [(1,0),(216,0),(230,.49),(322,.49),(336,0),(456,0)]:o.location.x=base+direction*offset;o.keyframe_insert(data_path='location',frame=frame)
  o.location.x=base
 # Wet road material catches physically traced reflected light.
 if src['name']=='Wet asphalt':
  wet=simple('Rain-soaked asphalt',(.033,.055,.083),rough=.15,metal=.45);me.materials.clear();me.materials.append(wet)

# Crisp ink-colored edge network, with tiny round cross sections.
ink=simple('Indigo contour ink',(.015,.027,.044))
cu=bpy.data.curves.new('Architectural contour network','CURVE');cu.dimensions='3D';cu.bevel_depth=.006;cu.bevel_resolution=0;cu.resolution_u=1
a=data['edges']
for i in range(0,len(a),6):
 sp=cu.splines.new('POLY');sp.points.add(1)
 for k in range(2):j=i+k*3;sp.points[k].co=(a[j],-a[j+2],a[j+1],1)
o=bpy.data.objects.new('Fine cel-shaded contours',cu);put(o,'04 Ink outlines');cu.materials.append(ink)

# Camera and lighting use the same front-right miniature composition.
def light(name,kind,location,color,energy,size):
 d=bpy.data.lights.new(name,kind);d.color=color;d.energy=energy
 if kind=='AREA':d.shape='DISK';d.size=size
 else:d.shadow_soft_size=size
 o=bpy.data.objects.new(name,d);o.location=location;put(o,'06 Lighting');return o
for i,l in enumerate(data['lights']):
 p=l['position'];light('Warm shop practical '+str(i),'POINT',(p[0],-p[2],p[1]),l['color'],l['power']*13,.28)
moon=light('Soft blue moon','AREA',(-3,-4,10),(.52,.68,1),1000,8);moon.rotation_euler=(Vector((0,0,0))-moon.location).to_track_quat('-Z','Y').to_euler()
fill=light('Lavender alley fill','AREA',(5,3,7),(.53,.49,.82),500,7);fill.rotation_euler=(Vector((0,0,1))-fill.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(14,-17.5,11.7));cam=bpy.context.object;cam.name='Hero camera — entire square miniature';cam.rotation_euler=(Vector((0,0,1.2))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=16.1;scene.camera=cam

# Rain streaks with cyclic native keyframes; their trajectories stay outside the shop.
random.seed(71028)
rainmat=simple('Silver-blue rain',(.43,.61,.74),emission=.45)
for i in range(300):
 x=random.uniform(-5.45,5.45);y=random.uniform(-5.45,5.45)
 if -3.5<x<3.3 and -1.8<y<3.5:continue
 floor=.32 if x>-3.4 and y>-2.65 else .07
 length=random.uniform(.07,.18)
 cu=bpy.data.curves.new('Rain stroke','CURVE');cu.dimensions='3D';cu.bevel_depth=.0035;cu.bevel_resolution=0;sp=cu.splines.new('POLY');sp.points.add(1);sp.points[0].co=(0,0,0,1);sp.points[1].co=(.01,0,length,1);cu.materials.append(rainmat)
 o=bpy.data.objects.new('Rain '+str(i),cu);put(o,'05 Weather');o.location=(x,y,floor+random.random()*6)
 offset=random.randint(-26,0)
 for frame,z in [(offset,6.5),(offset+27,floor)]:o.location.z=z;o.keyframe_insert(data_path='location',frame=frame)
 action=o.animation_data.action
 # Modern layered actions expose curves through the slot channel bag.
 for layer in action.layers:
  for strip in layer.strips:
   for bag in strip.channelbags:
    for f in bag.fcurves:
     for key in f.keyframe_points:key.interpolation='LINEAR'
     f.modifiers.new('CYCLES')
# Subtle puddle ripples.
ripplemat=simple('Puddle ripple light',(.22,.38,.45),emission=.12,rough=.18)
for i in range(24):
 x=random.uniform(-5.3,5.3);y=random.uniform(-5.3,-2.95)
 bpy.ops.mesh.primitive_torus_add(major_radius=.14,minor_radius=.005,major_segments=32,minor_segments=4,location=(x,y,.071))
 o=bpy.context.object;o.name='Expanding puddle ring';o.data.materials.append(ripplemat)
 for col in list(o.users_collection):col.objects.unlink(o)
 put(o,'05 Weather')
 for frame,s in [(1,.10),(24,1.5),(25,.10),(48,1.5)]:o.scale=(s,s,s);o.keyframe_insert(data_path='scale',frame=frame)

scene.frame_set(120)
for area in bpy.context.screen.areas:
 if area.type=='VIEW_3D':
  area.spaces.active.region_3d.view_perspective='CAMERA'
  area.spaces.active.shading.type='MATERIAL'
bpy.ops.object.select_all(action='DESELECT')
scene.render.filepath=str(ROOT/'rainy-konbini.png')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'rainy-konbini.blend'))
print('MODEL_SAVED',len(bpy.data.objects),'objects')
bpy.ops.render.render(write_still=True)
print('RENDER_SAVED')
