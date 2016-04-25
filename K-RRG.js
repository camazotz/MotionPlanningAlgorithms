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
        console.log(newVertex);
        if(link(obstacles,nearestVertex,newVertex)) {
            var nearSet = Near(kRRG_graph,newVertex, 2*Math.E*(Math.log(vertices.length)/Math.log(2)));
            vertices.push(newVertex);

            var dist = Math.sqrt(Math.pow((newVertex.getX() - nearestVertex.getX()), 2) + Math.pow((newVertex.getY() - nearestVertex.getY()), 2));

            var sToDestId = newVertex.getId() + nearestVertex.getId();
            var destToSId = nearestVertex.getId() + newVertex.getId();

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
                edges.push(new Edge(newVertex, nearestVertex, dist, newVertex.getId() + nearestVertex.getId()));
            }

            if (destToSExists == false && dist != 0) {
                edges.push(new Edge(nearestVertex, newVertex, dist, nearestVertex.getId() + newVertex.getId()));
            }

            for(var j=0;j<nearSet.length;j++) {
                var nearVertex = nearSet[j];
                if(link(obstacles,nearVertex,newVertex)) {
                    var dist2 = Math.sqrt(Math.pow((newVertex.getX() - nearVertex.getX()), 2) + Math.pow((newVertex.getY() - nearVertex.getY()), 2));

                    var sToDestId2 = newVertex.getId() + nearVertex.getId();
                    var destToSId2 = nearVertex.getId() + newVertex.getId();

                    var sToDestExists2 = false;
                    var destToSExists2 = false;
                    for (var k2 = 0; k2 < edges.length; k2++){
                        //document.write(String(edges[k].getId() === sToDestId) + '\n');
                        if (edges[k2].getId() === sToDestId2){
                            sToDestExists = true;
                        }

                        if (edges[k2].getId() === destToSId2){
                            destToSExists = true;
                        }
                    }

                    if (sToDestExists2 == false && dist2 != 0) {
                        edges.push(new Edge(nearVertex, newVertex, dist2, newVertex.getId() + nearVertex.getId()));
                    }

                    if (destToSExists2 == false && dist2 != 0) {
                        edges.push(new Edge(newVertex, nearVertex, dist2, nearVertex.getId() + newVertex.getId()));
                    }

                }
            }

        }
    }

    return kRRG_graph;
}
