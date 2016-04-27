
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

function AdjList() {
    this.adjList = [];
}
AdjList.prototype = {
    constructor: AdjList,
    push: function(edge) {
        var source = edge.getSource();
        this.adjList[source.getId()][edge.getId()] = edge;

    },
    exists: function(edge) {
        var source = edge.getSource();
        return this.adjList[source.getId()][edge.getId()] !==undefined;
    },
    forEach: function(run) {
        for(var list in this.adjList) {
            if(this.adjList.hasOwnProperty(list)) {
                for(var idx in this.adjList[list]) {
                    if(this.adjList[list].hasOwnProperty(idx)) {
                        var edge = this.adjList[list][idx];
                        run(edge, list+"-"+idx);
                    }
                }
            }
        }
    },
    at: function(sourceIdx, adjNodeIdx) {
        var i=0;
        for(var list in this.adjList) {
            if(sourceIdx!==i) {
                i++;
                continue;
            }
            if(this.adjList.hasOwnProperty(list)) {
                var j=0;
                for(var idx in this.adjList[list]) {
                    if(adjNodeIdx!==j) {
                        j++;
                        continue;
                    }
                    if(this.adjList[list].hasOwnProperty(idx)) {
                        var edge = this.adjList[list][idx];
                        return edge;
                    }
                    j++;
                }
            }
            i++;
        }
    },
    atList: function(sourceIdx) {
        var i=0;
        for(var list in this.adjList) {
            if(sourceIdx!==i) {
                i++;
            }
            else return this.adjList[list];
        }
    }
};

function distance(one, two) {
    return Math.pow(Math.pow(one.xcor - two.xcor, 2) + Math.pow(one.ycor - two.ycor, 2), 0.5)
}

function calcShortestPath(start, goal, graph) {  // vertex, vertex, graph
    var adj = graph.getAdjList();
    var nodes = graph.getVertices();
    var snode = null;
    var smin = 1E8;
    var gnode = null;
    var gmin = 1E8;
    for (var i = 0; i < nodes.length; i++) {
        var sdist = distance(start, nodes[i]);
        if (sdist < smin) {
            smin = sdist;
            snode = i
        }
        var gdist = distance(goal, nodes[i]);
        if (gdist < gmin) {
            gmin = gdist;
            gnode = i
        }
    }
    var shortest = [];
    var previous = [];
    var q = [];
    for (var i = 0; i < nodes.length; i++) {
        shortest.push(1E11);
        previous.push(-1);
        q.push(i)
    }
    shortest[snode] = 0;
    while (q.length > 0) {
        var u = -1;
        var ui =
            -1;
        var min = 1E11;
        for (var j = 0; j < q.length; j++) {
            var cand = q[j];
            if (shortest[cand] < min) {
                min = shortest[cand];
                ui = j;
                u = cand
            }
        }
        if (shortest[u] == 1E11 || u == -1)break;
        q.remove(ui);
        for (var i = 0; i < adj[u].length; i++) {
            var adjacentNode = adj.at(u,i);
            var alt = shortest[u] + distance(nodes[u], nodes[adjacentNode]);
            if (alt < shortest[adjacentNode]) {
                shortest[adjacentNode] = alt;
                previous[adjacentNode] = u
            }
        }
    }
    var path = [];
    var curr = gnode;
    while (true) {
        path.push(nodes[curr]);
        curr = previous[curr];
        if (curr == snode || curr == null)break
    }
    path.push(nodes[snode]);
    return path
}

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

function connectGoal(graph, obstacles, goal) {
    var nearestNode = Nearest(graph, goal);
    if(link(obstacles, goal, nearestNode)) {
        graph.setNode(goal.getId(),goal);
        var dist = Math.sqrt(Math.pow((goal.getX() - nearestNode.getX()), 2) + Math.pow((goal.getY() - nearestNode.getY()), 2));
        graph.setEdge(nearestNode.getId(),goal.getId(), dist);
    }
}