
SystemInstruction 'system instruction'
  = halt / restart / sysinfo / debug / dump / noop / yield / print / jump_to / jumpif / delay / DeclareVar

delay
  = 'delay' Spaces delay:IntegerValue { return [OpCodes.Delay, ...delay]; } /
    'sleep' Spaces delay:IntegerValue { return [OpCodes.Sleep, ...delay]; }

halt
  = 'halt' { return [OpCodes.Halt]; }

restart
  = 'restart' { return [OpCodes.Restart]; }

noop
  = 'noop' { return [OpCodes.Noop]; }

jump_to =
  'jump' Spaces 'to' Spaces address:AddressValue { return [OpCodes.JumpTo, ...address]; } /
  'jump' Spaces 'to' Spaces label:Label { return [OpCodes.JumpTo, T.Placeholder.create(label), 0, 0, 0] }

jumpif =
  'if' Spaces condition:Value Spaces 'then' Spaces 'jump' Spaces  'to' Spaces label:Label { return [OpCodes.JumpIf, ...condition, T.Placeholder.create(label), 0, 0, 0] }

yield
  = 'yield' Spaces delay:IntegerValue { return [OpCodes.Yield, ...delay]; }

sysinfo
  = 'sysinfo' { return [OpCodes.SystemInfo]; }

debug
  = 'debug' Spaces byte:Boolean { return [OpCodes.Debug, byte]; }

dump
  = 'dump' { return [OpCodes.Dump]; }

print
  = 'print' Spaces value:Value { return [OpCodes.Print, ...value]; }

Label
  = [a-zA-Z]+ [a-zA-Z0-9_]* { return text() }

DefineLabel
  = '@' label:Label { return T.Reference.create(label); }

DeclareVar
  = 'var' Spaces t:Identifier { return T.DeclareIdentifier.create(t) }
