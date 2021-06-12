
WifiInstruction
  = wificonnect / wifidisconnect / wifistatus / wifilist

wificonnect = 'net connect' { return [0x3a]; }
wifidisconnect = 'net disconnect' { return [0x3b]; }
wifistatus = 'net status' { return [0x3c]; }
wifilist = 'wifilist' { return [0x3e]; }
