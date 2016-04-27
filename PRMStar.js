/**
 * Created by nav on 4/17/16.
 */



function prm_star (obstacles, x_init, nMilestone, xleft, xright, ybottom, ytop) {

    var prmStarGraph = new graphlib.Graph();

    var xRange = xright - xleft;
    var yRange = ytop - ybottom;

    prmStarGraph.setNode(x_init.getId(),x_init);

    // Create milestones at random locations and add to
    // list of milestones
    for (var i = 0; i < nMilestone; i++) {

        var randVertex = SampleFree(xRange, yRange, obstacles);
        prmStarGraph.setNode(randVertex.getId(),randVertex);
    }

    // r(n) = (log(n) / n)^(1/d), n is number of milestones, d is dimension of space
    var dim = 2;
    //var connRadius = Math.pow((Math.log(nMilestone) / nMilestone), (1/dim));
    var lebesgueVolume = xRange * yRange;
    var unitCircleVolume = Math.PI;
    //var connRadius = (2 * Math.pow((1+(1/dim)), (1/dim))) * Math.pow((lebesgueVolume/unitCircleVolume),(1/dim));

    var connRadius = 90;

    for (i = 0; i < prmStarGraph.nodeCount(); i++){
        var eachVertex = prmStarGraph.node(prmStarGraph.nodes()[i]);
        var nearVertices = Near(prmStarGraph, eachVertex, connRadius);

        for (var j = 0; j < nearVertices.length; j++){
            var theNearVertex = nearVertices[j];

            // Distance formula
            var dist = Math.sqrt(Math.pow((eachVertex.getX() - theNearVertex.getX()), 2)
                + Math.pow((eachVertex.getY() - theNearVertex.getY()), 2));

            if (link(obstacles, eachVertex, theNearVertex)){
                prmStarGraph.setEdge(eachVertex.getId(), theNearVertex.getId(), dist);
                prmStarGraph.setEdge(theNearVertex.getId(), eachVertex.getId(), dist);
            }
        }
    }

    //document.write('end');
    return prmStarGraph;
    
}



