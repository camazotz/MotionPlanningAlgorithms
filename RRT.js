/**
 * Created by nav on 4/18/16.
 */

/*
 JavaScript implementation of Java String hashcode borrowed from an online
 source: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
String.prototype.hashCode = function(){
    var hash = 0;
    if (this.length == 0) return hash;
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

/*
 Vertex class and attributes
 */
function Vertex(somecor1, somecor2, someId) {
    this.xcor = somecor1;
    this.ycor = somecor2;
    this.sid = someId;
}

Vertex.prototype = {
    constructor: Vertex,
    getX:function() {
        return this.xcor;
    },

    getY:function() {
        return this.ycor;
    },

    getCoords:function() {
        var coords = [];
        coords.push(this.xcor);
        coords.push(this.ycor);
        return coords;
    },

    setId:function(someId) {
        this.sid = someId;
    },

    getId:function() {
        return this.sid;
    },

    hashCode:function() {
        var prime = 31;
        var result = 1;
        result = prime * result + ((this.sid == null) ? 0 : this.sid.hashCode());
        return result;
    }

};

/*
 Edge class and attributes
 */

function Edge(first, second, dist, anId){
    this.source = first;
    this.destination = second;
    this.weight = dist;
    this.eid = anId;
}

Edge.prototype = {
    constructor: Edge,
    getWeight:function() {
        return this.weight;
    },

    getSource:function() {
        return this.source;
    },

    getDestination:function() {
        return this.destination;
    },

    setId:function(anId) {
        this.eid = anId;
    },

    getId:function() {
        return this.eid;
    },

    setEdge:function(first, second, dist) {
        this.source = first;
        this.destination = second;
        this.weight = dist;
    }

};

/*
 Graph class and attributes
 */

function Graph(vertList, edgeList) {
    this.vertices = vertList;
    this.edges = edgeList;
}

Graph.prototype = {
    constructor: Graph,

    getVertices:function() {
        return this.vertices;
    },

    getEdges:function() {
        return this.edges;
    }
};

/*
    RRT
 */

function SampleFree(xRange, yRange, obstacles){
    var xcor, ycor;

    do {
        xcor = getRandomInt(0, xRange);
        ycor = getRandomInt(0, yRange);

        var newCoords = [];
        newCoords.push(xcor);
        newCoords.push(ycor);
    } while (clear(obstacles, newCoords) != true);

    var newVert = new Vertex(xcor, ycor, String(xcor) + String(ycor));
    return newVert;
}

function Near(aGraph, aVertex, aRadius){

    var vertInRadius = [];                      // Vertices contained in radius
    var allVertices = aGraph.getVertices();

    for (var i = 0; i < allVertices.length; i++){
        var eachVertex = allVertices[i];

        //document.write('befdist');
        //document.write(allVertices[i]);
        // Apply distance formula
        var dist = Math.sqrt(Math.pow((eachVertex.getX() - aVertex.getX()), 2) + Math.pow((eachVertex.getY() - aVertex.getY()), 2));

        //document.write('after dist: ' + dist);
        if (dist <= aRadius){
            vertInRadius.push(allVertices[i]);
        }
    }

    return vertInRadius;
}

function Nearest(aGraph, aPoint){
    var allVertices = aGraph.getVertices();
    var nearestVertex = null;
    var minDist = Infinity;

    for (var i = 0; i < allVertices.length; i++) {

        var eachVertex = allVertices[i];

        // Apply distance formula
        var dist = Math.sqrt(Math.pow((eachVertex.getX() - aPoint.getX()), 2) + Math.pow((eachVertex.getY() - aPoint.getY()), 2));

        if (dist < minDist){
            minDist = dist;
            nearestVertex = allVertices[i];
        }
    }
    return nearestVertex;
}

function Steer(){
    
}

function rrt(obstacles, testP, destP, nMilestone, mNeighbor,
    xleft, xright, ybottom, ytop){
    var vertices = [];
    var edges = [];
    var rrtGraph = new Graph(vertices, edges);

    var xRange = xright - xleft;
    var yRange = ytop - ybottom;

    var testVertex = new Vertex(testP[0], testP[1], String(testP[0]) + String(testP[1]));
    vertices.push(testVertex);

    for (var i = 0; i < nMilestone; i++) {

        var randVertex = SampleFree(xRange, yRange, obstacles);
        var nearestVertex = Nearest(rrtGraph, randVertex);
        var steerVertex = Steer();

        if (link(obstacles, nearestVertex, steerVert)){
            vertices.push(steerVertex);
        }
    }
}

/*
 Link and Clear
 */

function link(obstacles, testP, destP){

    // Check if start point is in collision
    if (clear(obstacles, testP) == false){
        return false;
    }

    var testX = testP[0];
    var testY = testP[1];
    var destX = destP[0];
    var destY = destP[1];
    var yincr = 0, xincr = 0;

    if (destY != testY && destX != testX){
        var slope = (destY - testY) / (destX - testX);
        yincr = Math.sqrt((Math.pow(slope,2)) / (Math.pow(slope,2) + 1));
        xincr = (1 / slope) * yincr;
    }

    // Apply distance formula
    var dist = Math.sqrt(Math.pow((destX - testX), 2) + Math.pow((destY - testY), 2));

    var numIter = Math.floor(dist);

    var newX = testX, newY = testY;

    //document.write(numIter);

    /* Go in increments of 1 unit towards the destination point,
     checking each subsequent point for collision with an
     obstacle.*/
    for (var i = 0; i < numIter; i++){
        //document.write('i: ', i);

        // Check if dest and start are the same. If so, break
        if (destY == testY && destX == testX){
            //document.write('in equals')
            break;
        }

        // Check different configurations of the start and end
        // points and increment accordingly
        if (destY > testY && destX > testX){
            newX = newX + xincr;
            newY = newY + yincr;
        }

        else if (destY > testY && destX < testX){
            newX = newX - xincr;
            newY = newY + yincr;
        }

        else if (destY < testY && destX < testX){
            newX = newX - xincr;
            newY = newY - yincr;
        }

        else if (destY < testY && destX > testX){
            newX = newX + xincr;
            newY = newY - yincr;
        }

        else if (destY == testY && destX > testX){
            newX = newX + 1;
            newY = newY;
        }

        else if (destY == testY && destX < testX){
            newX = newX - 1;
            newY = newY;
        }

        else if (destX == testX && destY > testY){
            newX = newX;
            newY = newY + 1;
        }

        else if (destX == testX && destY < testY){
            newX = newX;
            newY = newY - 1;
        }

        //document.write('newX: ', newX, ' newY: ', newY, 'i: ', i);

        // Check for collision of new point with obstacle
        var newPoint = [];
        newPoint.push(newX);
        newPoint.push(newY);
        if (clear(obstacles, newPoint) == false){
            return false;
        }

    }

    return true;
}

function clear(obstacles, testP){

    // Determine number of obstacles
    var numObstacles = obstacles.length / 3;
    //document.write(numObs);

    var nextIndex = 0;	// Index of obstacle list

    // Get the starting point coordinates
    var testX = testP[0];
    var testY = testP[1];

    // Loop through all obstacles
    for (var i = 0; i < numObstacles; i++){
        // Extract each obstacle's X/Y coordinates and radius
        var obsX = obstacles[nextIndex++];
        var obsY = obstacles[nextIndex++];
        var obsR = obstacles[nextIndex++];

        // Apply distance formula
        var dist = Math.sqrt(Math.pow(obsX - testX, 2) + Math.pow((obsY - testY), 2));

        if (dist <= obsR){
            return false;
        }
    }

    return true;
}