class NoahVertex extends NoahObject {
    // 表示顶点的类, 包含 NoahVector 和 NoahColor
    // 表示了一个坐标和一个颜色
    constructor(position, color, nx, ny, nz, u, v) {
        super()
        this.position = position
        this.color = color
        this.nx = nx
        this.ny = ny
        this.nz = nz
        this.u = u
        this.v = v
    }
    interpolate(other, factor) {
        let a = this
        let b = other
        let p = a.position.interpolate(b.position, factor)
        let c = a.color.interpolate(b.color, factor)
        let u = a.u + (b.u - a.u) * factor
        let v = a.v + (b.v - a.v) * factor
        return NoahVertex.new(p, c, this.nx, this.ny, this.nz, u, v)
    }
}
