
const teapotSize = 40;
let tess = - 1;	// force initialization
let bBottom;
let bLid;
let bBody;
let bFitLid;
let bNonBlinn;
let shading;
let wireMaterial, flatMaterial, gouraudMaterial, phongMaterial, texturedMaterial, reflectiveMateria
let teapot, textureCube;

// allocate these just once
const specularColor = new THREE.Color();
const diffuseColor = new THREE.Color();

function init() {
  //Basic
  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
  camera.position.z = 20;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  //let teapot;
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);


  var gui = new dat.GUI();
  var clock = new THREE.Clock();

  var background_folder = gui.addFolder('Backgrounds')
  var textureLoader = new THREE.TextureLoader();

  // TEXTURE MAP
  const textureMap = new THREE.TextureLoader().load( 'textures/uv_grid_opengl.jpg' );
  textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
  textureMap.anisotropy = 16;
  textureMap.encoding = THREE.sRGBEncoding;

  // REFLECTION MAP
  const path = "textures/cube/pisa/";
  const urls = [
    path + "px.png", path + "nx.png",
    path + "py.png", path + "ny.png",
    path + "pz.png", path + "nz.png"
  ];

  textureCube = new THREE.CubeTextureLoader().load( urls );
	textureCube.encoding = THREE.sRGBEncoding;
  // MATERIAL
  const materialColor = new THREE.Color();
	materialColor.setRGB( 1.0, 1.0, 1.0 );
  const terazzoMaterial = new THREE.MeshStandardMaterial( {  
    normalMap: textureLoader.load("./models/Terrazzo_002_normal.jpg"),
    map: textureLoader.load('./models/Terrazzo_002_basecolor.jpg'),
    displacementMap: textureLoader.load("./models/Terrazzo_002_height.png"),
    displacementScale:0.1,
    roughnessMap: textureLoader.load("./models/Terrazzo_002_roughness.jpg"),
    roughness:1,
    aoMap: textureLoader.load("./models/Terrazzo_002_ambientOcclusion.jpg"),
  } );

  const bawanglongMaterial = new THREE.MeshStandardMaterial( {  
  normalMap: textureLoader.load("./rex/textures/bawanglong_normal.png"),
  map: textureLoader.load('./rex/textures/bawanglong_baseColor.png'),
  //displacementMap: textureLoader.load("./models/Terrazzo_002_height.png"),
  displacementScale:0.1,
  roughnessMap: textureLoader.load("./rex/textures/bawanglong_metallicRoughness.png"),
  roughness:1,
  //aoMap: textureLoader.load("./models/Terrazzo_002_ambientOcclusion.jpg"),
  } );
	

  // Water Material
  const waterMaterial = new THREE.MeshStandardMaterial( {  
    normalMap: textureLoader.load("./rex/textures/Water/Water_002_NORM.jpg"),
    map: textureLoader.load('./rex/textures/Water/Water_002_COLOR.jpg'),
    displacementMap: textureLoader.load("./rex/textures/Water/Water_002_DISP.png"),
    displacementScale:0.1,
    roughnessMap: textureLoader.load("./rex/textures/Water/Water_002_ROUGH.jpg"),
    roughness:1,
    aoMap: textureLoader.load("./rex/textures/Water/Water_002_OCC.jpg"),
    } );

  // Alien Material
  const alienMaterial = new THREE.MeshStandardMaterial( {  
    normalMap: textureLoader.load("./rex/textures/Alien/Alien_Flesh_001_norm.jpg"),
    map: textureLoader.load('./rex/textures/Alien/Alien_Flesh_001_color.jpg'),
    displacementMap: textureLoader.load("./rex/textures/Alien/Alien_Flesh_001_disp.jpg"),
    displacementScale:0.1,
    roughnessMap: textureLoader.load("./rex/textures/Alien/Alien_Flesh_001_render.jpg"),
    roughness:1,
    aoMap: textureLoader.load("./rex/textures/Alien/Alien_Flesh_001_occ.jpg"),
    } );
  
	texturedMaterial = new THREE.MeshPhongMaterial( { color: materialColor, map: textureMap, side: THREE.DoubleSide } );
	reflectiveMaterial = new THREE.MeshPhongMaterial( { color: materialColor, envMap: textureCube, side: THREE.DoubleSide } );
  var plane = getPlane(20,20);
  plane.rotation.x = Math.PI/2;
  
  // const 

  var folder_plane = gui.addFolder('Plane');
  folder_plane.add(plane.position, 'x', -100, 100);
  folder_plane.add(plane.position, 'y', -100, 100);
  folder_plane.add(plane.position, 'z', -100, 100);
  gui['add plane'] = function(){
    scene.add(plane)
  }

  folder_plane.add(gui, 'add plane')

  gui['remove plane'] = function(){
    scene.remove(plane)
  }
  folder_plane.add(gui, 'remove plane')


  // backgrounds gui
  gui['basic'] = function () {
    scene.background = textureLoader.load('basic_background.png');
  };
  background_folder.add(gui, 'basic');
  
  gui['space'] = function () {
    scene.background = textureLoader.load('space1.jpg');
  };
  background_folder.add(gui, 'space');
  
  // helper gui
  var axesHelper = new THREE.AxesHelper(18);
  var grid_helper = new THREE.GridHelper(200, 50);

  var folder_helper = gui.addFolder("Helper")

  gui['add axes'] = function(){
    scene.add(axesHelper);
  }
  folder_helper.add(gui, 'add axes');
  
  gui['remove axes'] = function(){
    scene.remove(axesHelper);
  }
  folder_helper.add(gui, 'remove axes');
  
  gui['add grid'] = function(){
    scene.add(grid_helper);
  }
  folder_helper.add(gui, 'add grid');
  
  gui['remove grid'] = function(){
    scene.remove(grid_helper);
  }
  folder_helper.add(gui, 'remove grid');
  
  
  var conf = { color: "#ffae23" };

  var ambientLight = getAmbientLight(conf, 0);
  var ambient_sphere = getSphere(0.5);
  // GUI of Ambient Light
  var folder_ambientlight = gui.addFolder('AmbientLight');
  folder_ambientlight.addColor(conf, 'color').onChange(function (colorValue) {
    ambientLight.color.set(colorValue);
  });
  folder_ambientlight.add(ambientLight, 'intensity', 0, 10);
  folder_ambientlight.add(ambientLight.position, 'x', -100, 100);
  folder_ambientlight.add(ambientLight.position, 'y', -100, 100);
  folder_ambientlight.add(ambientLight.position, 'z', -100, 100);

  gui['ASource'] = function () {
    ambientLight.add(ambient_sphere);
  }
  folder_ambientlight.add(gui, 'ASource')

  gui['remove ASource'] = function () {
    ambientLight.remove(ambient_sphere);
  }
  folder_ambientlight.add(gui, 'remove ASource')
  scene.add(ambientLight)

  
  //Adding types of Light
  var conf = { color: "#ffae23" };

  var spotLight = getSpotLight(conf, 0);
  var  spot_sphere = getSphere(0.5);
  // GUI of Spotlight
  var folder_spotlight = gui.addFolder('SpotLight');
  folder_spotlight.addColor(conf, 'color').onChange(function (colorValue) {
    spotLight.color.set(colorValue);
  });
  folder_spotlight.add(spotLight, 'intensity', 0, 10);
  folder_spotlight.add(spotLight.position, 'x', -100, 100);
  folder_spotlight.add(spotLight.position, 'y', -100, 100);
  folder_spotlight.add(spotLight.position, 'z', -100, 100);
  
  gui['SPLSource'] = function(){
    spotLight.add(spot_sphere);
  }
  folder_spotlight.add(gui, 'SPLSource')

  gui['remove SPLSource'] = function(){
    spotLight.remove(spot_sphere);
  }
  folder_spotlight.add(gui, 'remove SPLSource')
  
  scene.add(spotLight);
  
  
  var directionalLight = getDirectionalLight(conf, 0);
  var direct_sphere = getSphere(0.5);
  
  // GUI of Directional Light
  
  var folder_directionalLight = gui.addFolder('DirectionalLight');
  folder_directionalLight.addColor(conf, 'color').onChange(function (colorValue) {
    directionalLight.color.set(colorValue);
  });

  folder_directionalLight.add(directionalLight, 'intensity', 0, 10);
  folder_directionalLight.add(directionalLight.position, 'x', -100, 100);
  folder_directionalLight.add(directionalLight.position, 'y', -100, 100);
  folder_directionalLight.add(directionalLight.position, 'z', -100, 100);
  
  gui['DLSource'] = function(){
    directionalLight.add(direct_sphere);
  }
  folder_directionalLight.add(gui, 'DLSource')

  gui['remove DL source'] = function(){
    directionalLight.remove(direct_sphere);
  }
  folder_directionalLight.add(gui, 'remove DL source')
  
  scene.add(directionalLight);
  //GUI of PointLights
  //var folder_pointlights = gui.addFolder('PointLights');
  //folder_pointlights.add(pointLight1, 'intensity', 0, 10).name('RedPoint');
  //folder_pointlights.add(pointLight2, 'intensity', 0, 10).name('YellowPoint');
  //folder_pointlights.add(pointLight3, 'intensity', 0, 10).name('GreenPoint');
  //folder_pointlights.add(pointLight4, 'intensity', 0, 10).name('BluePoint');



  // animation pointlights
  var FolderLights = gui.addFolder('Auto Lights');
  // Animation Light 1
  color1 = '#f24744'
  var pointLight1_a1 = getPointLight(color1, 5);
  pointLight1_a1.name = 'light1';

  // yellow light
  color2 = '#fbef3c';
  var pointLight2_a1 = getPointLight(color2, 5);
  pointLight2_a1.name = 'light2';

  // green light
  color3 = '#76ec7e'
  var pointLight3_a1 = getPointLight(color3, 5);
  pointLight3_a1.name = 'light3'

  color4 = '#2b68fa'
  var pointLight4_a1 = getPointLight(color4, 5);
  
  var red_lighthelper_a1 = new THREE.PointLightHelper(pointLight1_a1, 0.5);
  var yellow_lighthelper_a1 = new THREE.PointLightHelper(pointLight2_a1, 0.5);
  var green_lighthelper_a1 = new THREE.PointLightHelper(pointLight3_a1, 0.5);
  var blue_lighthelper_a1 = new THREE.PointLightHelper(pointLight4_a1, 0.5);

  gui['Add auto Light 1'] = function () {
    //temp_light.remove(temp.children[0]);
    // loop 
    var frame = 0,
      maxFrame = 360,
      lt = new Date(),
      fps = 120,
      per,
      bias,
      loop = function () {
        requestAnimationFrame(loop);
        var r = Math.PI * 1.25 * per,
          sin = Math.sin(r) * 20,
          cos = Math.cos(r) * 20,
          now = new Date(),
          secs = (now - lt) / 1000;

        per = frame / maxFrame;
        bias = 1 - Math.abs(0.5 - per) / 0.5;

        if (secs > 0.5 / fps) {

          // update point lights
          pointLight1_a1.position.set(1 - sin, 0, cos);
          pointLight2_a1.position.set(1 - cos, 0, sin);
          pointLight3_a1.position.set(cos, 0, 1 - sin);
          pointLight4_a1.position.set(sin, 0, 1 - cos);
          // render
          renderer.render(scene, camera);
          lt = new Date();

          // step frame
          frame += fps * secs;
          frame %= maxFrame;

        }

      };
    loop();

    scene.add(red_lighthelper_a1);
    scene.add(yellow_lighthelper_a1);
    scene.add(green_lighthelper_a1);
    scene.add(blue_lighthelper_a1);

    scene.add(pointLight1_a1);
    scene.add(pointLight2_a1);
    scene.add(pointLight3_a1);
    scene.add(pointLight4_a1);

  };
  FolderLights.add(gui, 'Add auto Light 1')

  gui['remove Light 1'] = function(){
    scene.remove(red_lighthelper_a1);
    scene.remove(yellow_lighthelper_a1);
    scene.remove(green_lighthelper_a1);
    scene.remove(blue_lighthelper_a1);

    scene.remove(pointLight1_a1);
    scene.remove(pointLight2_a1);
    scene.remove(pointLight3_a1);
    scene.remove(pointLight4_a1);

  }
  FolderLights.add(gui, 'remove Light 1')
  // Animation Light 1  
  color1 = '#f24744'
  var pointLight1_a2 = getPointLight(color1, 5);

  // yellow light
  color2 = '#fbef3c';
  var pointLight2_a2 = getPointLight(color2, 5);

  // green light
  color3 = '#76ec7e'
  var pointLight3_a2 = getPointLight(color3, 5);

  color4 = '#2b68fa'
  
  var pointLight4_a2 = getPointLight(color4, 5);

  var red_lighthelper_a2 = new THREE.PointLightHelper(pointLight1_a2, 0.5);
  var yellow_lighthelper_a2 = new THREE.PointLightHelper(pointLight2_a2, 0.5);
  var green_lighthelper_a2 = new THREE.PointLightHelper(pointLight3_a2, 0.5);
  var blue_lighthelper_a2 = new THREE.PointLightHelper(pointLight4_a2, 0.5);
  
  gui['Add auto Light 2'] = function () {
    
    //temp_light.remove(temp.children[0]);
    // loop 
    var frame = 0,
      maxFrame = 360,
      lt = new Date(),
      fps = 120,
      per,
      bias,
      loop = function () {
        requestAnimationFrame(loop);
        var r = Math.PI * 1.25 * per,
          sin = Math.sin(r) * 20,
          cos = Math.cos(r) * 20,
          now = new Date(),
          secs = (now - lt) / 1000;

        per = frame / maxFrame;
        bias = 1 - Math.abs(0.5 - per) / 0.5;

        if (secs > 0.5 / fps) {

          // update point lights
          pointLight1_a2.position.set(0, 1 - sin, cos);
          pointLight2_a2.position.set(0, cos, 1 - sin);
          pointLight3_a2.position.set(0, cos, 1 + sin);
          pointLight4_a2.position.set(0, 1 + sin, cos);
          // render
          renderer.render(scene, camera);
          lt = new Date();

          // step frame
          frame += fps * secs;
          frame %= maxFrame;

        }

      };
    loop();

    scene.add(red_lighthelper_a2);
    scene.add(yellow_lighthelper_a2);
    scene.add(green_lighthelper_a2);
    scene.add(blue_lighthelper_a2);

    scene.add(pointLight1_a2);
    scene.add(pointLight2_a2);
    scene.add(pointLight3_a2);
    scene.add(pointLight4_a2);

  };
  FolderLights.add(gui, 'Add auto Light 2')
  
  gui['remove Light 2'] = function(){
    scene.remove(red_lighthelper_a2);
    scene.remove(yellow_lighthelper_a2);
    scene.remove(green_lighthelper_a2);
    scene.remove(blue_lighthelper_a2);

    scene.remove(pointLight1_a2);
    scene.remove(pointLight2_a2);
    scene.remove(pointLight3_a2);
    scene.remove(pointLight4_a2);

  }
  FolderLights.add(gui, 'remove Light 2');

  // Adding stars
  function addStar() {
    var geometry = new THREE.SphereGeometry(0.25, 24, 24);
    var material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    var star = new THREE.Mesh(geometry, material);

    var [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    scene.add(star);
  }
  Array(200).fill().forEach(addStar);

  ////////////////////////--------------------------
  var geometry = new THREE.BoxGeometry(5,5,5);
  var material = new THREE.MeshPhongMaterial({transparent:true});
  var temp = new THREE.Mesh(geometry, material);
  temp.castShadow = true;
  temp.name = 'temp';

  var pgeometry = new THREE.BoxGeometry(5,5,5,5,5,5);
  var pmaterial = new THREE.PointsMaterial( { size: 2, sizeAttenuation: false } );
  var ptemp = new THREE.Points(pgeometry,pmaterial);
  ptemp.castShadow = true;
  ptemp.name='ptemp';
  ptemp.visible=false;
  // 2.1.1.1 Ve cac khoi hinh co ban
  var GeometryList = gui.addFolder('Points Geometry');
  
  gui['PCube'] = function(){   
    temp.visible=false; 
    ptemp.geometry = new THREE.BoxGeometry(5,5,5,5,5,5);
    ptemp.visible=true;
  }  
  GeometryList.add(gui, 'PCube');

  gui['PSphere'] = function () {
    temp.visible=false;
    ptemp.geometry = new THREE.SphereGeometry(3, 18, 18);
    ptemp.visible=true;
  }
  GeometryList.add(gui, 'PSphere');

  gui['PCone'] = function () {
    temp.visible=false;
    ptemp.geometry = new THREE.ConeGeometry(3, 7, 32, 10, false, 2);
    ptemp.visible=true;
  }
  GeometryList.add(gui, 'PCone');

  gui['PCylinder'] = function () {
    temp.visible=false;
    ptemp.geometry = new THREE.CylinderGeometry(3, 3, 7, 32, 10, false, 5);
    ptemp.visible=true;
  }
  GeometryList.add(gui, 'PCylinder');

  gui['PTorus'] = function () {
    temp.visible=false;
    ptemp.geometry = new THREE.TorusGeometry(3, 1, 16, 100);
    ptemp.visible=true;
  }
  GeometryList.add(gui, 'PTorus');


  gui['PTeapot'] = function () {
    temp.visible=false;
    ptemp.geometry = new TeapotGeometry(3);
    ptemp.visible=true;
  }
  GeometryList.add(gui, 'PTeapot');
  //
  var GeometryList_2 = gui.addFolder('Lines and Solid Geometry');
  
  gui['Cube'] = function(){
    ptemp.visible=false;    
    temp.geometry = new THREE.BoxGeometry(5,5,5);
    temp.visible=true;
  }  
    
  GeometryList_2.add(gui, 'Cube');

  gui['Sphere'] = function () {
    ptemp.visible=false;
    temp.geometry = new THREE.SphereGeometry(3, 18, 18);
    temp.visible=true;
  }
  GeometryList_2.add(gui, 'Sphere');

  gui['Cone'] = function () {
    ptemp.visible=false;
    temp.geometry = new THREE.ConeGeometry(3, 7, 32);
    temp.visible=true;
  }
  GeometryList_2.add(gui, 'Cone');

  gui['Cylinder'] = function () {
    ptemp.visible=false;
    temp.geometry = new THREE.CylinderGeometry(3, 3, 7, 32);
    temp.visible=true;
  }
  GeometryList_2.add(gui, 'Cylinder');

  gui['Torus'] = function () {
    ptemp.visible=false;
    temp.geometry = new THREE.TorusGeometry(3, 1, 16, 100);
    temp.visible=true;
  }
  GeometryList_2.add(gui, 'Torus');

  gui['Teapot'] = function(){
    ptemp.visible=false;
    temp.geometry = new TeapotGeometry(3);
    temp.visible=true;
  };
  GeometryList_2.add(gui, 'Teapot');
  // 2.1.1.2 Ve hinh theo: lines, points, solid
  MaterialList = { 'Material': 'solid' };
  gui.add(MaterialList, 'Material', ['solid', 'lines']);
  // 2.1.1.3 Thuc hien phep chieu phoi canh: x,y,z,near,far
  function updateCamera() {
    camera.updateProjectionMatrix();
  }

  var CameraAdjustment = gui.addFolder('Camera');
  CameraAdjustment.add(camera, 'fov', 1, 180).onChange(updateCamera);
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
  CameraAdjustment.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
  CameraAdjustment.add(minMaxGUIHelper, 'max', 0.1, 200, 0.1).name('far').onChange(updateCamera);

  var cameraZPosition = new THREE.Group();
  var cameraYRotation = new THREE.Group();
  var cameraXRotation = new THREE.Group();

  cameraZPosition.add(camera);
  cameraXRotation.add(cameraZPosition);
  cameraYRotation.add(cameraXRotation);
  scene.add(cameraYRotation);

  CameraAdjustment.add(cameraZPosition.position, 'z', 0, 100);
  CameraAdjustment.add(cameraYRotation.rotation, 'y', -Math.PI, Math.PI);
  CameraAdjustment.add(cameraXRotation.rotation, 'x', -Math.PI, Math.PI);

  // 2.1.1.4 Áp dụng phép biến đổi Affine cơ sở trên các khối hình cơ bản này.
  // Translation
  var huy=new THREE.Group();
  huy.add(temp,ptemp);
  huy.name='huy';
  scene.add(huy);
  var affine = gui.addFolder('Affine Trans');
    // Translation
  var translation = affine.addFolder('Translation');
  translation.add(huy.position, 'x', -50, 50);
  translation.add(huy.position, 'y', -50, 50);
  translation.add(huy.position, 'z', -50, 50);
    // Scale
  var scale = affine.addFolder('Scale');
  scale.add(huy.scale, 'x', -10, 10);
  scale.add(huy.scale, 'y', -10, 10);
  scale.add(huy.scale, 'z', -10, 10);
    // Rotation
  var rotation = affine.addFolder('Rotation');
  rotation.add(huy.rotation, 'x', -Math.PI, Math.PI);
  rotation.add(huy.rotation, 'y', -Math.PI, Math.PI);
  rotation.add(huy.rotation, 'z', -Math.PI, Math.PI);
  // // 2.1.1.6 Texture
  var texture = gui.addFolder('Texture');

  gui["Chemical"] = function(){
      temp.material = texturedMaterial;
  }
  texture.add(gui, "Chemical");

  gui["Terazzo"] = function(){
      temp.material = terazzoMaterial;
  }
  texture.add(gui, "Terazzo");

  gui["BawangLong"] = function(){
      temp.material = bawanglongMaterial;
  }
  texture.add(gui, "BawangLong");

  gui["Water"] = function(){
      temp.material = waterMaterial;
  }
  texture.add(gui, "Water");

  gui["Alien"] = function(){
      temp.material = alienMaterial;
  }
  texture.add(gui, "Alien");

  gui["Remove Texture"] = function(){
      temp.material = new THREE.MeshPhongMaterial();
  }
  texture.add(gui, "Remove Texture");
  
 // Loading models

  // Charles model
  var model=new THREE.Group();
  scene.add(model);
  // Charles model
  var loader_1 = new THREE.GLTFLoader();

  var folder_loaded_model = gui.addFolder('Loaded Models')

  gui['Charles'] = function () {
    huy.visible=false;
    model.remove(model.children[0]);
    loader_1.load('./charles/scene.gltf', result => {
      model.add(result.scene.children[0])
    });
  };
  folder_loaded_model.add(gui, 'Charles');

  // 2.1.1.7 Animation
  var animation = gui.addFolder('Animation');

  //Trex load T-rex, animation
  var Trex=new THREE.Group();
  var animationMixer= new THREE.AnimationMixer(Trex);
  var Trex_animation=animation.addFolder('T-rex animations');
  loader_1.load('Trex/scene.gltf',function(gltf)
  {
      Trex.add(gltf.scene);
      Trex.scale.setScalar(2);
      Trex.traverse(o => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
      //Trex.visible=false;
      var anis=['run','bite','roar','attack tail','idle'];
      var actions=[];

      for(var i=0; i<gltf.animations.length; i++)
      {
          actions[i] =animationMixer.clipAction(gltf.animations[i]);
      }


      gui["static pose"] = function() {
          for(var i=0; i<actions.length; i++){
              actions[i].stop();
          }
      };
      Trex_animation.add(gui, "static pose");
      
      gui["run"] = function () {
          if (model.children[0]==Trex) {
              for(var j=0; j<actions.length; j++){
                  if(j === 0){
                      actions[j].play();
                  }
                  else{
                      actions[j].stop();
                  }
              }
          }              
              }
      Trex_animation.add(gui, 'run');

      gui["bite"] = function () {
          if (model.children[0]==Trex) {
              for(var j=0; j<actions.length; j++){
                  if(j === 1){
                      actions[j].play();
                  }
                  else{
                      actions[j].stop();
                  }
              }
          }
      }
      Trex_animation.add(gui, 'bite');

      gui["roar"] = function () {
          if (model.children[0]==Trex){
              for(var j=0; j<actions.length; j++){
                  if(j === 2){
                      actions[j].play();
                  }
                  else{
                      actions[j].stop();
                  }
              }
          }
      }
      Trex_animation.add(gui, 'roar');

      gui["attack tail"] = function () {
          if (model.children[0]==Trex) {
              for(var j=0; j<actions.length; j++){
                  if(j === 3){
                      actions[j].play();
                  }
                  else{
                      actions[j].stop();
                  }
              }
          }
      }
      Trex_animation.add(gui, 'attack tail');

      gui["idle"] = function () {
          if (model.children[0]==Trex) {
              for(var j=0; j<actions.length; j++){
                  if(j === 4){
                      actions[j].play();
                  }
                  else{
                      actions[j].stop();
                  }
              }
          }
      }
      Trex_animation.add(gui, 'idle');

      gui['clear']=function() {
        huy.visible=true;
        if (model.children[0]===Trex)
        {
          for(var i=0; i<actions.length; i++){
            actions[i].stop();
          }
        }
        model.remove(model.children[0]);
      }
      folder_loaded_model.add(gui, 'clear');
  });

  gui['T-rex']=function() {
    huy.visible=false;
    model.remove(model.children[0]);
    model.add(Trex);
  }
  folder_loaded_model.add(gui,'T-rex');

  //--- geometry animation ---
  var geo_animation = animation.addFolder('Geometry animation');

  // * animation 1
  const positionKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [ 0, 0, 0, 30, 0, 0, 0, 0, 0 ] );
  const scaleKF = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 1, 1, 1, 2, 2, 2, 1, 1, 1 ] );
  const colorKF = new THREE.ColorKeyframeTrack( '.material.color', [ 0, 1, 2 ], [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ], THREE.InterpolateDiscrete );
  const opacityKF = new THREE.NumberKeyframeTrack( '.material.opacity', [ 0, 1, 2 ], [ 1, 0, 1 ] );
  
  const xAxis = new THREE.Vector3( 1, 0, 0 );
  const qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, 0 );
  const qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, Math.PI );
  const quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w ] );

  const clip = new THREE.AnimationClip( 'Action', 3, [ scaleKF, positionKF, colorKF, opacityKF,quaternionKF] );
  animationMixer2 = new THREE.AnimationMixer(temp);
  const solid_action = animationMixer2.clipAction( clip );

  animationMixer3 = new THREE.AnimationMixer(ptemp); 
  const points_action=animationMixer3.clipAction(clip);

  gui['ani 1']=function() {
    if (temp.visible)
    {
      points_action.paused=true;
      solid_action.paused=false;
      solid_action.play();
    }
    else
    {
      solid_action.paused=true;
      points_action.paused=false;
      points_action.play();
    }
    
  }
  geo_animation.add(gui,'ani 1');

  gui['cancel ani 1']=function() {
    solid_action.reset();
    solid_action.paused=true;
    points_action.reset();
    points_action.paused=true;
  }
  geo_animation.add(gui,'cancel ani 1');

  // * animation 2
  var ani2={'flag':false};
  geo_animation.add(ani2,'flag');


  
  update(renderer, scene, camera, controls, MaterialList,animationMixer,animationMixer2,animationMixer3,clock,ani2);
}

