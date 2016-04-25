
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
        if (dist != 0 && dist <= aRadius){
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

// function link(obstacles, end1, end2){
//
//     for(var i=0;i<obstacles.length/3; i=i+3) {
//         var obstacle_x = obstacles[i];
//         var obstacle_y = obstacles[i+1];
//         var obstacle_r = obstacles[i+2];
//         var centerToLine = Math.abs((end2.ycor-end1.ycor)*obstacle_x-(end2.xcor-end1.xcor)*obstacle_y+end2.xcor*end1.ycor-end2.ycor*end1.xcor)/Math.hypot(end2.ycor-end1.ycor,end2.xcor-end1.xcor);
//         if(centerToLine<=obstacle_r)
//
//             return false;
//     }
//
//
//     return true;
// }

function link(obstacles, testVertex, destVertex){

    // Check if start point is in collision
    if (clear(obstacles, testVertex) == false ||
    clear(obstacles, destVertex) == false){
        return false;
    }

    var testX = testVertex.getX();
    var testY = testVertex.getY();
    var destX = destVertex.getX();
    var destY = destVertex.getY();
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
        var tmpVertex = new Vertex(newX, newY, String(newX) + String(newY));

        if (clear(obstacles, tmpVertex) == false){
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
    // inputs base and goal are vertices as defined by Vertex object
    var eta = 50; // change this if necessary !!!!
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