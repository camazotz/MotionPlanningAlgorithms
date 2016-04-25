
/*
 RRT
 */

function rrt(obstacles, testP, destP, nMilestone,
    xleft, xright, ybottom, ytop){
    var vertices = [];
    var edges = [];
    var rrtGraph = new Graph(vertices, edges);

    var xRange = xright - xleft;
    var yRange = ytop - ybottom;
console.log('xRange:' + xRange);
    var testVertex = new Vertex(testP[0], testP[1], String(testP[0]) + String(testP[1]));
    vertices.push(testVertex);
    for (var i = 0; i < nMilestone; i++) {

        var randVertex = SampleFree(xRange, yRange, obstacles);
        var nearestVertex = Nearest(rrtGraph, randVertex);
        var steerVertex = steer(nearestVertex, randVertex);
        
        // Distance formula
        var dist = Math.sqrt(Math.pow((steerVertex.getX() - nearestVertex.getX()), 2)
            + Math.pow((steerVertex.getY() - nearestVertex.getY()), 2));

        if (link(obstacles, steerVertex, nearestVertex)){
            vertices.push(steerVertex);

            var sToDestId = steerVertex.getId() + nearestVertex.getId();
            var destToSId = nearestVertex.getId() + steerVertex.getId();

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

            // if (sToDestExists == false && dist != 0) {
            //     edges.push(new Edge(steerVertex, nearestVertex, dist, steerVertex.getId() + nearestVertex.getId()));
            // }

            if (destToSExists == false && dist != 0) {
                edges.push(new Edge(nearestVertex, steerVertex, dist, nearestVertex.getId() + steerVertex.getId()));
            }
        }
    }

    return rrtGraph;
}
