/**
 * Created by nav on 4/18/16.
 */

function k_RRG(obstacles, nMilestone, x_init, xleft, xright, ybottom, ytop) {
    var graph = new graphlib.Graph();
    graph.setNode(x_init.getId(), x_init);


    var xRange = xright - xleft;
    var yRange = ytop - ybottom;

    for (var i = 0; i < nMilestone; i++) {
        var randVertex = SampleFree(xRange, yRange, obstacles);
        var nearestVertex = Nearest(graph, randVertex);
        var newVertex = steer(nearestVertex, randVertex);
        if (link(obstacles, nearestVertex, newVertex)) {
            var nearSet = Near(graph, newVertex, 2 * Math.E * (Math.log(graph.nodeCount()) / Math.log(2)));
            graph.setNode(newVertex.getId(), newVertex);

            var dist = Math.sqrt(Math.pow((newVertex.getX() - nearestVertex.getX()), 2) + Math.pow((newVertex.getY() - nearestVertex.getY()), 2));

            graph.setEdge(newVertex.getId(), nearestVertex.getId(), dist);
            graph.setEdge(nearestVertex.getId(), newVertex.getId(), dist);

            for (var j = 0; j < nearSet.length; j++) {
                var nearVertex = nearSet[j];
                if (link(obstacles, nearVertex, newVertex)) {
                    var dist2 = Math.sqrt(Math.pow((newVertex.getX() - nearVertex.getX()), 2) + Math.pow((newVertex.getY() - nearVertex.getY()), 2));

                    graph.setEdge(nearVertex.getId(), newVertex.getId(), dist2);
                    graph.setEdge(newVertex.getId(), nearVertex.getId(), dist2);
                }
            }

        }
    }

    return graph;
}
