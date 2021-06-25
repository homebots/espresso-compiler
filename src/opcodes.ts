export const OpCodes = {
  Noop: 0x01,
  Delay: 0x02,
  Sleep: 0x3f,
  JumpTo: 0x04,
  JumpIf: 0x0f,
  Yield: 0xfa,
  Debug: 0xfb,
  Dump: 0xf9,
  Print: 0x03,
  Restart: 0xfc,
  SystemInfo: 0xfd,
  Halt: 0xfe,
};