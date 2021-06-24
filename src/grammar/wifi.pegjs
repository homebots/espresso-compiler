
WifiInstruction
  = wificonnect / wifidisconnect / wifistatus / wifilist

wificonnect = 'net connect' net:StringValue Separator pwd:StringValue { return [0x3a, ...net, ...pwd]; }
wifidisconnect = 'net disconnect' { return [0x3b]; }
wifistatus = 'net status' { return [0x3c]; }
wifilist = 'net list' { return [0x3e]; }
