import Two from 'two.js'

export const COLORS = [
    '#f7d046',
    '#ff4c5a',
    '#f08cba',
    '#49c4d2',
    '#924e84',
    '#fd926f',
    '#245a65',
    '#ff6a76',
    '#633d89',
];
export const PI = Math.PI;
export const TAU = PI * 2;

const degToRad = deg => deg / 180 * PI;

const getCoordOnCircle = (r, angleInRad, { cx, cy }) => {
    return {
        x: cx + r * Math.cos(angleInRad),
        y: cy + r * Math.sin(angleInRad),
    };
};

export const wheelFactory = mountElem => {
    const ratios = {
        tickerRadius: 0.06, // of width
        textSize: 0.12, // of radius
        edgeDist: 0.14, // of radius
    };
    let options = {
        width: 360,
        height: 360,
        type: 'svg',
    };
    const friction = 0.99;
    let dirScalar = 1;
    let speed;
    let words;
    let two;
    let group;

    function init(opts) {
        options = { ...options, ...opts };

        two = new Two({
            type: Two.Types[options.type],
            width: options.width,
            height: options.height,
        })
            .bind('resize', handleResize)
            .play();

        two.appendTo(mountElem);
        setViewBox(options.width, options.height);
        two.renderer.domElement.setAttribute(
            'style',
            `
            -moz-user-select:none;
            -ms-user-select:none;
            -webkit-user-select:none;
            user-select:none;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            `
        );
    }

    function setWords(wordsArr) {
        words = wordsArr;
    }

    function setViewBox(width, height) {
        two.renderer.domElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    function drawTicker() {
        const { width } = two;
        const outerRadius = ratios.tickerRadius * width;

        const tickerCircle = drawTickerCircle(outerRadius);
        const circleCenter = tickerCircle.translation;

        drawTickerArrow(outerRadius, degToRad(30), circleCenter);
    }

    function drawTickerCircle(outerRadius) {
        const { height, width } = two;
        const arc = two.makeArcSegment(
            width - outerRadius,
            height / 2,
            outerRadius,
            outerRadius * 0.5,
            0,
            2 * PI
        );
        arc.noStroke();

        return arc;
    }

    function drawTickerArrow(radius, tangentAngle, tickerCenter) {
        const { x, y } = tickerCenter;

        const pointA = getCoordOnCircle(radius, PI, { cx: x, cy: y });
        const pointB = getCoordOnCircle(radius, PI / 2 + tangentAngle, {
            cx: x,
            cy: y,
        });
        const pointC = {
            x: x - radius / Math.cos(PI / 2 - tangentAngle),
            y: y,
        };
        const pointD = getCoordOnCircle(radius, 3 * PI / 2 - tangentAngle, {
            cx: x,
            cy: y,
        });
        const path = two.makePath(
            pointA.x,
            pointA.y,
            pointB.x,
            pointB.y,
            pointC.x,
            pointC.y,
            pointD.x,
            pointD.y
        );
        path.noStroke();

        return path;
    }

    function drawWheel() {
        if (group) {
            destroyPaths();
        }

        const { width } = two;
        const numColors = COLORS.length;
        const rotationUnit = 2 * PI / words.length;
        const xOffset = width * ratios.tickerRadius * 2;
        const radius = (width - xOffset * 2) / 2;
        const center = {
            x: width / 2,
            y: radius + xOffset,
        };
        group = two.makeGroup();

        words.map((word, i, arr) => {
            const angle = rotationUnit * i - (PI + rotationUnit) / 2;
            const arc = two.makeArcSegment(
                center.x,
                center.y,
                0,
                radius,
                0,
                2 * PI / arr.length
            );
            arc.rotation = angle;
            arc.noStroke();
            arc.fill = COLORS[i % numColors];
            
            // empty sector shold be white colored, hardcoded for now TODO
            arc.fill = word === '' ? '#ffffff' : arc.fill;
            
            const textVertex = {
                x:
                    center.x +
                    (radius - radius * ratios.edgeDist) *
                    Math.cos(angle + rotationUnit / 2),
                y:
                    center.y +
                    (radius - radius * ratios.edgeDist) *
                    Math.sin(angle + rotationUnit / 2),
            };

            const text = two.makeText(word, textVertex.x, textVertex.y);
            text.rotation = rotationUnit * i - PI / 2;
            text.alignment = 'right';
            text.fill = '#fff';
            text.size = radius * ratios.textSize;

            return group.add(arc, text);
        });

        group.translation.set(center.x, center.y);
        group.center();
        drawTicker();

        two.update();
    }

    function handleResize() {
        setViewBox(two.width, two.height);
        drawWheel();
        drawTicker();
        two.update();
    }

    function animateWheel() {
        group.rotation = (group.rotation + speed * dirScalar) % TAU;
        speed = speed * friction;

        if (speed < 0.005) {
            two.unbind('update', animateWheel);

            if (options.onWheelStop && typeof options.onWheelStop === 'function') {
                options.onWheelStop(getCurrentWord());
            }
        }
    }

    function spin(newSpeed) {
        speed = newSpeed;
        two.bind('update', animateWheel);
    }

    function getCurrentWord() {
        const numWords = words.length;
        const segmentAngle = TAU / numWords;
        const currAngle = (TAU + PI / 2 - group.rotation + segmentAngle / 2) % TAU;

        return words.find((_, i) => segmentAngle * (i + 1) > currAngle);
    }

    function destroyPaths() {
        group.remove.apply(group, group.children);
        two.clear();
    }

    function destroy() {
        destroyPaths();

        return true;
    }

    return {
        destroy,
        drawWheel,
        getCurrentWord,
        init,
        setWords,
        spin,
    };
};