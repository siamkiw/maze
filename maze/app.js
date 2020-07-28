const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter

const cellsHorizontal = 3
const cellsVertical = 3
const width = window.innerWidth
const height = window.innerHeight

const unitLengthX = width / cellsHorizontal
const unitLengthY = height / cellsVertical

const engine = Engine.create()
engine.world.gravity.y = 0
const { world } = engine
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'white'
    }
})

// create categories
let defaultCategory = 0x0001,
    floorCategory = 0x0002

// define color
const darkBlue = '#111d5e',
    red = '#c70039',
    orange = '#f37121',
    lightOrange = '#ffbd69'

Render.run(render)
Runner.run(Runner.create(), engine)

const walls = [
    Bodies.rectangle(width / 2, 0, width, 5, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 5, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 5, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 5, height, { isStatic: true })
]

World.add(world, walls)

const shuffle = (array) => {
    let counter = array.length;
    while (counter > 0) {
        randomIndex = Math.floor(Math.random() * counter)
        counter--

        const temp = array[counter]
        array[counter] = array[randomIndex]
        array[randomIndex] = temp
    }

    return array
}

const grid = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false))
const vertical = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal - 1).fill(false))
const horizontails = Array(cellsVertical - 1)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false))

const floorGrid = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false))


const startRow = Math.floor(Math.random() * cellsVertical)
const startColumn = Math.floor(Math.random() * cellsHorizontal)

const stepThroughCell = (row, column) => {
    // check if visted the cell at [row][column] then return 
    if (grid[row][column]) {
        return
    }
    // mark this cell as vsited 
    grid[row][column] = true
    // random  which  way to go  above, right, below, left, 
    const neighbors = shuffle([
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left']
    ])

    for (let neighbor of neighbors) {
        const [nextRow, nextColumn, dricrtion] = neighbor

        // if neighbors is not out of bounds (wall)
        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
            continue
        }
        // if we have visted that neighbor, continue to the next neighbor
        if (grid[nextRow][nextColumn]) {
            continue
        }
        // remove wall by update vertical and horizontails
        if (dricrtion === 'left') {
            vertical[row][column - 1] = true
        } else if (dricrtion === 'right') {
            vertical[row][column] = true
        } else if (dricrtion === 'up') {
            horizontails[row - 1][column] = true
        } else if (dricrtion === 'down') {
            horizontails[row][column] = true
        }

        stepThroughCell(nextRow, nextColumn)
    }

}

// const findExit = async (row, column) => {
//     console.log('round');
//     console.log(floorGrid);
//     const exitGrids = []
//     // check if visted the cell at [row][column] then return 
//     if (!floorGrid[row][column]) {
//         console.log('1');
//         return
//     }
//     // mark this cell as vsited 
//     floorGrid[row][column] = false
//     await changeColor(row, column)

//     const neighbors = shuffle([
//         [row - 1, column, 'up'],
//         [row, column + 1, 'right'],
//         [row + 1, column, 'down'],
//         [row, column - 1, 'left']
//     ])

//     for (let neighbor of neighbors) {
//         const [nextRow, nextColumn, dricrtion] = neighbor
//         // if neighbors is not out of bounds (wall)
//         if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
//             continue
//         }
//         // if we have visted that neighbor, continue to the next neighbor
//         if (!floorGrid[nextRow][nextColumn]) {
//             continue
//         }
//         // check if left grid does not has wall change color of the floor push index of nextRow and nextColumn to the exitGrids
//         // delay 0.2 s 
//         if (dricrtion === 'left' && vertical[row][column - 1]) {
//             await changeColor(nextRow, nextColumn)
//             exitGrids.push([nextRow, nextColumn])
//             console.log('left', nextRow, nextColumn, dricrtion === 'left' && vertical[row][column - 1]);
//         } else if (dricrtion === 'right' && vertical[row][column]) {
//             await changeColor(nextRow, nextColumn)
//             exitGrids.push([nextRow, nextColumn])
//             console.log('right', nextRow, nextColumn, dricrtion === 'right' && vertical[row][column]);
//         } else if (dricrtion === 'up' && horizontails[row - 1][column]) {
//             await changeColor(nextRow, nextColumn)
//             exitGrids.push([nextRow, nextColumn])
//             console.log('up', nextRow, nextColumn, dricrtion === 'up' && horizontails[row - 1][column]);
//         } else if (dricrtion === 'down' && horizontails[row][column]) {
//             await changeColor(nextRow, nextColumn)
//             exitGrids.push([nextRow, nextColumn])
//             console.log('down', nextRow, nextColumn, dricrtion === 'down' && horizontails[row][column]);
//         }
//         // console.log('exitGrids', exitGrids);
//         console.log('floorGrid', floorGrid);
//         await findExit(nextRow, nextColumn)
//     }
// }


