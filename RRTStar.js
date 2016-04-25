/**
 * Created by nav on 4/24/16.
 */

/*
 JavaScript implementation of Java String hashcode borrowed from an online
 source: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */


function Parent(aGraph, aVertex){
    var graphEdges = aGraph.getEdges();

    for (var i in graphEdges){
        if (graphEdges[i].getDestination().getId() == aVertex.getId()){
            return graphEdges[i].getSource();
        }
    }
}

function rrtStar(obstacles, testP, destP, nMilestone,
                 xleft, xright, ybottom, ytop){
    var vertices = [];
    var edges = [];
    var rrtStarGraph = new Graph(vertices, edges);

    var xRange = xright - xleft;
    var yRange = ytop - ybottom;

    var testVertex = new Vertex(testP[0], testP[1], String(testP[0]) + String(testP[1]));
    vertices.push(testVertex);
    for (var i = 0; i < nMilestone; i++) {

        var randVertex = SampleFree(xRange, yRange, obstacles);
        var nearestVertex = Nearest(rrtStarGraph, randVertex);
        var steerVertex = steer(nearestVertex, randVertex);

        // Distance formula
        var dist = Math.sqrt(Math.pow((steerVertex.getX() - nearestVertex.getX()), 2)
            + Math.pow((steerVertex.getY() - nearestVertex.getY()), 2));

        if (link(obstacles, steerVertex, nearestVertex)) {

            var connRadius = 20;    // placeholder
            var nearVertices = Near(rrtStarGraph, steerVertex, connRadius);
            vertices.push(steerVertex);
            var xMin = nearestVertex;

            var cMin = Cost(nearestVertex) + dist;

            for (var xNear in nearVertices){
                if (link(nearestVertex, steerVertex) &&
                    (Cost(xNear) + distanceCost(xNear, steerVertex) < cMin)) {
                    xMin = xNear;
                    cMin = Cost(xNear) + distanceCost(xNear, steerVertex);
                }
            }

            // Add Edge

            var sToDestId = xMin.getId() + steerVertex.getId();

            var sToDestExists = false;
            for (var k = 0; k < edges.length; k++){
                //document.write(String(edges[k].getId() === sToDestId) + '\n');
                if (edges[k].getId() === sToDestId){
                    sToDestExists = true;
                }
            }

            if (sToDestExists == false && dist != 0) {
                edges.push(new Edge(xMin, steerVertex, dist, xMin.getId() + steerVertex.getId()));
            }

            // for loop

            for (var xNear2 in nearVertices){
                var xParent = ""
                if (link(nearestVertex, steerVertex) &&
                    (Cost(xNear2) + distanceCost(xNear2, steerVertex) < Cost(xNear2))) {
                    xParent = Parent(xNear2);
                }
                
                var edgeDist = distanceCost(steerVertex, xNear2);
                
                if (xParent == ""){
                    edges.push(new Edge(steerVertex, xNear2, edgeDist, steerVertex.getId() + xNear2.getId()));
                }

                else{
                    var parentNearId = xParent.getId() + xNear2.getId();
                    for (var edgeInd = 0; edgeInd < edges.length; edgeInd++){
                        if (edges[edgeInd].getId() == parentNearId){
                            edges.splice(edgeInd, 1,
                            new Edge(steerVertex, xNear2, edgeDist, steerVertex.getId() + xNear2.getId()));
                        }
                    }
                }
            }

        }
    }

    return rrtStarGraph;
}

function distanceCost(vertexOne, vertexTwo){
    // Distance formula
    var dist = Math.sqrt(Math.pow((vertexOne.getX() - vertexTwo.getX()), 2)
        + Math.pow((vertexOne.getY() - vertexTwo.getY()), 2));
    return dist;

}

function Cost(aVertex){

}