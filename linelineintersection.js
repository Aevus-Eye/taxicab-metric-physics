/**
 * @author Peter Kelley
 * @author pgkelley4@gmail.com
 */

/**
 * See if two line segments intersect. This uses the 
 * vector cross product approach described below:
 * http://stackoverflow.com/a/565282/786339
 * 
 * @param {Object} p point object with x and y coordinates
 *  representing the start of the 1st line.
 * @param {Object} p2 point object with x and y coordinates
 *  representing the end of the 1st line.
 * @param {Object} c point object with x and y coordinates
 *  representing the start of the 2nd line. (center of rotation)
 * @param {number} a
 *  the angle of line 2
 */

function doLineSegmentLineIntersection(p, p2, c, a) {
	var r = subtractPoints(p2, p);
	var s = {y:tcsin(a),x:tccos(a)};

	//var uNumerator = crossProduct(subtractPoints(c, p), r);
	var denominator = crossProduct(r, s);

	if (/*uNumerator == 0 ||*/ denominator == 0) {
	  //if(frame ===120 )
	  //print(p,p2,uNumerator,denominator)
		// They are collinear or parallel
		return {intersect: false};
  }

	//var u = uNumerator / denominator;
	var t = crossProduct(subtractPoints(c, p), s) / denominator;

	//return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
	return {intersect: t>0&&t<1, t};
}

/**
 * Calculate the cross product of the two points.
 * 
 * @param {Object} point1 point object with x and y coordinates
 * @param {Object} point2 point object with x and y coordinates
 * 
 * @return the cross product result as a float
 */
function crossProduct(point1, point2) {
	return point1.x * point2.y - point1.y * point2.x;
}

/**
 * Subtract the second point from the first.
 * 
 * @param {Object} point1 point object with x and y coordinates
 * @param {Object} point2 point object with x and y coordinates
 * 
 * @return the subtraction result as a point object
 */ 
function subtractPoints(point1, point2) {
	var result = {};
	result.x = point1.x - point2.x;
	result.y = point1.y - point2.y;

	return result;
}

