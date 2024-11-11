软件渲染器
=========

![demo](gif/ilidan_light.gif)

功能
--------
 - 基于计算机图形学原理，从底层实现光栅化渲染器（Rasterize Render），实现绘制2D图形及3D模型的功能 实现从物体空间、世界空间、相机观察，最终到屏幕空间的图形渲染。
 - 实现顶点着色器（vertex shader）、片面着色器（fragment shader），并基于此实现模型的UV纹理 贴图，法向量贴图 实现像素深度检测（z-buffer），能很好的模拟出模型遮挡效果，实现常见的光照模型，能很好的模拟出光照效果。
 - 实现背面剔除算法，提高模型渲染速度。

反馈
-------------
 - 现在就在[issue](https://github.com/noahwork/render/issues)中提问。