function getPlane(width, height){
  var geometry = new THREE.PlaneGeometry(width, height)
  var material = new THREE.MeshPhongMaterial({
    color: 'rgb(255, 255, 255)',
    side: THREE.DoubleSide
  })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true;

  return mesh;
}

function getSpotLight(color, intensity) {
  //color = color == undefined ? 'rgb(255, 255, 255' : color;
  light = new THREE.SpotLight(color, intensity);
  light.castShadow = true;
  //light.pemumbra = 0.5;

  // Set up shadow properties for the light
  light.shadow.mapSize.width = 1024 * 4;
  light.shadow.mapSize.height = 1024 * 4;
  light.shadow.bias = 0.001;

  return light;
}

function getDirectionalLight(color, intensity) {
  var light = new THREE.DirectionalLight(color, intensity);
  light.castShadow = true;

  light.shadow.camera.left = -1;
  light.shadow.camera.bottom = -1;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  return light;
}

function getSphere(size){
  var geometry = new THREE.SphereGeometry(size, 24, 24);
  var material = new THREE.MeshBasicMaterial({
    color: 'rgb(255, 255, 255)'
  })
  var mesh = new THREE.Mesh(geometry, material);
  
  return mesh;
}

function getAmbientLight(color, intensity) {
  var light = new THREE.AmbientLight(color, intensity);
  light.castShadow = true;

  return light;
}

