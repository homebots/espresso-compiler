
Operator
  = xor / and / or / not / inc / dec / add / sub / mul / div / mod / gt / gte / lt / lte / equal / notequal

ASSIGN = '='

not = 'not' Spaces target:IdentifierValue Separator value:Value { return [0x13, ...target, ...value]; }
inc = 'inc' Spaces id:IdentifierValue { return [OpCodes.Inc, ...id]; }
dec = 'dec' Spaces id:IdentifierValue { return [OpCodes.Dec, ...id]; }

gte =      target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces '>=' Spaces b:Value { return [OpCodes.Gte, ...target, ...a, ...b]; }
gt =       target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces '>' Spaces b:Value { return [OpCodes.Gt, ...target, ...a, ...b]; }
lte =      target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces '<=' Spaces b:Value { return [OpCodes.Lte, ...target, ...a, ...b]; }
lt =       target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces '<' Spaces b:Value { return [OpCodes.Lt, ...target, ...a, ...b]; }
equal =    target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces '==' Spaces b:Value { return [OpCodes.Equal, ...target, ...a, ...b]; }
notequal = target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces '!=' Spaces b:Value { return [OpCodes.NotEqual, ...target, ...a, ...b]; }

xor =      target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces 'xor' Spaces b:Value { return [OpCodes.Xor, ...target, ...a, ...b]; }
and =      target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces 'and' Spaces b:Value { return [OpCodes.And, ...target, ...a, ...b]; }
or =       target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces 'or' Spaces b:Value { return [OpCodes.Or, ...target, ...a, ...b]; }

add =      target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces '+' Spaces b:Value { return [OpCodes.Add, ...target, ...a, ...b]; }
sub =      target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces '-' Spaces b:Value { return [OpCodes.Sub, ...target, ...a, ...b]; }
mul =      target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces '*' Spaces b:Value { return [OpCodes.Mul, ...target, ...a, ...b]; }
div =      target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces '/' Spaces b:Value { return [OpCodes.Div, ...target, ...a, ...b]; }
mod =      target:IdentifierValue Spaces ASSIGN Spaces a:Value Spaces '%' Spaces b:Value { return [OpCodes.Mod, ...target, ...a, ...b]; }
