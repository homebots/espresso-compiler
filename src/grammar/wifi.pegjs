WifiInstruction = WifiConnectInstruction / WifiDisconnectInstruction

WifiConnectInstruction = 'connect' Spaces ssid:StringValue Separator password:(StringValue/NullValue) { return InstructionNode.create('wifiConnect', { ssid, password }) }
WifiDisconnectInstruction = 'disconnect' { return InstructionNode.create('wifiDisconnect') }