const findExit = async (row, column) => {
    const lastVisted = []
    // check if grid is false (has visted) return 
    if (floorGrid[row][column]) {
        console.log('vosted');
        return
    }
    await changeColor(row, column)
    // mark as visted
    floorGrid[row][column] = true

    // random  which  way to go  above, right, below, left, 
    const neighbors = shuffle([
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left']
    ])

    for (let neighbor of neighbors) {
        const [nextRow, nextColumn, dricrtion] = neighbor

        // check if nextRow and nextcolumn outside of the maze skip to next loop
        if (nextRow < 0 || nextRow >= cellsHorizontal || nextColumn < 0 || nextColumn >= cellsHorizontal) {
            continue
        }

        // check if grid is false (has visted) return 
        if (floorGrid[nextRow][nextColumn]) {
            continue
        }

        // check if left grid does not has wall change color of the floor push index of nextRow and nextColumn to the exitGrids
        // delay 0.2 s 
        if (dricrtion === 'left' && vertical[row][column - 1]) {
            console.log('left');
            await changeColor(nextRow, nextColumn)

        } else if (dricrtion === 'right' && vertical[row][column]) {
            console.log('right');
            await changeColor(nextRow, nextColumn)

        } else if (dricrtion === 'up' && horizontails[row - 1][column]) {
            console.log('up');
            await changeColor(nextRow, nextColumn)

        } else if (dricrtion === 'down' && horizontails[row][column]) {
            console.log('down');
            await changeColor(nextRow, nextColumn)
        }
        // console.log(row, column)
        // console.log(nextRow, nextRow)
        await findExit(nextRow, nextColumn)
    }

}

stepThroughCell(startRow, startColumn)

// create floor

grid.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        const box = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY / 2,
            unitLengthX,
            unitLengthY,
            {
                collisionFilter: {
                    category: floorCategory
                },
                isStatic: true, label: 'box',
                render: {
                    fillStyle: lightOrange,
                    strokeStyle: lightOrange,
                    lineWidth: 3
                },
                floorId: `${rowIndex}-${columnIndex}`
            }
        )
        World.add(world, box)
    })
})

horizontails.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) return
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            2,
            {
                collisionFilter: {
                    mask: defaultCategory
                },
                isStatic: true, label: 'wall',
                render: {
                    fillStyle: darkBlue
                }
            }
        )
        World.add(world, wall)
    })

})

vertical.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) return
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY / 2,
            2,
            unitLengthY,
            {
                collisionFilter: {
                    mask: defaultCategory
                },
                isStatic: true, label: 'wall',
                render: {
                    fillStyle: darkBlue
                }
            }
        )
        World.add(world, wall)
    })
})

const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * 0.7,
    unitLengthY * 0.7,
    {
        collisionFilter: {
            mask: defaultCategory
        },
        isStatic: true,
        label: 'goal',
        render: {
            fillStyle: red,
            strokeStyle: orange,
            lineWidth: 10
        }
    }
)
World.add(world, goal)

const ballRadius = (Math.min(unitLengthX, unitLengthY) / 2) * 0.7
const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
    ballRadius,
    {
        label: 'ball',
        collisionFilter: {
            mask: defaultCategory
        },
        render: {
            fillStyle: orange,
            strokeStyle: red,
            lineWidth: 10
        }
    }
)

World.add(world, ball)

document.body.addEventListener('keydown', event => {
    const { x, y } = ball.velocity
    if (event.key === 'w') {
        Body.setVelocity(ball, { x, y: y - 3 })
    }
    if (event.key === 'a') {
        Body.setVelocity(ball, { x: x - 3, y: y })
    }
    if (event.key === 's') {
        Body.setVelocity(ball, { x: x, y: y + 3 })
    }
    if (event.key === 'd') {
        Body.setVelocity(ball, { x: x + 3, y: y })
    }
})

// win condition

Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach((collision) => {
        const labels = ['ball', 'goal']
        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            console.log('user won')
            console.log(world.bodies)
            world.gravity.y = 1
            world.bodies.forEach(body => {
                if (body.label === 'wall')
                    Body.setStatic(body, false)
            })
            document.querySelector('.winner').classList.remove('hidden')
        }
    })
})


const changeColor = async (rowIndex, columnIndex, delay = 500) => {

    const delayChange = (body, color) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                body.render.fillStyle = color
                resolve()
            }
                , delay)
        })
    }

    for (let body of world.bodies) {
        if (body.floorId === `${rowIndex}-${columnIndex}`) {
            await delayChange(body, darkBlue)
            await delayChange(body, red)
        }
    }
}

// changeColor(1, 1)
console.log(vertical);
console.log(horizontails);
const dri = findExit(0, 0)
// console.log(dri);


// setInterval(() => {
//     const color = ['pink', 'red', 'orange']
//     world.bodies[4].render.fillStyle = color[Math.floor(Math.random() * color.length)]
// }, 500)

// .set(body, settings, value)
// console.log(world.bodies[4]);