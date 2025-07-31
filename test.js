let HID = require('node-hid');

/**
 * The ps4 controller's buttons and sticks.
 * @typedef {Object} Controller
 * @property {Dpad}  dpad
 * @prop {object} sticks
 * @prop {Stick} sticks.left
 * @prop {Stick} sticks.right
 * @prop {object} symbols
 * @prop {Button} symbols.circle
 * @prop {Button} symbols.square
 * @prop {Button} symbols.triangle
 * @prop {Button} symbols.cross
 *
 */

/**
 * @typedef {Object} Stick
 * @prop {Vector2D} raw
 * @prop {Vector2D} normalized
 */

/**
 * @typedef {Object} Vector2D
 * @prop {number} x
 * @prop {number} y
 */

/**
 * @typedef {Object} Dpad
 * @property {Button}  up       - Information about the state of the up button.
 * @property {Button}  down       - Information about the state of the down button.
 * @property {Button}  left       - Information about the state of the left button.
 * @property {Button}  right       - Information about the state of the right button.
 */

/**
 * @typedef {Object} Button
 * @prop {!boolean} isPressed - Whether the button is pressed down at the moment
 * @prop {?number} lastPressedTimestamp - The last time when the button was pressed. Undefined if it was not yet pressed.
 * @prop {?number} lastReleasedTimestamp - The last time when the button was released. Undefined if it was not yet pressed.
 */

/** @type {Controller}}     */
let controller = {
    dpad: {
        up: {
            isPressed: false,
            lastPressedTimestamp: null,
            lastReleasedTimestamp: null
        },
        down: {
            isPressed: false,
            lastPressedTimestamp: null,
            lastReleasedTimestamp: null
        },
        left: {
            isPressed: false,
            lastPressedTimestamp: null,
            lastReleasedTimestamp: null
        },
        right: {
            isPressed: false,
            lastPressedTimestamp: null,
            lastReleasedTimestamp: null
        },
    },
    symbols: {
        cross: {
            isPressed: false,
            lastPressedTimestamp: null,
            lastReleasedTimestamp: null
        },
        circle: {
            isPressed: false,
            lastPressedTimestamp: null,
            lastReleasedTimestamp: null
        },
        triangle: {
            isPressed: false,
            lastPressedTimestamp: null,
            lastReleasedTimestamp: null
        },
        square: {
            isPressed: false,
            lastPressedTimestamp: null,
            lastReleasedTimestamp: null
        },
    },
    sticks: {
        left: {
            raw: {
                x: 0,
                y: 0,
            },
            normalized: {
                x: 0,
                y: 0,
            }
        },
        right: {
            raw: {
                x: 0,
                y: 0,
            },
            normalized: {
                x: 0,
                y: 0,
            }
        }
    }
}

async function main() {
    // let devices = await HID.devicesAsync();
    let device = await HID.HIDAsync.open(1356, 2508);

    let previousDpad = 8;
    let previousSymbols = 0;


    device.on("data", async (data) => {
        /** @type {Vector2D} */
        const leftStick = {x: data[1], y: data[2]};
        /** @type {Vector2D} */
        const rightStick = {x: data[3], y: data[4]};
        /** @type {Vector2D} */
        const leftStickNormalized = {x: leftStick.x - 127, y: 255 - leftStick.y - 127};
        /** @type {Vector2D} */
        const rightStickNormalized = {x: rightStick.x - 127, y: 255 - rightStick.y - 127};
        if (leftStick.x !== controller.sticks.left.x || leftStick.y !== controller.sticks.left.y) {
            controller.sticks.left.raw = {...leftStick};
            controller.sticks.left.normalized = {...leftStickNormalized};
            //     TODO: call emitter
        }
        if (rightStick.x !== controller.sticks.right.x || rightStick.y !== controller.sticks.right.y) {
            controller.sticks.right.raw = {...rightStick};
            controller.sticks.right.normalized = {...rightStickNormalized};
            //     TODO: call emitter
        }

        const dpad = data[5] & 0x0F;
        if (previousDpad !== dpad) {
            emitDpadEvent(previousDpad, dpad);
            previousDpad = dpad;
        }

        const symbols = data[5];
        if (previousSymbols !== symbols) {
            emitSymbolEvent(previousSymbols, symbols);
            previousSymbols = symbols;
        }


        /*

                const l1 = (data[6] & 0x01) !== 0;
                const r1 = (data[6] & 0x02) !== 0;

                console.log("DPad:", dpad);
                console.log("Cross:", cross, "Circle:", circle, "Triangle:", triangle);
                console.log("L1:", l1, "R1:", r1);*/
    });

    /*    device.on('connect', (data) => {

        })*/
}

