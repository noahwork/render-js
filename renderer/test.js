const test_drawTriangle1 = function (canvas) {
    let p1 = NoahVector.new(50, 50, 1)
    let p2 = NoahVector.new(0, 200, 1)
    let p3 = NoahVector.new(100, 200, 1)
    let v1 = NoahVertex.new(p1, NoahColor.red())
    let v2 = NoahVertex.new(p2, NoahColor.green())
    let v3 = NoahVertex.new(p3, NoahColor.blue())

    canvas.drawTriangle1(v1, v2, v3)
    canvas.render()
}

const test_drawTriangle2 = function (canvas) {
    let p1 = NoahVector.new(50, 50, 0)
    let p2 = NoahVector.new(0, 50, 0)
    let p3 = NoahVector.new(25, 100, 0)
    let v1 = NoahVertex.new(p1, NoahColor.red())
    let v2 = NoahVertex.new(p2, NoahColor.green())
    let v3 = NoahVertex.new(p3, NoahColor.blue())
    canvas.drawTriangle2(v1, v2, v3)
    canvas.render()
}

const __debug_draw_depth1 = function (canvas) {
    let v1 = NoahVertex.new(NoahVector.new(100, 100, 1), NoahColor.red())
    let v2 = NoahVertex.new(NoahVector.new(200, 150, 1), NoahColor.new(0, 255, 0, 255))
    let v3 = NoahVertex.new(NoahVector.new(100, 150, 1), NoahColor.new(0, 0, 255, 255))

    let v4 = NoahVertex.new(NoahVector.new(150, 100, 0), NoahColor.red())
    let v5 = NoahVertex.new(NoahVector.new(250, 150, 0), NoahColor.new(0, 255, 0, 255))
    let v6 = NoahVertex.new(NoahVector.new(150, 150, 0), NoahColor.black())

    canvas.drawTriangle(v1, v2, v3)
    canvas.drawTriangle(v4, v5, v6)
}

const __debug_draw_depth2 = function (canvas) {
    // front
    let c = NoahColor.new(250, 0, 100, 255)
    let z = 0
    let v1 = NoahVertex.new(NoahVector.new(100, 50, z), c)
    let v2 = NoahVertex.new(NoahVector.new(50, 150, z), c)
    let v3 = NoahVertex.new(NoahVector.new(150, 150, z), c)
    canvas.drawTriangle1(v1, v2, v3)
    // back
    c = NoahColor.new(100, 0, 250, 255)
    z = 1
    let v4 = NoahVertex.new(NoahVector.new(120, 50, z), c)
    let v5 = NoahVertex.new(NoahVector.new(70, 150, z), c)
    let v6 = NoahVertex.new(NoahVector.new(170, 150, z), c)
    canvas.drawTriangle1(v4, v5, v6)
}

const __debug_drawScanline = function (canvas) {
    let a = NoahVector.new(160, 110)
    let b = NoahVector.new(240, 110)
    let c1 = NoahColor.red()
    let c2 = NoahColor.blue()
    let va = NoahVertex.new(a, c1)
    let vb = NoahVertex.new(b, c2)
    canvas.drawScanline(va, vb)
}

const __debug_drawTriangle = function (canvas) {
    let a = NoahVector.new(100, 0)
    let b = NoahVector.new(0, 100)
    let c = NoahVector.new(200, 200)
    let c1 = NoahColor.red()
    let c2 = NoahColor.blue()
    let c3 = NoahColor.green()
    let va = NoahVertex.new(a, c1)
    let vb = NoahVertex.new(b, c2)
    let vc = NoahVertex.new(c, c3)
    canvas.drawTriangle(va, vb, vc)
}

const __debug_drawTriangle2 = function (canvas) {
    let a = NoahVector.new(100, 100)
    let b = NoahVector.new(100, 240)
    let c = NoahVector.new(200, 300)
    let c1 = NoahColor.red()
    let c2 = NoahColor.blue()
    let c3 = NoahColor.green()
    let va = NoahVertex.new(a, c1)
    let vb = NoahVertex.new(b, c2)
    let vc = NoahVertex.new(c, c3)
    canvas.drawTriangle2(va, vc, vb)
}

// const config = {
//     rotationX: 0,
//     rotationY: 0,
//     rotationZ: 0,
//     lightX: 0.1,
//     lightY: 0.1,
//     lightZ: 0.1,
// }

const __debug_drawMesh = function (canvas, axe3dString, axeImageString) {
    // log('rotationY, ', config.rotationY)
    canvas.clear()
    let mesh = AxeMesh.fromNoah3D(axe3dString)
    let image = AxeMesh.fromAxeImage(axeImageString).image
    mesh.image = image
    mesh.matchImage()
    mesh.rotation.x += config.rotation_x.value / 10
    mesh.rotation.y += config.rotation_y.value / 10
    mesh.rotation.z += config.rotation_z.value / 10
    log('rotation', mesh.rotation)
    canvas.drawMesh(mesh)
    //
    canvas.render()
}

const __debug_drawAxeImage = function (canvas, axeImageString) {
    // log('rotationY, ', config.rotationY)
    // canvas.clear()
    let mesh = AxeMesh.fromAxeImage(axeImageString)
    log('mesh, ', mesh)
    canvas.drawAxeImage(mesh.image)
    //
    canvas.render()
}