
/*
 Random int generator function adapted from Mozilla Developer Network page:
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
    var allVertices = aGraph.nodes();

    for (var i = 0; i < allVertices.length; i++){
        var eachVertex = aGraph.node(allVertices[i]);

        // Apply distance formula
        var dist = Math.sqrt(Math.pow((eachVertex.getX() - aVertex.getX()), 2) + Math.pow((eachVertex.getY() - aVertex.getY()), 2));

        //document.write('after dist: ' + dist);
        if (dist != 0 && dist <= aRadius){
            vertInRadius.push(aGraph.node(allVertices[i]));
        }
    }

    return vertInRadius;
}
function kNearest(aGraph, aVertex, k){
    if(k>aGraph.nodeCount) k=aGraph.nodeCount();
    var allVertices = aGraph.nodes();
    var kDistances = [];
    for(var z=0;z<k;z++) kDistances[z] =9999;
    var kVertices = [];

    for (var i = 0; i < allVertices.length; i++) {

        var eachVertex = aGraph.node(allVertices[i]);

        // Apply distance formula
        var dist = Math.sqrt(Math.pow((eachVertex.getX() - aVertex.getX()), 2) + Math.pow((eachVertex.getY() - aVertex.getY()), 2));

        for(var j=0; j<k; j++) {
            if(kDistances[j]>dist) {
                kDistances.splice(j,0,dist);
                kVertices.splice(j,0,eachVertex);
                break;
            }
        }
    }

    console.log(kVertices.slice(0,k));
    return kVertices.slice(0,k);
}

function Nearest(aGraph, aPoint){
    var allVertices = aGraph.nodes();
    var nearestVertex = null;
    var minDist = Infinity;

    for (var i = 0; i < allVertices.length; i++) {

        var eachVertex = aGraph.node(allVertices[i]);

        // Apply distance formula
        var dist = Math.sqrt(Math.pow((eachVertex.getX() - aPoint.getX()), 2) + Math.pow((eachVertex.getY() - aPoint.getY()), 2));

        if (dist < minDist){
            minDist = dist;
            nearestVertex = eachVertex;
        }
    }
    return nearestVertex;
}

function link(obstacles, end1, end2){

    var nextIndex = 0;
    var numObstacles = obstacles.length / 3;

    for(var i=0;i<numObstacles; i++) {
        var obstacle_x = obstacles[nextIndex++];
        var obstacle_y = obstacles[nextIndex++];
        var obstacle_r = obstacles[nextIndex++];
        var dist = distanceToLineSegment(end1.getX(), end1.getY(), end2.getX(), end2.getY(), obstacle_x, obstacle_y);
        if(dist <=obstacle_r){
            return false;
        }

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
function steer(base, goal) {
    console.log('found tau: '+tau);
    // inputs base and goal are vertices as defined by Vertex object
    var eta = tau; // change this if necessary !!!!
    var dist = Math.sqrt(Math.pow(goal.xcor-base.xcor, 2) + Math.pow((goal.ycor-base.ycor), 2));
    if(dist<=eta)
        return new Vertex(goal.xcor,goal.ycor,goal.xcor.toString()+goal.ycor.toString()); //{xcor: goal.xcor, ycor:goal.ycor};
    else {
        var angle = Math.atan2(goal.ycor - base.ycor, goal.xcor - base.xcor);
        var x = Math.round(base.xcor+ eta * Math.cos(angle));
        var y = Math.round(base.ycor + eta * Math.sin(angle));

        return  new Vertex(x,y,x.toString()+y.toString());//{xcor:x,ycor:y};
    }
}

function connectGoal(graph, obstacles, goal) {
    var nearestNode = Nearest(graph, goal);
    if(link(obstacles, goal, nearestNode)) {
        graph.setNode(goal.getId(),goal);
        var dist = Math.sqrt(Math.pow((goal.getX() - nearestNode.getX()), 2) + Math.pow((goal.getY() - nearestNode.getY()), 2));
        graph.setEdge(nearestNode.getId(),goal.getId(), dist);
    }
}