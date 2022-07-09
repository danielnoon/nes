function toRGB(color: number): [r: number, g: number, b: number] {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  return [r, g, b];
}

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
      const [r, g, b] = toRGB(color);

      const index = i * 4;

      data[index + 0] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = 0xff;
    }

    this.ctx.putImageData(this.imageData, 0, 0);
  }
}
