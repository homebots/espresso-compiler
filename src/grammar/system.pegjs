SystemInstruction 'system instruction'
  = halt / restart / sysinfo / debug / dump / noop / yield / print / jump_to / jumpif / delay / DeclareVar

delay
  = 'delay' Spaces delay:IntegerValue { return [0x02, ...delay]; } /
  'sleep' Spaces delay:IntegerValue { return [0x3f, ...delay]; }

halt
  = 'halt' { return [0xfe]; }

restart
  = 'restart' { return [0xfc]; }

noop
  = 'noop' { return [0x01]; }

jump_to =
  'jump' Spaces 'to' Spaces address:AddressValue { return [0x04, ...address]; } /
  'jump' Spaces 'to' Spaces t:Label { return [0x04, _.createPlaceholder(t), 0x00, 0x00, 0x00] }

jumpif =
  'if' Spaces condition:Value Spaces 'then' Spaces 'jump' Spaces  'to' Spaces label:Label { return [0x0f, ...condition, _.createPlaceholder(label), 0x00, 0x00, 0x00] }

yield
  = 'yield' Spaces delay:IntegerValue { return [0xfa, ...delay]; }

sysinfo
  = 'sysinfo' { return [0xfd]; }

debug
  = 'debug' Spaces byte:Boolean { return [0xfb, byte]; }

dump
  = 'dump' { return [0xf9]; }

print
  = 'print' Spaces value:Value { return [0x03, ...value]; }

Label
  = [a-zA-Z]+ [a-zA-Z0-9_]* { return text() }

DefineLabel
  = '@' label:Label { return _.createReference(label); }

DeclareVar
  = 'var' Spaces t:Identifier { return t }