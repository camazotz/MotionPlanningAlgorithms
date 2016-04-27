/**
 * Created by nav on 4/24/16.
 */

/*
 JavaScript implementation of Java String hashcode borrowed from an online
 source: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */


function Parent(aGraph, aVertex){

    aGraph.edges().forEach(function(edge, idx, array) {
        if (aGraph.node(edge.w).getId() === aVertex.getId()){
            return aGraph.node(edge.v);
        }
    });
}

function rrtStar(obstacles, x_init, nMilestone, xleft, xright, ybottom, ytop){

    var rrtStarGraph = new graphlib.Graph();
    function weight(e) { return rrtStarGraph.edge(e); }

    var xRange = xright - xleft;
    var yRange = ytop - ybottom;

    rrtStarGraph.setNode(x_init.getId(),x_init);
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
            rrtStarGraph.setNode(steerVertex.getId(),steerVertex);
            var xMin = nearestVertex;
            var dijkstra = graphlib.alg.dijkstra(rrtStarGraph, x_init.getId(), weight);
            var cMin = cost(dijkstra,nearestVertex) + dist;

            for (var j = 0; j < nearVertices.length; j++) {
                var xNear = nearVertices[j];
                if(!nearVertices.hasOwnProperty(xNear)) continue;
                if (link(nearestVertex, steerVertex) &&
                    (cost(dijkstra,xNear) + distanceCost(xNear, steerVertex) < cMin)) {
                    xMin = xNear;
                    cMin = cost(dijkstra,xNear) + distanceCost(xNear, steerVertex);
                }
            }


            rrtStarGraph.setEdge(xMin.getId(), steerVertex.getId(), dist);


            // for loop
            console.log(nearVertices);
            for (j = 0; j < nearVertices.length; j++) {
                var xNear2 = nearVertices[j];
                console.log(xNear2);
                dijkstra = graphlib.alg.dijkstra(rrtStarGraph, x_init.getId(), weight);
                var xParent = "";
                if (link(nearestVertex, steerVertex) &&
                    (cost(dijkstra,xNear2) + distanceCost(xNear2, steerVertex) < cost(dijkstra,xNear2))) {
                    xParent = Parent(xNear2);
                }
                
                var edgeDist = distanceCost(steerVertex, xNear2);
                
                if (xParent == ""){
                    rrtStarGraph.setEdge(steerVertex.getId(), xNear2.getId(), edgeDist);
                }
                else{
                    rrtStarGraph.removeEdge(xParent,xNear2);
                    rrtStarGraph.setEdge(steerVertex.getId(), xNear2.getId(), edgeDist);
                    
                }
            }
        }
    }

    return rrtStarGraph;
}

function distanceCost(vertexOne, vertexTwo){
    // Distance formula
    return  Math.sqrt(Math.pow((vertexOne.getX() - vertexTwo.getX()), 2) + Math.pow((vertexOne.getY() - vertexTwo.getY()), 2));

}

function cost(dijkstra, aVertex){
    return dijkstra[aVertex.getId()].distance;
}