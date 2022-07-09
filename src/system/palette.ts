const palette: Record<number, number> = {
  0x00: 0x757575,
  0x01: 0x271b8f,
  0x02: 0x0000ab,
  0x03: 0x47009f,
  0x04: 0x8f0077,
  0x05: 0xab0013,
  0x06: 0xa70000,
  0x07: 0x7f0b00,
  0x08: 0x432f00,
  0x09: 0x004700,
  0x0a: 0x005100,
  0x0b: 0x003f17,
  0x0c: 0x1b3f5f,
  0x0d: 0x000000,
  0x0e: 0x000000,
  0x0f: 0x000000,
  0x10: 0xbcbcbc,
  0x11: 0x0073ef,
  0x12: 0x233bef,
  0x13: 0x8300f3,
  0x14: 0xbf00bf,
  0x15: 0xe7005b,
  0x16: 0xdb2b00,
  0x17: 0xcb4f0f,
  0x18: 0x8b7300,
  0x19: 0x009700,
  0x1a: 0x00ab00,
  0x1b: 0x00933b,
  0x1c: 0x00838b,
  0x1d: 0x000000,
  0x1e: 0x000000,
  0x1f: 0x000000,
  0x20: 0xffffff,
  0x21: 0x3fbfff,
  0x22: 0x5f97ff,
  0x23: 0xa78bfd,
  0x24: 0xf77bff,
  0x25: 0xff77b7,
  0x26: 0xff7763,
  0x27: 0xff9b3b,
  0x28: 0xf3bf3f,
  0x29: 0x83d313,
  0x2a: 0x4fdf4b,
  0x2b: 0x58f898,
  0x2c: 0x00ebdb,
  0x2d: 0x000000,
  0x2e: 0x000000,
  0x2f: 0x000000,
  0x30: 0xffffff,
  0x31: 0xabe7ff,
  0x32: 0xc7d7ff,
  0x33: 0xd7cbff,
  0x34: 0xffc7ff,
  0x35: 0xffc7db,
  0x36: 0xffbfb3,
  0x37: 0xffdbab,
  0x38: 0xffe7a3,
  0x39: 0xe3ffa3,
  0x3a: 0xabf3bf,
  0x3b: 0xb3ffcf,
  0x3c: 0x9ffff3,
  0x3d: 0x000000,
  0x3e: 0x000000,
  0x3f: 0x000000,
};

export default palette;

export function getColor(color: number): number {
  return palette[color];
}
