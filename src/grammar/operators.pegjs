
Operator
  = xor / and / or / not / inc / dec / add / sub / mul / div / mod / gt / gte / lt / lte / equal / notequal

not = 'not' Spaces target:Value Separator value:Value { return [0x13, target, value]; }

gte = 'gte' { return [0x0a]; }
gt = 'gt' { return [0x09]; }
lte = 'lte' { return [0x0c]; }
lt = 'lt' { return [0x0b]; }
equal = 'equal' { return [0x0d]; }
notequal = 'notequal' { return [0x0e]; }
xor = 'xor' { return [0x10]; }
and = 'and' { return [0x11]; }
or = 'or' { return [0x12]; }
inc = 'inc' { return [0x14]; }
dec = 'dec' { return [0x15]; }
add = 'add' { return [0x16]; }
sub = 'sub' { return [0x17]; }
mul = 'mul' { return [0x18]; }
div = 'div' { return [0x19]; }
mod = 'mod' { return [0x1a]; }
