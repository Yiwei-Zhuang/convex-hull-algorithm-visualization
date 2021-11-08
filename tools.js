const GLOBAL_CANVAS_WIDTH = 800;
const GLOBAL_CANVAS_HEIGHT = 600;

function drawLine(p1, p2, c = "#000000") {
    let path = new paper.Path();
    path.strokeColor = c;
    path.add(new paper.Point(p1.x, -p1.y + GLOBAL_CANVAS_HEIGHT), new paper.Point(p2.x, -p2.y + GLOBAL_CANVAS_HEIGHT));
    return path;
}

function drawPoint(p, r, c = "#000000") {
    let path = new paper.Path.Circle(new paper.Point(p.x, -p.y + GLOBAL_CANVAS_HEIGHT), r);
    path.fillColor = c;
    return path;
}

function drawPolygon(pointList, c = "#000000") {
    // let points = bruteForce(Array.from(globalPointList));
    for (let i = 0; i < pointList.length - 1; i++) {
        drawLine(pointList[i], pointList[i + 1], c);
    }
    drawLine(pointList[pointList.length - 1], pointList[0], c);
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


function removeItemOnce(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
