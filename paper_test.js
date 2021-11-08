// Only executed code once the DOM is ready.
let GLOBAL_POINT_LIST = [];
let GLOBAL_POINT_OBJECT_MAP = {};
let tool = new paper.Tool();
let GRAHAM_SCAN_HULL_PATH = null;

tool.onMouseDown = (event) => {
    let point = event.point;
    point.y = -point.y + GLOBAL_CANVAS_HEIGHT;
    if(paper.Key.isDown("shift")) {
        // Detect if there is a point in our point list close to the click position.
        let minPoint = null;
        let minDis = Number.MAX_VALUE;
        let minIndex = 0;
        for(let i = 0; i < GLOBAL_POINT_LIST.length; i++) {
            let tempDis = getDistance(point, GLOBAL_POINT_LIST[i]);
            if(tempDis < minDis) {
                minDis = tempDis;
                minPoint = GLOBAL_POINT_LIST[i];
                minIndex = i;
            }
        }
        if(minDis < 20) {
            let key = minPoint.x + "," + minPoint.y;
            let pointObj = GLOBAL_POINT_OBJECT_MAP[key];
            pointObj.remove();
            delete GLOBAL_POINT_OBJECT_MAP[key];
            GLOBAL_POINT_LIST.splice(minIndex, 1);
        }
    } else if(paper.Key.isDown("d")) {
        GLOBAL_POINT_OBJECT_MAP[point.x + ","+point.y] = drawPoint(point, 3);
        GLOBAL_POINT_LIST.push(point);
        drawPolygon(GRAHAM_SCAN_HULL_PATH, grahamScan(Array.from(GLOBAL_POINT_LIST)));
    } else {
        GLOBAL_POINT_OBJECT_MAP[point.x + ","+point.y] = drawPoint(point, 3);
        GLOBAL_POINT_LIST.push(point);
    }
}

window.onload = function () {
    // Get a reference to the canvas object
    let canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    GRAHAM_SCAN_HULL_PATH = new paper.Path();
    // Create a Paper.js Path to draw a line into it:
    let point1 = getPoint(300, 300);
    let point2 = getPoint(400, 300);
    let point3 = getPoint(500, 400);
    // let path1 = drawLine(point1, point2, "#000000")
    // let path2 = drawLine(point2, point3, "#000000")

    paper.view.draw();
}

tool.activate();
