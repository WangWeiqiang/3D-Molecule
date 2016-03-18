Atom={
	H:{color:0x0000ff,text:'H'},
	O:{color:0xff0000,text:'O'}
};

Molecule={
	Water:[
		{
			atom:Atom.O,
			radius:0.5,
			pos:[0,0,0],
			bond:[{start:[-0.4,0.4,0],end:[-2,1,0]},{start:[0.4,0.4,0],end:[1,1,0]}]
		},
		{
			atom:Atom.H,
			radius:0.2,
			pos:[-2,1,0],
			bond:[{start:[-2,1,0],end:[-1,0.5,0]}]
		},
		{
			atom:Atom.H,
			radius:0.2,
			pos:[2,1,0],
			bond:[{start:[2,1,0],end:[1,0.5,0]}]
		}
	]
};

var cylinderMesh = function(vstart, vend, material)
{
	var HALF_PI = Math.PI * .5;
    var distance = vstart.distanceTo(vend);
    var position  = vend.clone().add(vstart);//.divideScalar(2);

    
    var cylinder = new THREE.CylinderGeometry(0.1,0.1,distance,50,50,false);
	

    var orientation = new THREE.Matrix4();
    var offsetRotation = new THREE.Matrix4();
    var offsetPosition = new THREE.Matrix4();
    orientation.lookAt(vstart,vend,new THREE.Vector3(0,1,0));
    offsetRotation.makeRotationX(HALF_PI);
    orientation.multiply(offsetRotation);
    cylinder.applyMatrix(orientation)

    var mesh = new THREE.Mesh(cylinder,material);
    mesh.position=position;
	return mesh;
}

function DrawMolecule(moleculeData){
	var molecule=new THREE.Object3D();
	for(var i in moleculeData){
		var color=moleculeData[i].atom.color;
		var sphereGeometry = new THREE.SphereGeometry(moleculeData[i].radius, 100, 50 );
		var sphereMaterial = new THREE.MeshLambertMaterial( { color:color} );
		var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
		molecule.add(sphere);
		sphere.position.set(moleculeData[i].pos[0],moleculeData[i].pos[1],moleculeData[i].pos[2]);

		for(var j in moleculeData[i].bond){
			bond=moleculeData[i].bond[j];
			var start=new THREE.Vector3(bond.start[0],bond.start[1],bond.start[2]);
			var end=new THREE.Vector3(bond.end[0],bond.end[1],bond.end[2]);
			var bondMaterial = new THREE.MeshBasicMaterial( { color:color } );
			var mesh = cylinderMesh(start,end,bondMaterial);
			molecule.add(mesh);
		}
	}
	return molecule;
}

var bitmap = new Image();
bitmap.src = 'images/molecules.jpg'; // Pre-load the bitmap, in conjunction with the Start button, to avoid any potential THREE.ImageUtils.loadTexture async issues.
bitmap.onerror = function () {
      console.error("Error loading: " + bitmap.src);
}

//THREE.ImageUtils.crossOrigin = '';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// Be aware that a light source is required for MeshPhongMaterial to work:
var pointLight = new THREE.PointLight(0xFFFFFF); // Set the color of the light source (white).
pointLight.position.set(100, 100, 250); // Position the light source at (x, y, z).
scene.add(pointLight); // Add the light source to the scene.



var c=DrawMolecule(Molecule.Water);

scene.add(c);


camera.position.z = 5;

var render = function () {
	requestAnimationFrame( render );

	c.rotation.x += 0.1;
	c.rotation.y += 0.1;

	renderer.render(scene, camera);
};

