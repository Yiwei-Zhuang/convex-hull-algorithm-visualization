/*
    Return convex hull point list in counterclockwise order. Max list size is 5.
 */
function grahamScan(pointList) {
    if (pointList.length < 4) {
        return pointList;
    }
    // Sort point list by x-coordinate
    pointList.sort(function (p1, p2) {
        let x1 = p1.x
        let x2 = p2.x;
        if (x1 === x2) {
            p2.x += 0.00001;
        }
        if (x1 < x2) {
            return -1;
        }
        if (x1 > x2) {
            return 1;
        }
    });
    let leftMostPoint = pointList[0];
    let rightMostPoint = pointList[pointList.length - 1];

    // Get lower hull
    let lowerHullList = new Array(0);
    lowerHullList.push(pointList[0], pointList[1]);
    let index = 2;
    while (pointList.length !== 0) {
        let p1 = lowerHullList[lowerHullList.length - 2];
        let p2 = lowerHullList[lowerHullList.length - 1];
        let p3 = pointList[index];
        while (orient(p1, p2, p3) > 0) {
            // Turn right
            lowerHullList.pop();
            if (lowerHullList.length < 2) {
                break;
            }
            p1 = lowerHullList[lowerHullList.length - 2];
            p2 = lowerHullList[lowerHullList.length - 1];
        }
        // Turn left
        lowerHullList.push(p3);
        index++;
        if (index === pointList.length) {
            break;
        }
    }
    // Get upper hull
    pointList = pointList.reverse();
    let upperHullList = new Array(0);
    upperHullList.push(pointList[0], pointList[1]);
    index = 2;
    while (pointList.length !== 0) {
        let p1 = upperHullList[upperHullList.length - 2];
        let p2 = upperHullList[upperHullList.length - 1];
        let p3 = pointList[index];
        while (orient(p1, p2, p3) > 0) {
            // Turn right
            upperHullList.pop();
            if (upperHullList.length < 2) {
                break;
            }
            p1 = upperHullList[upperHullList.length - 2];
            p2 = upperHullList[upperHullList.length - 1];
        }
        // Turn left
        upperHullList.push(p3);
        index++;
        if (index === pointList.length) {
            break;
        }
    }
    lowerHullList.push.apply(lowerHullList, upperHullList);
    return lowerHullList;
}


