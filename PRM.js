Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest)
};
Array.prototype.contains = function (element) {
    for (var i = 0; i < this.length; i++)if (this[i] == element)return true
};
function angle(a, b) {
    var x = b[1] - a[1];
    var y = b[0] - a[0];
    if (x == 0)Math.PI / 2;
    return Math.atan(y / x)
}
function isLeftTurn(a, b, c) {
    var product = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    return product <= 0
}
function triangleContainsPoint(a, b, c, p) {
    function crossProduct(p, q) {
        return p[0] * q[1] - p[1] * q[0]
    }

    function dotProduct(p, q) {
        return p * q
    }

    function minus(p, q) {
        return [p[0] - q[0], p[1] - q[1]]
    }

    function sameSide(p1, p2, a, b) {
        cp1 = crossProduct(minus(b, a), minus(p1, a));
        cp2 = crossProduct(minus(b, a), minus(p2, a));
        return dotProduct(cp1, cp2) >= 0
    }

    return sameSide(p, a, b, c) && sameSide(p, b, a, c) && sameSide(p, c, a, b)
}
function distance(one, two) {
    return Math.pow(Math.pow(one[0] - two[0], 2) + Math.pow(one[1] - two[1], 2), 0.5)
}
function triangulate(points, raph) {
    var bottom = 0;
    for (var i = 0; i < points.length; i++)if (points[i][1] > points[bottom][1])bottom = i;
    dir = 1;
    var bp = points[bottom];
    var bpr = points[(bottom + 1) % points.length];
    var bpl = points[(bottom - 1 + points.length) % points.length];
    if (angle(bp, bpr) > angle(bp, bpl))dir = -1;
    var triangles = [];
    while (points.length > 3) {
        var before = points.length;
        for (var i = 0; i < points.length; i++) {
            var j = (i + 1 * dir + points.length) % points.length;
            var k = (i + 2 * dir + points.length) % points.length;
            var a = points[i];
            var b = points[j];
            var c = points[k];
            var ear = isLeftTurn(a, b, c);
            for (var l = 0; l < points.length; l++)if (l != i && l != j && l != k)if (triangleContainsPoint(a, b, c, points[l]))ear = false;
            var t = "ear";
            if (!ear)t = "no";
            if (ear) {
                triangles.push([[a[0], a[1]], [b[0], b[1]], [c[0], c[1]]]);
                points.remove(j)
            }
        }
        if (before == points.length && before != 3) {
            console.log("wtf");
            break
        }
        before = points.length
    }
    if (points.length == 3)triangles.push(points);
    return triangles
}
function segmentsIntersect(p, q, a, b) {
    function crossProduct(p, q) {
        return p[0] * q[1] - p[1] * q[0]
    }

    function dotProduct(p, q) {
        return p * q
    }

    function minus(p, q) {
        return [p[0] - q[0], p[1] - q[1]]
    }

    function sameSide(p1, p2, a, b) {
        cp1 = crossProduct(minus(b, a), minus(p1, a));
        cp2 = crossProduct(minus(b, a), minus(p2, a));
        return dotProduct(cp1, cp2) >= 0
    }

    return !sameSide(p, q, a, b) && !sameSide(a, b, p, q)
}
function link(p, q, a, b, c) {
    return !segmentsIntersect(p, q, a, b) && !segmentsIntersect(p, q, b, c) && !segmentsIntersect(p, q, c, a)
}
function drawPathFromPoints(points, raph) {
    var p = "M" + points[0][0] + "," + points[0][1];
    for (var i = 1; i < points.length; i++)p += "L" + points[i][0] + "," + points[i][1];
    p += "L" + points[0][0] + "," + points[0][1];
    return raph.path(p)
}
function beginDraw(color, r, x, y) {
    var points = [];
    var dot;
    var segments = [];

    function addPoint(x, y) {
        if (points.length > 0 && x == points[points.length - 1][0] && y == points[points.length - 1][1])return 0;
        points.push([x, y]);
        if (points.length == 1)dot = r.circle(x, y, 3); else {
            var x0 = points[points.length - 2][0];
            var y0 = points[points.length - 2][1];
            var x1 = points[points.length - 1][0];
            var y1 = points[points.length - 1][1];
            var newpath = r.path("M" + x0 + "," + y0 + "L" + x1 + "," + y1);
            segments.push(newpath)
        }
        if (points.length >= 3 && distance(points[0], points[points.length -
            1]) < 10) {
            points[points.length - 1][0] = points[0][0];
            points[points.length - 1][1] = points[0][1];
            for (var i = 0; i < segments.length; i++)segments[i].remove();
            var pathstring = "M" + points[0][0] + "," + points[0][1];
            for (var i = 1; i < points.length; i++)pathstring += "L" + points[i][0] + "," + points[i][1];
            dot.remove();
            points.remove(-1);
            r.path(pathstring).attr("fill", color).toBack();
            return points
        }
        return 0
    }

    addPoint(x, y);
    return addPoint
}
function computeRoadmap(roadmap, obstacles) {
    var numNodes = parseInt($("#samples").val());
    var numNeighbors = parseInt($("#neighbors").val());
    var nodes = [];
    if (roadmap != null)nodes = roadmap["nodes"];
    var triangles = triangulateAll(obstacles);
    for (var i = 0; i < numNodes; i++)nodes.push(getNewRandomNode(triangles));
    var adjacencyList = [];
    if (roadmap != null)adjacencyList = roadmap["adjacencyList"];
    for (var i = nodes.length - numNodes; i < nodes.length; i++) {
        console.log(i);
        var l = [];
        for (var j = 0; j < nodes.length; j++)if (linkExists(nodes[i],
                nodes[j], triangles) && i != j)l.push(j);
        l.sort(function (l, r) {
            return distance(nodes[i], nodes[l]) - distance(nodes[i], nodes[r])
        });
        while (l.length > numNeighbors)l.remove(l.length - 1);
        adjacencyList.push(l)
    }
    console.log(nodes);
    for (var i = 0; i < nodes.length; i++)for (var j = 0; j < nodes.length; j++) {
        var li = adjacencyList[i];
        var lj = adjacencyList[j];
        if (li.contains(j)) {
            if (!lj.contains(i))lj.push(i)
        } else if (lj.contains(i))if (!li.contains(j))li.push(j)
    }
    return {"nodes": nodes, "adjacencyList": adjacencyList}
}
function drawRoadmap(roadmap, r) {
    var drawn = [];
    var nodes = roadmap["nodes"];
    for (var i = 0; i < nodes.length; i++) {
        var p = nodes[i];
        drawn.push(r.circle(p[0], p[1], 2));
        var list = roadmap["adjacencyList"][i];
        for (var j = 0; j < list.length; j++) {
            var dest = nodes[list[j]];
            var pathString = "M" + p[0] + "," + p[1] + "L" + dest[0] + "," + dest[1];
            drawn.push(r.path(pathString))
        }
    }
    return drawn
}
function getNewRandomNode(triangles) {
    var maxAttempts = 5E3;
    var count = 0;
    while (true || count >= maxAttempts) {
        count += 1;
        var x = 2 + Math.random() * 496;
        var y = 2 + Math.random() * 496;
        var clear = true;
        for (var i = 0; i < triangles.length; i++) {
            var o = triangles[i];
            if (triangleContainsPoint(o[0], o[1], o[2], [x, y]))clear = false
        }
        if (clear)return [x, y]
    }
}
function triangulateAll(obstacles) {
    var triangles = [];
    for (var i = 0; i < obstacles.length; i++) {
        var ob = obstacles[i];
        var tris = triangulate(copyObstacles(ob));
        for (var j = 0; j < tris.length; j++)triangles.push(tris[j])
    }
    return triangles
}
function linkExists(p, q, triangles) {
    for (var i = 0; i < triangles.length; i++) {
        var t = triangles[i];
        if (!link(p, q, t[0], t[1], t[2]))return false
    }
    return true
}
function copyObstacles(arr) {
    var a = [];
    for (var i = 0; i < arr.length; i++)a.push([arr[i][0], arr[i][1]]);
    return a
}
function calcShortestPath(start, goal, roadmap) {
    var adj = roadmap["adjacencyList"];
    var nodes = roadmap["nodes"];
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
            var adjacentNode = adj[u][i];
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
function drawPath(goal, path, start, r) {
    var p = "M" + goal[0] + "," + goal[1] + "L" + path[0][0] + "," + path[0][1];
    for (var i = 0; i < path.length; i++)p += "L" + path[i][0] + "," + path[i][1];
    p += "L" + start[0] + "," + start[1];
    var path = r.path(p);
    path.attr("stroke", "#00f").attr("stroke-width", 3);
    return path
}
$(function () {
    var r = Raphael("draw", 500, 500);
    var raph = r;
    var drawingState = "none";
    var update;
    var roadmap = null;
    var drawnRoadmap = [];
    var obstacles = [];
    var start = [100, 400];
    var goal = [400, 100];
    var drawnPath = null;

    function drawStartAndGoal() {
        r.circle(start[0], start[1], 4).attr("fill", "#66f");
        r.circle(goal[0], goal[1], 4).attr("fill", "#6f6")
    }

    drawStartAndGoal();
    $("#draw").click(function (e) {
        if (drawingState == "none") {
            update = beginDraw("#f00", r, e.offsetX, e.offsetY);
            drawingState = "drawing"
        } else if (drawingState == "drawing") {
            var result =
                update(e.offsetX, e.offsetY);
            if (result != 0) {
                obstacles.push(result);
                drawingState = "none"
            }
        }
    });
    $("#calc").click(function () {
        $("#instructions").html("Clear roadmap to draw");
        roadmap = computeRoadmap(roadmap, obstacles);
        for (var i = 0; i < drawnRoadmap.length; i++)drawnRoadmap[i].remove();
        drawnRoadmap = drawRoadmap(roadmap, r);
        drawingState = "disabled"
    });
    $("#route").click(function () {
        if (drawnPath != null)drawnPath.remove();
        if (roadmap == null)return;
        var path = calcShortestPath(start, goal, roadmap);
        drawnPath = drawPath(goal, path, start,
            r)
    });
    $("#clear").click(function () {
        $("#instructions").html("Click to draw obstacles");
        r.clear();
        sums = [];
        obstacles = [];
        opaths = [];
        robot = null;
        dot = null;
        drawnPath = null;
        roadmap = null;
        drawnRoadmap = [];
        drawingState = "none";
        drawStartAndGoal()
    });
    $("#clearroadmap").click(function () {
        $("#instructions").html("Click to draw obstacles");
        if (drawnPath != null)drawnPath.remove();
        drawnPath = null;
        roadmap = null;
        if (drawnRoadmap != [])for (var i = 0; i < drawnRoadmap.length; i++)drawnRoadmap[i].remove();
        drawingState = "none";
        drawnRoadmap = []
    })
});