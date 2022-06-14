export class Renderer {
  imageData: ImageData;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private framebuffer: Uint32Array
  ) {
    this.imageData = ctx.getImageData(0, 0, 256, 240);
  }

  render() {
    const data = this.imageData.data;

    for (let i = 0; i < this.framebuffer.length; i++) {
      const color = this.framebuffer[i];
      const index = i * 4;

      data[index + 0] = color & 0xff;
      data[index + 1] = (color >> 5) & 0xff;
      data[index + 2] = (color >> 10) & 0xff;
      data[index + 3] = 0xff;
    }

    this.ctx.putImageData(this.imageData, 0, 0);
  }
}
