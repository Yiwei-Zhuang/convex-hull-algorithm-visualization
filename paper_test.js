// Only executed our code once the DOM is ready.
let globalPointList = [];
let tool = new paper.Tool();

tool.onMouseDown = (event) => {
    // Add a segment to the path at the position of the mouse:
    let point = event.point;
    point.y = -point.y + GLOBAL_CANVAS_HEIGHT;
    globalPointList.push(point);
    drawPoint(point, 3);
}

window.onload = function () {
    // Get a reference to the canvas object
    let canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    // Create a Paper.js Path to draw a line into it:
    let point1 = getPoint(300, 300);
    let point2 = getPoint(400, 300);
    let point3 = getPoint(500, 400);
    // let path1 = drawLine(point1, point2, "#000000")
    // let path2 = drawLine(point2, point3, "#000000")

    paper.view.draw();
}

tool.activate();
