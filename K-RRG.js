/**
 * Created by nav on 4/18/16.
 */

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
            if(link(obstacles,nearestVertex, newVertex)) {
                edges.push(new Edge(nearestVertex, newVertex,dist,newVertex.getId() + nearestVertex.getId()));
            }
            for(var j=0;j<nearSet.length;j++) {
                var nearVertex = nearSet[j];
                if(link(obstacles,nearVertex,newVertex)) {
                    var dist2 = Math.sqrt(Math.pow((newVertex.getX() - nearVertex.getX()), 2) + Math.pow((newVertex.getY() - nearVertex.getY()), 2));
                    if(link(obstacles,nearVertex, newVertex)){
                        edges.push(new Edge(nearVertex, newVertex,dist2,newVertex.getId() + nearVertex.getId()));
                    }
                }
            }

        }
    }

    return kRRG_graph;
}