main().then()

const upValues = [0, 1, 7]
const rightValues = [1, 2, 3]
const downValues = [3, 4, 5]
const leftValues = [5, 6, 7]

/**
 * @param {number} oldVal
 * @param {number} newVal
 */
function emitDpadEvent(oldVal, newVal) {
    if (!upValues.includes(oldVal) && upValues.includes(newVal)) {
        console.log('UP pressed')
        controller.dpad.up.isPressed = true;
        controller.dpad.up.lastPressedTimestamp = Date.now();
    }
    if (upValues.includes(oldVal) && !upValues.includes(newVal)) {
        console.log('UP released')
        controller.dpad.up.isPressed = false;
        controller.dpad.up.lastReleasedTimestamp = Date.now();
    }
    if (!downValues.includes(oldVal) && downValues.includes(newVal)) {
        console.log('DOWN pressed')
        controller.dpad.down.isPressed = true;
        controller.dpad.down.lastPressedTimestamp = Date.now();
    }
    if (downValues.includes(oldVal) && !downValues.includes(newVal)) {
        console.log('DOWN released')
        controller.dpad.down.isPressed = false;
        controller.dpad.down.lastReleasedTimestamp = Date.now();
    }
    if (!leftValues.includes(oldVal) && leftValues.includes(newVal)) {
        console.log('LEFT pressed')
        controller.dpad.left.isPressed = true;
        controller.dpad.left.lastPressedTimestamp = Date.now();
    }
    if (leftValues.includes(oldVal) && !leftValues.includes(newVal)) {
        console.log('LEFT released')
        controller.dpad.left.isPressed = false;
        controller.dpad.left.lastReleasedTimestamp = Date.now();
    }
    if (!rightValues.includes(oldVal) && rightValues.includes(newVal)) {
        console.log('RIGHT pressed')
        controller.dpad.right.isPressed = true;
        controller.dpad.right.lastPressedTimestamp = Date.now();
    }
    if (rightValues.includes(oldVal) && !rightValues.includes(newVal)) {
        console.log('RIGHT released')
        controller.dpad.right.isPressed = false;
        controller.dpad.right.lastReleasedTimestamp = Date.now();
    }

}


/**
 *
 * @param {number} oldVal
 * @param {number} newVal
 */
function emitSymbolEvent(oldVal, newVal) {
    if (!isSquare(oldVal) && isSquare(newVal)) {
        console.log('square pressed');
        controller.symbols.square.isPressed = true;
        controller.symbols.square.lastPressedTimestamp = Date.now();
    }
    if (isSquare(oldVal) && !isSquare(newVal)) {
        console.log('square released');
        controller.symbols.square.isPressed = false;
        controller.symbols.square.lastReleasedTimestamp = Date.now();
    }

    if (!isCircle(oldVal) && isCircle(newVal)) {
        console.log('circle pressed')
        controller.symbols.circle.isPressed = true;
        controller.symbols.circle.lastPressedTimestamp = Date.now();
    }
    if (isCircle(oldVal) && !isCircle(newVal)) {
        console.log('circle released');
        controller.symbols.circle.isPressed = false;
        controller.symbols.circle.lastReleasedTimestamp = Date.now();
    }

    if (!isCross(oldVal) && isCross(newVal)) {
        console.log('cross pressed')
        controller.symbols.cross.isPressed = true;
        controller.symbols.cross.lastPressedTimestamp = Date.now();
    }
    if (isCross(oldVal) && !isCross(newVal)) {
        console.log('cross released');
        controller.symbols.cross.isPressed = false;
        controller.symbols.cross.lastReleasedTimestamp = Date.now();
    }

    if (!isTriangle(oldVal) && isTriangle(newVal)) {
        console.log('triangle pressed')
        controller.symbols.triangle.isPressed = true;
        controller.symbols.triangle.lastPressedTimestamp = Date.now();
    }

    if (isTriangle(oldVal) && !isTriangle(newVal)) {
        console.log('triangle released')
        controller.symbols.triangle.isPressed = false;
        controller.symbols.triangle.lastReleasedTimestamp = Date.now();
    }


    /** @param {number} value     */
    function isSquare(value) {
        return (value & 0x10) !== 0;
    }

    /** @param {number} value     */
    function isCross(value) {
        return (value & 0x20) !== 0;
    }

    /** @param {number} value     */
    function isCircle(value) {
        return (value & 0x40) !== 0;
    }

    /** @param {number} value     */
    function isTriangle(value) {
        return (value & 0x80) !== 0;
    }

}