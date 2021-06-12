SystemInstruction
  = halt / restart / sysinfo / debug / dump / noop / yield / print / jump / jumpif / delay_v / delay / sleep

halt "halt" = 'halt' { return [0xfe]; }
restart = 'restart' { return [0xfc]; }
sysinfo = 'sysinfo' { return [0xfd]; }
debug = 'debug' { return [0xfb]; }
dump = 'dump' { return [0xf9]; }
noop = 'noop' { return [0x01]; }
yield = 'yield' { return [0xfa]; }
print = 'print' { return [0x03]; }
jump = 'jump' Spaces a:Address { return [0x04, a]; } / 'jump to' Spaces t:Label { return [0x04, _.getLabel(t)] }
jumpif = 'jumpif' { return [0x0f]; }
delay = 'delay' Spaces delay:Integer { return [0x02, ..._.toInt32(delay)]; }
delay_v = 'delay_v' { return [0x1c]; }
sleep = 'sleep' { return [0x3f]; }
