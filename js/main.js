var cylinderMesh = function(vstart, vend,raduis, material)
{
	var HALF_PI = Math.PI * .5;
    var distance = vstart.distanceTo(vend);
    var position  =vend.clone().add(vstart).divideScalar(2);
    
    var cylinder = new THREE.CylinderGeometry(raduis*1.5,raduis,distance,50,50,false);
	
    var orientation = new THREE.Matrix4();
    var offsetRotation = new THREE.Matrix4();
    var offsetPosition = new THREE.Matrix4();
    orientation.lookAt(vstart,vend,new THREE.Vector3(0,1,0));
    offsetRotation.makeRotationX(HALF_PI);
    orientation.multiply(offsetRotation);
    cylinder.applyMatrix(orientation)

    var mesh = new THREE.Mesh(cylinder,material);

    mesh.position.set(position.x,position.y,position.z);
	return mesh;
}

function generateVertexColors ( geometry ) {

	for ( var i=0, il = geometry.faces.length; i < il; i++ ) {

		geometry.faces[i].vertexColors.push( new THREE.Color().setHSL(
			1,//i / il * Math.random(),
			1,
			1
		) );
		geometry.faces[i].vertexColors.push( new THREE.Color().setHSL(
			1,//i / il * Math.random(),
			1,
			1
		) );
		geometry.faces[i].vertexColors.push( new THREE.Color().setHSL(
			1,//i / il * Math.random(),
			1,
			1
		) );

		geometry.faces[i].color = new THREE.Color().setHSL(
			1,//i / il * Math.random(),
			1,
			1
		);

	}

}

function DrawMolecule(moleculeData){
	var molecule=new THREE.Object3D();
	var radius_bond=100;
	for(var i in moleculeData.atoms){
		if (moleculeData.atoms[i].r/3<radius_bond)
			radius_bond=moleculeData.atoms[i].r/3;
	}
	for(var i in moleculeData.atoms){
		var color=moleculeData.atoms[i].atom.color;
		var sphereGeometry = new THREE.SphereGeometry(moleculeData.atoms[i].r, 100, 50 );
		generateVertexColors(sphereGeometry);
		
		var sphereMaterial = new THREE.MeshPhongMaterial( { 
								    color: color, 
								    specular: 0xffffff,
								    shininess:5
								} );
		sphereMaterial.vertexColors = THREE.FaceColors;
		var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
		molecule.add(sphere);
		sphere.position.set(moleculeData.atoms[i].pos[0],moleculeData.atoms[i].pos[1],moleculeData.atoms[i].pos[2]);
	}

	for(var i in moleculeData.bonds){
		
		var start=new THREE.Vector3(moleculeData.bonds[i].from[0],moleculeData.bonds[i].from[1],moleculeData.bonds[i].from[2]);
		var end=new THREE.Vector3(moleculeData.bonds[i].to[0],moleculeData.bonds[i].to[1],moleculeData.bonds[i].to[2]);
		var mid=end.clone().add(start).divideScalar(2);
		var bondMaterialFrom = new THREE.MeshPhongMaterial( { 
								    color: moleculeData.bonds[i].atom[0].color, 
								    specular: 0x555555,
								    shininess:20
								} );

		var bondfrom = cylinderMesh(start,mid,radius_bond,bondMaterialFrom);

		var bondMaterialTo = new THREE.MeshPhongMaterial( { 
								    color: moleculeData.bonds[i].atom[1].color, 
								    specular: 0x555555,
								    shininess:20
								} );
		var bondto = cylinderMesh(end,mid,radius_bond,bondMaterialTo);

		molecule.add(bondfrom);
		molecule.add(bondto);
	}

	return molecule;
}


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 1 );
document.body.appendChild( renderer.domElement );

var ambientLight = new THREE.AmbientLight(0xffffff);
scene.add( ambientLight );
var lights = [];
lights[0] = new THREE.PointLight( 0xffffff, 0.5, 0 );
lights[1] = new THREE.PointLight( 0xffffff, 0.3, 0 );
lights[2] = new THREE.PointLight( 0xffffff, 0.3, 0 );

lights[0].position.set( 0, 200, 0 );
lights[1].position.set( 0, 200, 100 );
lights[2].position.set( 0, -200, 100 );

scene.add( lights[0] );
scene.add( lights[1] );
scene.add( lights[2] );




var c;


camera.position.z = 5;

var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};
renderer.domElement.addEventListener('mousedown', function(e) {
    isDragging = true;
});
renderer.domElement.addEventListener('mousemove', function(e) {
    //console.log(e);
    var deltaMove = {
        x: e.offsetX-previousMousePosition.x,
        y: e.offsetY-previousMousePosition.y
    };

    if(isDragging) {
            
        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));
        
        c.quaternion.multiplyQuaternions(deltaRotationQuaternion, c.quaternion);
    }
    
    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
});
/* */

function toRadians(angle) {
	return angle * (Math.PI / 180);
}

function toDegrees(angle) {
	return angle * (180 / Math.PI);
}
document.addEventListener('mouseup', function(e) {
    isDragging = false;
});

var render = function () {
	requestAnimationFrame( render );

	//c.rotation.x += 0.1;
	//c.rotation.y += 0.05;
	

	renderer.render(scene, camera);
};
render();
function RenderScene(moleculename){
	if(moleculename!=""){
		if (c!=undefined){
			scene.remove(c);
		}
		var obj=eval("Molecule."+moleculename)
		c=DrawMolecule(obj);
		scene.add(c);
		
		
	}
}





