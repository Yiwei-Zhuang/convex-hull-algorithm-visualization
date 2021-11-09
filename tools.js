const GLOBAL_CANVAS_WIDTH = 800;
const GLOBAL_CANVAS_HEIGHT = 600;

function drawLine(p1, p2, c = "#000000") {
    let path = new paper.Path();
    path.strokeColor = c;
    path.add(new paper.Point(p1.x, -p1.y + GLOBAL_CANVAS_HEIGHT), new paper.Point(p2.x, -p2.y + GLOBAL_CANVAS_HEIGHT));
    return path;
}

function addPointToPath(path, p) {
    path.add(new paper.Point(p.x, -p.y + GLOBAL_CANVAS_HEIGHT));
}

function insertPointToPath(path, i, p) {
    path.insert(i, new paper.Point(p.x, -p.y + GLOBAL_CANVAS_HEIGHT));
}

function drawPoint(p, r, c = "#000000") {
    let path = new paper.Path.Circle(new paper.Point(p.x, -p.y + GLOBAL_CANVAS_HEIGHT), r);
    path.fillColor = c;
    return path;
}

function drawPolygon(path, pointList, c = "#000000") {
    if (!path) {
        path = new paper.Path();
    }
    path.removeSegments();
    path.strokeColor = c;
    for (let i = 0; i < pointList.length; i++) {
        path.add(new paper.Point(pointList[i].x, -pointList[i].y + GLOBAL_CANVAS_HEIGHT));
    }
    path.selected = true;
    path.closed = true;
    // for (let i = 0; i < pointList.length - 1; i++) {
    //     drawLine(pointList[i], pointList[i + 1], c);
    // }
    // drawLine(pointList[pointList.length - 1], pointList[0], c);
}

function getPoint(x, y) {
    return new paper.Point(x, y);
}

function getVector(p1, p2) {
    // Reverse Y
    return new paper.Point(p2.x - p1.x, p1.y - p2.y);
}

function getSlope(p1, p2) {
    return (p2.y - p1.y) / (p2.x - p1.x);
}

function crossProduct(v1, v2) {
    return v1.x * v2.y - v2.x * v1.y
}

function orient(p1, p2, p3) {
    let v1 = getVector(p1, p2);
    let v2 = getVector(p2, p3);
    return crossProduct(v1, v2);
}

function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function nextPointOnPointList(pl, point) {
    let retIndex = 0;
    for (let i = 0; i < pl.length; i++) {
        if (pl[i].x === point.x && pl[i].y === point.y) {
            retIndex = i + 1;
            break;
        }
    }
    if (retIndex === pl.length) {
        retIndex = 0;
    }
    return pl[retIndex];
}

function previousPointOnPointList(pl, point) {
    let retIndex = 0;
    for (let i = 0; i < pl.length; i++) {
        if (pl[i].x === point.x && pl[i].y === point.y) {
            retIndex = i - 1;
            break;
        }
    }
    if (retIndex === -1) {
        retIndex = pl.length - 1;
    }
    return pl[retIndex];
}

function nextPointIndex(pl, index) {
    let retIndex = index + 1;
    if(retIndex === pl.length) {
        retIndex = 0;
    }
    return retIndex;
}

function previousPointIndex(pl, index) {
    let retIndex = index - 1;
    if(retIndex === -1) {
        retIndex = pl.length - 1;
    }
    return retIndex;
}

function rightMostPointIndex(pl) {
    let rightMostX = -1; // Start at (0,0)
    let rightMostXIndex = -1;
    for(let i = 0; i < pl.length; i++) {
        if(pl[i].x > rightMostX) {
            rightMostX = pl[i].x;
            rightMostXIndex = i;
        }
    }
    return rightMostXIndex;
}

function leftMostPointIndex(pl) {
    let leftMostX = Number.MAX_VALUE;
    let leftMostXIndex = Number.MAX_VALUE;
    for(let i = 0; i < pl.length; i++) {
        if(pl[i].x < leftMostX) {
            leftMostX = pl[i].x;
            leftMostXIndex = i;
        }
    }
    return leftMostXIndex;
}

function topPointIndex(pl) {
    let topY = -1;
    let topYIndex = -1;
    for(let i = 0; i < pl.length; i++) {
        if(pl[i].y > topY) {
            topY = pl[i].y;
            topYIndex = i;
        }
    }
    return topYIndex;
}

function botPointIndex(pl) {
    let botY = Number.MAX_VALUE;
    let botYIndex = Number.MAX_VALUE;
    for(let i = 0; i < pl.length; i++) {
        if(pl[i].y < botY) {
            botY = pl[i].y;
            botYIndex = i;
        }
    }
    return botYIndex;
}

function removeItemOnce(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
