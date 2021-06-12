
MemoryInstruction
  = memget / memset / push_b / push_i / copy

memget = 'memget' { return [0x05]; }
memset = 'memset' { return [0x06]; }
push_b = 'push_b' { return [0x07]; }
push_i = 'push_i' { return [0x08]; }
copy = 'copy' { return [0x1b]; }
