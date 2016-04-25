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
 Random int generator function adapted from Mozilla Developer Network page:
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
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

function k_RRG(obstacles,nMilestone, x_init, xleft, xright, ybottom, ytop){
    var vertices = [];
    var edges = [];
    var kRRG_graph = new Graph(vertices, edges);
    vertices.push(x_init);


    var xRange = xright - xleft;
    var yRange = ytop - ybottom;

    for (var i = 0; i < nMilestone; i++) {
        var randVertex = SampleFree(xRange, yRange, obstacles);
        var nearestVertex = Nearest(kRRG_graph, randVertex);
        var newVertex = steer(nearestVertex, randVertex);
        if(link(obstacles,nearestVertex,newVertex)) {
            var nearSet = Near(kRRG_graph,newVertex, 2*Math.E*(Math.log(vertices.length)/Math.log(2)));
            vertices.push(newVertex);
            var dist = Math.sqrt(Math.pow((newVertex.getX() - nearestVertex.getX()), 2) + Math.pow((newVertex.getY() - nearestVertex.getY()), 2));
            edges.push(new Edge(nearestVertex, newVertex,dist,newVertex.getId() + nearestVertex.getId()));
            for(var j=0;i<nearSet.length;i++) {
                var nearVertex = nearSet[j];
                if(link(obstacles,nearVertex,newVertex)) {
                    var dist2 = Math.sqrt(Math.pow((newVertex.getX() - nearVertex.getX()), 2) + Math.pow((newVertex.getY() - nearVertex.getY()), 2));
                    edges.push(new Edge(nearVertex, newVertex,dist2,newVertex.getId() + nearVertex.getId()));
                }
            }

        }
    }

    return kRRG_graph;
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

// function clear(obstacles, test){
//
//     for(var i=0;i<obstacles.length/3; i=i+3) {
//         var obstacle_x = obstacles[i];
//         var obstacle_y = obstacles[i + 1];
//         var obstacle_r = obstacles[i + 2];
//         if(Math.hypot(test[0]-obstacle_x,test[1]-obstacle_y)<=obstacle_r)
//             return false;
//     }
//
//     return true;
// }
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


function steer(base, goal) {
    // inputs base and goal are vertices as defined by Vertex object
    var eta = 50; // change this if necessary !!!!
    var dist = Math.sqrt(Math.pow(goal.xcor-base.xcor, 2) + Math.pow((goal.ycor-base.ycor), 2));
    if(dist<=eta)
        return new Vertex(goal.xcor,goal.ycor,goal.xcor.toString()+goal.ycor.toString()); //{xcor: goal.xcor, ycor:goal.ycor};
    else {
        var angle = Math.atan2(goal.ycor - base.ycor, goal.xcor - base.xcor);
        var x = base.xcor+ eta * Math.cos(angle);
        var y = base.ycor + eta * Math.sin(angle);
        return  new Vertex(x,y,x.toString()+y.toString());//{xcor:x,ycor:y};
    }
}