async function grahamScan(pointList, visual = false) {
    if (visual) {
        GRAHAM_SCAN_HULL_PATH.selected = false;
    }
    if (pointList.length < 3) {
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
    let lowerVisualPath = new paper.Path();
    lowerVisualPath.strokeColor = "#FF0000";
    if (visual) {
        addPointToPath(lowerVisualPath, pointList[0]);
        addPointToPath(lowerVisualPath, pointList[1]);
    }
    while (pointList.length !== 0) {
        let p1 = lowerHullList[lowerHullList.length - 2];
        let p2 = lowerHullList[lowerHullList.length - 1];
        let p3 = pointList[index];
        if (visual) {
            addPointToPath(lowerVisualPath, p3);
            await sleep(1000);
        }
        while (orient(p1, p2, p3) > 0) {
            // Turn right
            lowerHullList.pop();
            if (lowerHullList.length < 2) {
                lowerVisualPath.removeSegment(lowerVisualPath.segments.length - 2);
                break;
            }
            p1 = lowerHullList[lowerHullList.length - 2];
            p2 = lowerHullList[lowerHullList.length - 1];
            if (visual) {
                lowerVisualPath.removeSegment(lowerVisualPath.segments.length - 1);
                lowerVisualPath.removeSegment(lowerVisualPath.segments.length - 1);
                lowerVisualPath.removeSegment(lowerVisualPath.segments.length - 1);
                addPointToPath(lowerVisualPath, p1);
                addPointToPath(lowerVisualPath, p2);
                addPointToPath(lowerVisualPath, p3);
                await sleep(1000);
            }
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
    let upperVisualPath = new paper.Path();
    upperVisualPath.strokeColor = "#0000FF";
    if (visual) {
        addPointToPath(upperVisualPath, pointList[0]);
        addPointToPath(upperVisualPath, pointList[1]);
    }
    while (pointList.length !== 0) {
        let p1 = upperHullList[upperHullList.length - 2];
        let p2 = upperHullList[upperHullList.length - 1];
        let p3 = pointList[index];
        if (visual) {
            addPointToPath(upperVisualPath, p3);
            await sleep(1000);
        }
        while (orient(p1, p2, p3) > 0) {
            // Turn right
            upperHullList.pop();
            if (upperHullList.length < 2) {
                upperVisualPath.removeSegment(upperVisualPath.segments.length - 2);
                break;
            }
            p1 = upperHullList[upperHullList.length - 2];
            p2 = upperHullList[upperHullList.length - 1];
            if (visual) {
                upperVisualPath.removeSegment(upperVisualPath.segments.length - 1);
                upperVisualPath.removeSegment(upperVisualPath.segments.length - 1);
                upperVisualPath.removeSegment(upperVisualPath.segments.length - 1);
                addPointToPath(upperVisualPath, p1);
                addPointToPath(upperVisualPath, p2);
                addPointToPath(upperVisualPath, p3);
                await sleep(1000);
            }
        }
        // Turn left
        upperHullList.push(p3);
        index++;
        if (index === pointList.length) {
            break;
        }
    }
    upperHullList.shift();
    lowerHullList.push.apply(lowerHullList, upperHullList);
    if (lowerHullList[0].x === lowerHullList[lowerHullList.length - 1].x
        && lowerHullList[0].y === lowerHullList[lowerHullList.length - 1].y) {
        lowerHullList.pop();
    }
    lowerVisualPath.remove();
    upperVisualPath.remove();
    return lowerHullList;
}

async function mergeSubHull(pointList1, pointList2) {
    if (pointList1.length < 6) {
        pointList1 = await grahamScan(pointList1, false);
    } else {
        let mid = pointList1.length / 2;
        let leftPart = pointList1.slice(0, mid);
        let rightPart = pointList1.slice(mid, pointList1.length);
        pointList1 = await mergeSubHull(leftPart, rightPart);
    }
    if (pointList2.length < 6) {
        pointList2 = await grahamScan(pointList2, false);
    } else {
        let mid = pointList2.length / 2;
        let leftPart = pointList2.slice(0, mid);
        let rightPart = pointList2.slice(mid, pointList2.length);
        pointList2 = await mergeSubHull(leftPart, rightPart);
    }
    let pl1RightMostIndex = rightMostPointIndex(pointList1);
    let pl2LeftMostIndex = leftMostPointIndex(pointList2);
    // Find upper tangent
    let upperTangentLeftIndex = pl1RightMostIndex;
    let upperTangentRightIndex = pl2LeftMostIndex;
    while (1) {
        let nextLeftPointIndex = nextPointIndex(pointList1, upperTangentLeftIndex);
        while (orient(pointList2[upperTangentRightIndex], pointList1[upperTangentLeftIndex], pointList1[nextLeftPointIndex]) > 0) {
            upperTangentLeftIndex = nextLeftPointIndex;
            nextLeftPointIndex = nextPointIndex(pointList1, upperTangentLeftIndex);
        }
        let previousRightPointIndex = previousPointIndex(pointList2, upperTangentRightIndex);
        while (orient(pointList2[previousRightPointIndex], pointList2[upperTangentRightIndex], pointList1[upperTangentLeftIndex]) > 0) {
            upperTangentRightIndex = previousRightPointIndex;
            previousRightPointIndex = previousPointIndex(pointList2, upperTangentRightIndex);
        }
        if (orient(pointList2[upperTangentRightIndex], pointList1[upperTangentLeftIndex], pointList1[nextLeftPointIndex]) < 0) {
            break;
        }
    }
    // Find lower tangent
    let lowerTangentLeftIndex = pl1RightMostIndex;
    let lowerTangentRightIndex = pl2LeftMostIndex;
    while (1) {
        let nextRightPointIndex = nextPointIndex(pointList2, lowerTangentRightIndex);
        while (orient(pointList1[lowerTangentLeftIndex], pointList2[lowerTangentRightIndex], pointList2[nextRightPointIndex]) > 0) {
            lowerTangentRightIndex = nextRightPointIndex;
            nextRightPointIndex = nextPointIndex(pointList2, lowerTangentRightIndex);
        }
        let previousLeftPointIndex = previousPointIndex(pointList1, lowerTangentLeftIndex);
        while (orient(pointList1[previousLeftPointIndex], pointList1[lowerTangentLeftIndex], pointList2[lowerTangentRightIndex]) > 0) {
            lowerTangentLeftIndex = previousLeftPointIndex;
            previousLeftPointIndex = previousPointIndex(pointList1, lowerTangentLeftIndex);
        }
        if (orient(pointList1[lowerTangentLeftIndex], pointList2[lowerTangentRightIndex], pointList2[nextRightPointIndex]) < 0) {
            break;
        }
    }
    // Merge two point lists
    let leftPointList = [];
    let rightPointList = [];
    let leftFlag = false;
    let rightFlag = false;
    for(let i = upperTangentLeftIndex; i < pointList1.length; i++) {
        leftPointList.push(pointList1[i]);
        if( i === lowerTangentLeftIndex) {
            leftFlag = true;
            break;
        }
    }
    if(!leftFlag) {
        for(let i = 0; i <= lowerTangentLeftIndex; i++) {
            leftPointList.push(pointList1[i]);
        }
    }
    for(let i = lowerTangentRightIndex; i < pointList2.length; i++) {
        rightPointList.push(pointList2[i]);
        if(i === upperTangentRightIndex) {
            rightFlag = true;
            break;
        }
    }
    if(!rightFlag) {
        for(let i = 0; i <= upperTangentRightIndex; i++) {
            rightPointList.push(pointList2[i]);
        }
    }
    leftPointList.push.apply(leftPointList, rightPointList);
    return leftPointList;
}

async function mergeHull(pointList, visual = false) {
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
    let midPoint = pointList[pointList.length / 2];
    let mid = pointList.length / 2;
    let leftPart = pointList.slice(0, mid);
    let rightPart = pointList.slice(mid, pointList.length);
    let result = await mergeSubHull(leftPart, rightPart)
    return result;
}

