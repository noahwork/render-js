class AxeMesh extends NoahObject {
    // 表示三维物体的类
    constructor() {
        super()

        this.position = NoahVector.new(0, 0, 0)
        this.rotation = NoahVector.new(0, 0, 0)
    }
    static fromNoah3D(axe3dString) {
        let lines = axe3dString.split('\n')
        let plines = lines.slice(4, 4042+4)
        let tlines = lines.slice(4042+4, -1)
        let points = takePoint(plines)
        let triangles = punctuate(tlines, points)
        let m = this.new()
        m.triangles = triangles
        return m
    }
    // static fromAxeImage(axeImageString) {
    //     let pixels = []
    //     //
    //     let lines = axeImageString.split('\n')
    //     let colors = lines.slice(4)
    //     log('colors, ', colors)
    //     for (let i = 0; i < colors.length; i++) {
    //         if (colors[i].length > 0) {
    //             let pixelString = colors[i].split('#')
    //             // let pixelOfLine = linePicker(pixelString, i)
    //             log('pixelString, ', pixelString)
    //             // pixels.push(pixelOfLine)
    //         }
    //     }
    //     let m = this.new()
    //     log('image, ', pixels)
    //     m.image = pixels
    //     return m
    // }
    static fromAxeImage(axeImageString) {
        let pixels = []
        //
        for (let i = 0; i < 256; i++) {
            let pixelOfLine = []
            for (let j = 0; j < 256; j++) {
                let color = NoahColor.white()
                let x = i
                let y = j
                let z = 0
                let vposition = NoahVector.new(x, y, z)
                let p = NoahPixel.new(vposition, color)
                pixelOfLine.push(p)
            }
            pixels.push(pixelOfLine)
        }
        let m = this.new()
        // log('image, ', pixels)
        m.image = pixels
        return m
    }
    matchImage() {
        let ts = []
        for (let i = 0; i < this.triangles.length; i++) {
            let t = this.triangles[i]
            let ps = []
            for (let j = 0; j < t.length; j++) {
                let v = t[j]
                let vertex = matchColor(v, this.image)
                ps.push(vertex)
            }
            ts.push(ps)
        }
        // log('ts, ', ts)
        this.triangles = ts
    }
}