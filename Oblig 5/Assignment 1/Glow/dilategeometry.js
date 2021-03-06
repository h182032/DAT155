/**
 * Original Credit: https://github.com/jeromeetienne/threex.geometricglow (MIT-License)
 */

/**
 * dilate a geometry inplace
 * @param  {THREE.Geometry} geometry geometry to dilate
 * @param  {Number} length   percent to dilate, use negative value to erode
 */
const dilateGeometry	= (geometry, length) => {
	// gather vertexNormals from geometry.faces
	const vertexNormals	= new Array(geometry.vertices.length);
	geometry.faces.forEach(function(face){
		if( face instanceof THREE.Face4 ){
			vertexNormals[face.a]	= face.vertexNormals[0];
			vertexNormals[face.b]	= face.vertexNormals[1];
			vertexNormals[face.c]	= face.vertexNormals[2];
			vertexNormals[face.d]	= face.vertexNormals[3];		
		}else if( face instanceof THREE.Face3 ){
			vertexNormals[face.a]	= face.vertexNormals[0];
			vertexNormals[face.b]	= face.vertexNormals[1];
			vertexNormals[face.c]	= face.vertexNormals[2];
		}else	console.assert(false);
	});
	// modify the vertices according to vertextNormal
	geometry.vertices.forEach(function(vertex, idx){
		const vertexNormal = vertexNormals[idx];
		vertex.x	+= vertexNormal.x * length;
		vertex.y	+= vertexNormal.y * length;
		vertex.z	+= vertexNormal.z * length;
	});		
};
