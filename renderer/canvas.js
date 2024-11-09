class NoahCamera extends NoahObject {
    constructor() {
        super()
        // 镜头在世界坐标系中的坐标
        this.position = NoahVector.new(config.camera_position_x.value, config.camera_position_y.value, config.camera_position_z.value)
        // 镜头看的地方
        this.target = NoahVector.new(config.camera_target_x.value, config.camera_target_y.value, config.camera_target_z.value)
        // 镜头向上的方向
        this.up = NoahVector.new(config.camera_up_x.value, config.camera_up_y.value, config.camera_up_z.value)
    }
}

class NoahCanvas extends NoahObject {
    constructor(selector) {
        super()
        let canvas = _e(selector)
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.w = canvas.width
        this.h = canvas.height
        this.pixels = this.context.getImageData(0, 0, this.w, this.h)
        this.bytesPerPixel = 4
        this.camera = NoahCamera.new()
        this.setupDepth()
        // this.pixelBuffer = this.pixels.data
    }
    render() {
        // 执行这个函数后, 才会实际地把图像画出来
        // ES6 新语法, 取出想要的属性并赋值给变量, 不懂自己搜「ES6 新语法」
        let {pixels, context} = this
        context.putImageData(pixels, 0, 0)
    }
    clear(color=NoahColor.black()) {
        // color NoahColor
        // 用 color 填充整个 canvas
        // 遍历每个像素点, 设置像素点的颜色
        this.setupDepth()
        let {w, h} = this
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                let z = Number.MIN_VALUE
                this._setPixel(x, y, z, color)
            }
        }
        this.render()
    }
    _setPixel(x, y, z, color) {
        // log('x, y, z, color, ', x, y, z, color)
        // color: NoahColor
        // 这个函数用来设置像素点, _ 开头表示这是一个内部函数, 这是我们的约定
        // 浮点转 int
        let int = Math.round
        x = int(x)
        y = int(y)
        // depth 中对应 x y 的值等于 0 或 z 比 depth 中的值大才画点
        let d = this.depths[x][y]
        // log(d, Number.MIN_VALUE, d === z)
        if (d === Number.MIN_VALUE || z < d) {
            this.depths[x][y] = z
            // 用座标算像素下标
            let i = (y * this.w + x) * this.bytesPerPixel
            // 设置像素
            let p = this.pixels.data
            let {r, g, b, a} = color
            // 一个像素 4 字节, 分别表示 r g b a
            p[i] = r
            p[i+1] = g
            p[i+2] = b
            p[i+3] = a
        } else {
            // pass
        }
    }
    drawPoint(point, color=NoahColor.black()) {
        // log('x, y, z, r, g, b, a', point.x, point.y, point.z, color.r, color.g, color.b, color.a)
        // point: NoahVector
        let {w, h} = this
        let p = point
        // log('p, ', p)
        if (color.a === 0) {
            return
        }
        if (p.x >= 0 && p.x <= w) {
            if (p.y >= 0 && p.y <= h) {
                this._setPixel(p.x, p.y, p.z, color)
            }
        }
    }
    __debug_draw_demo() {
        // 这是一个 demo 函数, 用来给你看看如何设置像素
        // ES6 新语法, 取出想要的属性并赋值给变量, 不懂自己搜「ES6 新语法」
        let {context, pixels} = this
        // 获取像素数据, data 是一个数组
        let data = pixels.data
        // log('pixels1, ', pixels)
        // log('data, ', data)
        // 一个像素 4 字节, 分别表示 r g b a
        for (let i = 0; i < data.length; i += 4) {
            let [r, g, b, a] = data.slice(i, i + 4)
            // log('[r, g, b, a], ', [r, g, b, a])
            r = 200
            g = 200
            b = 200
            a = 200
            data[i] = r
            data[i+1] = g
            data[i+2] = b
            data[i+3] = a
        }
        // log('pixels2, ', pixels)
        context.putImageData(pixels, 0, 0)
    }
    drawScanline(v1, v2, angle) {
        let [a, b] = [v1, v2].sort((va, vb) => va.position.x - vb.position.x)
        // log('[a, b], ', [a, b])
        let y = a.position.y
        let int = Math.round
        let x1 = int(a.position.x)
        let x2 = int(b.position.x)
        let ua =  a.u
        let va = a.v
        let ub = b.u
        let vb = b.v
        // let z = a.position.z
        // log('v1, v2, ', v1, v2)
        for (let x = x1; x <= x2; x++) {
            let factor = 0
            if (x2 != x1) {
                factor = (x - x1) / (x2 - x1);
            }
            let u = ua + (ub - ua)  * factor
            let v = va + (vb - va) * factor
            let cx = int((256 - 1) * u)
            let cy = int((256 - 1) * v)
            // log('u, v, ', u, v)
            // log('x, y, ', cx, cy)
            let color = this.mesh.image[cy][cx].color
            let c = this.illumination(color, angle)
            this.drawPoint(NoahVector.new(x, y, a.position.z), c)
        }
    }
    drawTriangle2(v1, v2, v3, angle) {
        let [a, b, c] = [v1, v2, v3]
        let start_y = b.position.y
        let end_y = c.position.y
        for (let y = start_y; y <= end_y; y++) {
            let factor = 0
            if (end_y != start_y) {
                factor = (y - start_y) / (end_y - start_y)
            }
            let va = a.interpolate(c, factor)
            let vb = b.interpolate(c, factor)
            // log('va, vb, ', va, vb)
            this.drawScanline(va, vb, angle)
        }
    }
    drawTriangle1(v1, v2, v3, angle) {
        let [a, b, c] = [v1, v2, v3]
        // log('[a, b, c] 3, ', [a, b, c])
        let start_y = a.position.y
        let end_y = b.position.y
        for (let y = start_y; y <= end_y; y++) {
            let factor = 0
            if (end_y != start_y) {
                factor = (y - start_y) / (end_y - start_y)
            }
            let va = a.interpolate(c, factor)
            let vb = a.interpolate(b, factor)
            // log('va, vb, ', va, vb)
            this.drawScanline(va, vb, angle)
        }
    }
    drawTriangle(v1, v2, v3, angle) {
        let [a, b, c] = [v1, v2, v3].sort((va, vb) => va.position.y - vb.position.y)
        let middle_factor = 0
        if (c.position.y - a.position.y != 0) {
            middle_factor = (b.position.y - a.position.y) / (c.position.y - a.position.y)
        }
        // log('[a, b, c] 2, ', [a, b, c])
        let middle = a.interpolate(c, middle_factor)
        this.drawTriangle1(a, b, middle, angle)
        this.drawTriangle2(middle, b, c, angle)
    }
    drawMesh(mesh) {
        let self = this
        this.mesh = mesh
        // camera
        let {w, h} = this
        let {position, target, up} = self.camera
        // log('position, target, ', position, target)
        let direction = target.sub(position)
        let light = NoahVector.new(config.light_x.value, config.light_y.value, config.light_z.value)
        const view = Matrix.lookAtLH(position, target, up)
        // field of view
        const projection = Matrix.perspectiveFovLH(0.8, w / h, 0.1, 1)
        // 得到 mesh 中点在世界中的标
        const rotation = Matrix.rotation(mesh.rotation)
        const translation = Matrix.translation(mesh.position)
        const world = rotation.multiply(translation)

        const transform = world.multiply(view).multiply(projection)
        //
        for (let t of mesh.triangles) {
            // log('t, ', t)
            //
            let center = centerPoint(t)
            let normal = normalVector(t)
            // log('normal, ', normal)
            // a - b 得到 b 指向 a 的向量
            let line = center.sub(light)
            // log('line, ', line)
            // 夹角
            let angle = IncludedAngle(light, normal)
            let angle2 = IncludedAngle(direction, normal)
            // log('angle2, ', angle2)
            // log('t, ', t)
            // 拿到三角形的三个顶点
            let [a, b, c] = t
            // 拿到屏幕上的 3 个像素点
            let [v1, v2, v3] = [a, b, c].map(v => self.project(v, transform))
            // 把这个三角形画出来
            // log('v1, v2, v3, ', v1, v2, v3)
            if (angle2 <= 0) {
                self.drawTriangle(v1, v2, v3, Math.abs(angle))
            }
            // self.drawLine(v1.position, v2.position)
            // self.drawLine(v1.position, v3.position)
            // self.drawLine(v2.position, v3.position)
        }
    }
    drawAxeImage(axeImage) {
        let {w, h} = this
        // log('w, h,', w, h)
        for (let i = 0; i < axeImage.length; i++) {
            for (let j = 0; j < axeImage[i].length; j++) {
                // log('pixel, ', line[i])
                let p = axeImage[i][j]
                // log('p, ', p)
                if (p.position.x >= 0 && p.position.x <= w) {
                    if (p.position.y >= 0 && p.position.y <= h) {
                        this._setPixel(p.position.x, p.position.y, p.position.z, p.color)
                    }
                }
            }
        }
    }
    illumination(color, angle) {
        // log('vertex, ', vertex)
        let c = color
        let r = c.r * angle
        let g = c.g * angle
        let b = c.b * angle
        let gc = NoahColor.new(r, g, b, c.a)
        return gc
    }
    project(coordVector, transformMatrix) {
        // log('coordVector, ', coordVector)
        let c = coordVector
        let {w, h} = this
        let [w2, h2] = [w/2, h/2]
        let point = transformMatrix.transform(c.position)
        let x = point.x * w2 + w2
        let y = - point.y * h2 + h2
        let z = - point.z * 2 + 2
        let v = NoahVector.new(x, y, z)
        return NoahVertex.new(v, c.color, c.nx, c.ny, c.nz, c.u, c.v)
    }
    drawLine(p1, p2, color=NoahColor.black()) {
        let [x1, y1, z1, x2, y2, z2] = [p1.x, p1.y, p1.z, p2.x, p2.y, p2.z]
        let dx = x2 - x1
        let dy = y2 - y1
        let dz = z2 - z1
        let R = (dx ** 2 + dy ** 2 + dz ** 2) ** 0.5
        let ratio = dx === 0 ? undefined : dy / dx
        let angle = 0
        if (ratio === undefined) {
            const p = Math.PI / 2
            angle = dy >= 0 ? p : -p
        } else {
            const t = Math.abs(dy / R)
            const sin = ratio >= 0 ? t : -t
            const asin = Math.asin(sin)
            angle = dx > 0 ? asin : asin + Math.PI
        }
        for (let r = 0; r <= R; r++) {
            const x = x1 + Math.cos(angle) * r
            const y = y1 + Math.sin(angle) * r
            let z = z1 + (z2 - z1) * (r / R) + 0.0000001
            this.drawPoint(NoahVector.new(x, y, z), color)
        }
    }
    setupDepth() {
        this.depths = []
        for (let i = 0; i <= this.w; i++) {
            this.depths[i] = []
            for (let j = 0; j <= this.h; j++) {
                this.depths[i][j] = Number.MIN_VALUE
            }
        }
    }
}
