# node-red-contrib-tplink-smarthome
[![NPM Version](https://img.shields.io/npm/v/node-red-contrib-tplink-iot.svg?style=flat-square)](https://www.npmjs.com/package/node-red-contrib-tplink-iot) [![Node version](https://img.shields.io/node/v/node-red-contrib-tplink-iot.svg?style=flat-square)](http://nodejs.org/download/) [![NSP Status](https://nodesecurity.io/orgs/dope-pixels/projects/b96f60b2-693e-45ce-94ca-c7372a8494c9/badge?style=flat-square)](https://nodesecurity.io/orgs/dope-pixels/projects/b96f60b2-693e-45ce-94ca-c7372a8494c9) [![CodeFactor](https://www.codefactor.io/repository/github/mental05/node-red-contrib-tplink-smarthome/badge?style=flat-square)](https://www.codefactor.io/repository/github/mental05/node-red-contrib-tplink-smarthome) [![Github All Releases](https://img.shields.io/github/downloads/mental05/node-red-contrib-tplink-iot/total.svg?style=flat-square)](https://github.com/mental05/node-red-contrib-tplink-iot/releases) [![npm](https://img.shields.io/npm/l/node-red-contrib-tplink-iot.svg?style=flat-square)](https://github.com/mental05/node-red-contrib-tplink-iot/blob/master/LICENSE) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)](https://github.com/Felixls/node-red-contrib-tplink-smarthome/issues)

TP-Link Smart Home Node-Red Nodes

This is a collection of [Node-RED](https://nodered.org/) nodes that allow you control smart plugs and bulbs from the TP-Link smart home ecosystem.

This is a fork of so inspiring [node-red-contrib-tplink-smarthome
](https://github.com/Felixls/node-red-contrib-tplink-smarthome) with added functionality.

Under the hood, each node uses the awesome [TP-Link Smart Home API](https://github.com/plasticrake/tplink-smarthome-api).

# Installation

Run the following command in the root directory of your Node-RED install

`$ npm install node-red-contrib-tplink-iot`

or you can use the Palette Manager in Node-RED.

# Parameters

`Name` - Type in the name of the host manually or keep the default device name

`Device IP` - Type in the Device IP address manually or press the button to retreive all locally available plug devices

`Poll interval` - Interval that is used to poll availability of devices *(min 500ms / recommended between 5000ms and 10000ms)*

`Event poll interval` - Interval that is used to poll active devices for events *(min 500ms / recommended between 1000ms and 3000ms)*

# Inputs

## payload: string | boolean

### On/Off

`true` - Turn on the device.

`false` - Turn off the device.

### Brightness

`brightness:[value 1-100]`

*Example: Send payload as `brightness:25` to set brightness of the bulb to 25%.*

### Temperature

`temperature:[value 2700-6500]`

*Example: Send payload as `temperature:5000` to set temperature of the bulb to 5000k.*

### Commands

`getInfo` - Fetch the device information.

`getMeterInfo` - Fetch the current device consumption.

`clearEvents` - Unsubscribe events.

`eraseStats` - Clear all the meter statistics.

### Events

`getMeterEvents` - Subscribe to meter information events.

`getInfoEvents` - Subscribe to information events.

`getPowerUpdateEvents` - Subscribe to power on/off events.

`getInUseEvents` - Subscribe to device usage events.

`getOnlineEvents` - Subscribe to online/offline events.

*Multiple events can be used as a list separated with the `|` character.*

[![https://nodei.co/npm/node-red-contrib-tplink-iot.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/node-red-contrib-tplink-iot.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/node-red-contrib-tplink-iot)
