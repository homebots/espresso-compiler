I2cInstruction
  = i2setup / i2start / i2stop / i2write / i2read / i2setack / i2getack / i2find / i2writeack / i2writeack_b

i2setup = 'i2setup' { return [0x40]; }
i2start = 'i2start' { return [0x41]; }
i2stop = 'i2stop' { return [0x42]; }
i2write = 'i2write' { return [0x43]; }
i2read = 'i2read' { return [0x44]; }
i2setack = 'i2setack' { return [0x45]; }
i2getack = 'i2getack' { return [0x46]; }
i2find = 'i2find' { return [0x48]; }
i2writeack = 'i2writeack' { return [0x49]; }
i2writeack_b = 'i2writeack_b' { return [0x4a]; }
