# node-red-contrib-tplink-smarthome

TP-Link Smart Home is a collection of node-red nodes that allow you control smart plugs and bulbs from the TP-Link smart home ecosystem.

Under the hood, each node uses the awesome https://github.com/plasticrake/tplink-smarthome-api API library.

# Installation

Run the following command in the root directory of your Node-RED install

`$ npm install node-red-contrib-tplink-smarthome`

or you can use the Palette Manager in Node-RED.

# Parameters

Name: Type in the name of the host manually or keep the default device name

Device IP: Type in the Device IP address manually or press the button to retreive all locally available plug devices

Poll interval: Interval that is used to poll active nodes for changes (min 500ms / recommended between 3000ms and 5000ms)

# Inputs

## payload: string | boolean

### On/Off

true: Turn on the device.

false: Turn off the device.

### Commands

getInfo: Fetch the device information.

getMeterInfo: Fetch the current device consumption.

clearEvents: Unsubscribe events.

eraseStats: Clear all the meter statistics.

### Events

getMeterEvents: Subscribe to meter information events.

getInfoEvents: Subscribe to information events.

getPowerUpdateEvents: Subscribe to power on/off events.

getInUseEvents: Subscribe to device usage events.

getOnlineEvents: Subscribe to online/offline events.

Multiple events can be used as a list separated with the `|` character.