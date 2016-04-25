/**
 * Created by nav on 4/17/16.
 */



function prm (obstacles, testP, destP, nMilestone, mNeighbor,
              xleft, xright, ybottom, ytop) {
    // document.write('inprm');
    var vertices = [];
    var edges = [];
    var prmStarGraph = new Graph(vertices, edges);

    var xRange = xright - xleft;
    var yRange = ytop - ybottom;

    var testVertex = new Vertex(testP[0], testP[1], String(testP[0]) + String(testP[1]));
    vertices.push(testVertex);
    // document.write(xRange);
    // Create milestones at random locations and add to
    // list of milestones
    for (var i = 0; i < nMilestone; i++) {

        var randVertex = SampleFree(xRange, yRange, obstacles);
        //var randVertex = new Vertex(1, 1, 'vertexID');
        vertices.push(randVertex);
        //document.write(randVertex.hashCode() + ' ');
        //document.write(vertices[i]);

    }

    // r(n) = (log(n) / n)^(1/d), n is number of milestones, d is dimension of space
    var dim = 2;
    //var connRadius = Math.pow((Math.log(nMilestone) / nMilestone), (1/dim));
    var lebesgueVolume = xRange * yRange;
    var unitCircleVolume = Math.PI;
    //var connRadius = (2 * Math.pow((1+(1/dim)), (1/dim))) * Math.pow((lebesgueVolume/unitCircleVolume),(1/dim));

    var connRadius = 90;
    //document.write('connRadius: ' + connRadius);

    for (var i = 0; i < vertices.length; i++){
        var eachVertex = vertices[i];
        var nearVertices = Near(prmStarGraph, eachVertex, connRadius);
        //document.write('after near');

        for (var j = 0; j < nearVertices.length; j++){
            var theNearVertex = nearVertices[j];

            // Distance formula
            var dist = Math.sqrt(Math.pow((eachVertex.getX() - theNearVertex.getX()), 2)
                + Math.pow((eachVertex.getY() - theNearVertex.getY()), 2));

            if (link(obstacles, eachVertex, theNearVertex)){
                var sToDestId = eachVertex.getId() + theNearVertex.getId();
                var destToSId = theNearVertex.getId() + eachVertex.getId();

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
                    edges.push(new Edge(eachVertex, theNearVertex, dist, eachVertex.getId() + theNearVertex.getId()));
                }

                if (destToSExists == false && dist != 0) {
                    edges.push(new Edge(theNearVertex, eachVertex, dist, theNearVertex.getId() + eachVertex.getId()));
                }
            }
        }
    }

    //document.write('end');
    return prmStarGraph;
    
}