function getPointLight(color, intensity) {
  var light = new THREE.PointLight(color, intensity);

  return light;
}


function update(renderer, scene, camera, controls, MaterialList,animationMixer,animationMixer2,animationMixer3,clock,ani2) {
  var time=clock.getDelta();
  animationMixer.update(time);
  animationMixer2.update(time);
  animationMixer3.update(time);
  
  var huy=scene.getObjectByName('huy');
  if (MaterialList['Material']==='solid')
  {
    huy.children[0].material.wireframe=false;
  }
  else
  {
    huy.children[0].material.wireframe=true;
  }
  // animation 2
  if (ani2['flag'])
  {
    huy.rotation.x+=Math.PI/180;
    huy.rotation.y+=Math.PI/180;
    huy.rotation.z+=Math.PI/180;
  }

renderer.render(
  scene,
  camera
);
controls.update();
requestAnimationFrame(function () {
  update(renderer, scene, camera, controls, MaterialList,animationMixer,animationMixer2,animationMixer3,clock,ani2);
})
}

class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;
  }
  get min() {
    return this.obj[this.minProp];
  }
  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }
  get max() {
    return this.obj[this.maxProp];
  }
  set max(v) {
    this.obj[this.maxProp] = v;
    this.min = this.min;
  }
}

init();