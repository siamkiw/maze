const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter

const width = 800
const height = 600

const engine = Engine.create()
const { world } = engine
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: width,
        height: height,
        wireframes: false
    }
})

Render.run(render)
Runner.run(Runner.create(), engine)

World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
}))

const shape = Bodies.rectangle(200, 200, 50, 50, { isStatic: false })

const walls = [
    Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
    Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),
    Bodies.rectangle(800, 300, 40, 600, { isStatic: true })
]

World.add(world, walls)

// random obj

for (let i = 0; i < 50; i++) {

    ranWidth = Math.random() * width
    ranHeight = Math.random() * height

    if (Math.random() > 0.5) {
        World.add(world, Bodies.rectangle(ranWidth, ranHeight, 50, 50, { isStatic: false }))
    } else {
        World.add(world, Bodies.circle(ranWidth, ranHeight, 35, {
            isStatic: false,
            render: {
                fillStyle: 'red'
            }
        }))
    }

}

World.add(world, shape)