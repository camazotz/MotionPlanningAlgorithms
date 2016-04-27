
/*
 RRT
 */

function rrt(obstacles, x_init, nMilestone,xleft, xright, ybottom, ytop){

    var rrtGraph = new graphlib.Graph();

    var xRange = xright - xleft;
    var yRange = ytop - ybottom;

    rrtGraph.setNode(x_init.getId(),x_init);
    for (var i = 0; i < nMilestone; i++) {

        var randVertex = SampleFree(xRange, yRange, obstacles);
        var nearestVertex = Nearest(rrtGraph, randVertex);
        var steerVertex = steer(nearestVertex, randVertex);
        
        // Distance formula
        var dist = Math.sqrt(Math.pow((steerVertex.getX() - nearestVertex.getX()), 2)
            + Math.pow((steerVertex.getY() - nearestVertex.getY()), 2));

        if (link(obstacles, steerVertex, nearestVertex)){
            rrtGraph.setNode(steerVertex.getId(),steerVertex);
            
            rrtGraph.setEdge(nearestVertex.getId(), steerVertex.getId(), dist);

        }
    }

    return rrtGraph;
}
