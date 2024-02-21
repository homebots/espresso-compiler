WifiInstruction = WifiConnectInstruction / WifiDisconnectInstruction

WifiConnectInstruction = 'connect' __ ssid:StringValue Separator password:(StringValue/NullValue) { return InstructionNode.create('wifiConnect', { ssid, password }) }
WifiDisconnectInstruction = 'disconnect' { return InstructionNode.create('wifiDisconnect') }