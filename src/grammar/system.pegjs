SystemInstruction
  = halt / restart / sysinfo / debug / dump / noop / yield / print / jump_to / jumpif / delay / sleep

delay = 'delay' Spaces delay:Integer { return [0x02, ..._.numberToInt32(delay)]; }
halt "halt" = 'halt' { return [0xfe]; }
restart = 'restart' { return [0xfc]; }
noop = 'noop' { return [0x01]; }
sleep = 'sleep' Spaces delay:Integer { return [0x3f, ..._.numberToInt32(delay)]; }

jump_to =
  'jump to' Spaces address:Address { return [0x04, ..._.numberToInt32(address)]; } /
  'jump to' Spaces t:Label { return [0x04, _.createPlaceholder(t), 0x00, 0x00, 0x00] }

// --

jumpif = 'jumpif' { return [0x0f]; }
yield = 'yield' { return [0xfa]; }
sysinfo = 'sysinfo' { return [0xfd]; }
debug = 'debug' { return [0xfb]; }
dump = 'dump' { return [0xf9]; }
print = 'print' { return [0x03]; }

Label "label"
  = [a-zA-Z]+ [a-zA-Z0-9_]* { return text() }

DefineTag "new label"
  = '@' label:Label { return _.createReference(label); }
