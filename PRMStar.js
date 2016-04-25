/**
 * Created by nav on 4/17/16.
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
    Probabilistic Roadmap (optimized)
 */

function SampleFree(xRange, yRange, obstacles){
    var xcor, ycor;

    do {
        xcor = getRandomInt(0, xRange);
        ycor = getRandomInt(0, yRange);

        var tmpVert = new Vertex(xcor, ycor, String(xcor) + String(ycor));

    } while (clear(obstacles, tmpVert) != true);

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

function prm (obstacles, testP, destP, nMilestone, mNeighbor,
              xleft, xright, ybottom, ytop) {
    // document.write('inprm');
    var vertices = [];
    var edges = [];
    var prmStarGraph = new Graph(vertices, edges);

    var xRange = xright - xleft;
    var yRange = ytop - ybottom;

    var testVertex = new Vertex(testP[0], testP[1], String(testP[0]) + String(testP[1]));
    vertices.push(testVertex);
    // document.write(xRange);
    // Create milestones at random locations and add to
    // list of milestones
    for (var i = 0; i < nMilestone; i++) {

        var randVertex = SampleFree(xRange, yRange, obstacles);
        //var randVertex = new Vertex(1, 1, 'vertexID');
        vertices.push(randVertex);
        //document.write(randVertex.hashCode() + ' ');
        //document.write(vertices[i]);

    }

    // r(n) = (log(n) / n)^(1/d), n is number of milestones, d is dimension of space
    var dim = 2;
    //var connRadius = Math.pow((Math.log(nMilestone) / nMilestone), (1/dim));
    var lebesgueVolume = xRange * yRange;
    var unitCircleVolume = Math.PI;
    //var connRadius = (2 * Math.pow((1+(1/dim)), (1/dim))) * Math.pow((lebesgueVolume/unitCircleVolume),(1/dim));

    var connRadius = 90;
    //document.write('connRadius: ' + connRadius);

    for (var i = 0; i < vertices.length; i++){
        var eachVertex = vertices[i];
        var nearVertices = Near(prmStarGraph, eachVertex, connRadius);
        //document.write('after near');

        for (var j = 0; j < nearVertices.length; j++){
            var theNearVertex = nearVertices[j];

            // Distance formula
            var dist = Math.sqrt(Math.pow((eachVertex.getX() - theNearVertex.getX()), 2)
                + Math.pow((eachVertex.getY() - theNearVertex.getY()), 2));

            if (link(obstacles, eachVertex, theNearVertex)){
                var sToDestId = eachVertex.getId() + theNearVertex.getId();
                var destToSId = theNearVertex.getId() + eachVertex.getId();

                var sToDestExists = false;
                var destToSExists = false;
                for (var k = 0; k < edges.length; k++){
                    //document.write(String(edges[k].getId() === sToDestId) + '\n');
                    if (edges[k].getId() === sToDestId){
                        sToDestExists = true;
                    }

                    if (edges[k].getId() === destToSId){
                        destToSExists = true;
                    }
                }

                if (sToDestExists == false && dist != 0) {
                    edges.push(new Edge(eachVertex, theNearVertex, dist, eachVertex.getId() + theNearVertex.getId()));
                }

                if (destToSExists == false && dist != 0) {
                    edges.push(new Edge(theNearVertex, eachVertex, dist, theNearVertex.getId() + eachVertex.getId()));
                }
            }
        }
    }

    //document.write('end');
    return prmStarGraph;



    //document.write(vertices);
}

/*
 Random int generator function adapted from Mozilla Developer Network page:
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
    Link and Clear
 */

function link(obstacles, end1, end2){

    for(var i=0;i<obstacles.length/3; i=i+3) {
        var obstacle_x = obstacles[i];
        var obstacle_y = obstacles[i+1];
        var obstacle_r = obstacles[i+2];
        var centerToLine = Math.abs((end2.ycor-end1.ycor)*obstacle_x-(end2.xcor-end1.xcor)*obstacle_y+end2.xcor*end1.ycor-end2.ycor*end1.xcor)/Math.hypot(end2.ycor-end1.ycor,end2.xcor-end1.xcor);
        if(centerToLine<=obstacle_r)

            return false;
    }


    return true;
}

function clear(obstacles, testVertex){

    // Determine number of obstacles
    var numObstacles = obstacles.length / 3;
    //document.write(numObs);

    var nextIndex = 0;	// Index of obstacle list

    // Get the starting point coordinates
    var testX = testVertex.getX();
    var testY = testVertex.getY();

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

