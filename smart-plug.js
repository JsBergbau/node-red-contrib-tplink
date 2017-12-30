module.exports = function(RED) {
  const { Client } = require('tplink-smarthome-api');

  function SmartPlugNode(config) {
    RED.nodes.createNode(this, config);

    this.config = {
			name: config.name,
			device: config.device,
			interval: config.interval
    };

    const deviceIP = this.config.device;
    const moment = require('moment');
    const numeral = require('numeral');
		const context = this.context();
    const node = this;
    let deviceInstance = null;

    if (deviceIP === null || deviceIP === '') {
      node.status({fill: 'red', shape: 'ring', text: 'not configured'});
			return false;
    }

    node.status({fill: 'grey', shape: 'dot', text: 'initializing…'});

    const client = new Client();
    client.getDevice({
      host: deviceIP
    })
    .then((device) => {
      deviceInstance = device;
      device.startPolling(parseInt(node.config.interval));
      node.status({fill: 'green', shape: 'dot', text: 'connected'});
      device.on('power-on', () => {
        node.sendPowerUpdateEvent(true);
      });
      device.on('power-off', () => {
        node.sendPowerUpdateEvent(false);
      });
      device.on('in-use', () => {
        node.sendInUseEvent(true);
      });
      device.on('not-in-use', () => {
        node.sendInUseEvent(false);
      });
      device.on('device-online', () => {
        node.sendDeviceOnlineEvent(true);
      });
      device.on('device-offline', () => {
        node.sendDeviceOnlineEvent(false);
      });
    })
    .catch(error => {
      node.error(error);
      node.status({fill: 'red', shape: 'ring', text: 'not reachable'});
    });

    node.recheck = setInterval(function() {
      if (deviceInstance === null) {
        node.error('not reachable');
        node.status({fill: 'red', shape: 'ring', text: 'not reachable'});
        return false;
      }
      if (node.checkAction('getInfoEvents')) {
        node.sendDeviceSysInfo(deviceInstance);
      }
      if (node.checkAction('getMeterEvents')) {
        node.sendDeviceMeterInfo(deviceInstance);
      }
    }, parseInt(node.config.interval));

    node.on('input', function(msg) {
      if (deviceInstance === null) {
        node.error('not reachable');
        node.status({fill: 'red', shape: 'ring', text: 'not reachable'});
        return false;
      }

      const EVENT_ACTIONS = ['getMeterEvents', 'getInfoEvents', 'getPowerUpdateEvents', 'getInUseEvents', 'getOnlineEvents'];

      // Simple turn on / turn off
      if(msg.payload == true || msg.payload == false) {
        deviceInstance.setPowerState(msg.payload).then(() => {
          node.sendDeviceSysInfo(deviceInstance);
        })
        .catch(error => {
          node.error(error);
          node.status({fill: 'red', shape: 'ring', text: 'not reachable'});
          return false;
        });
      } else if (msg.payload === 'getInfo') {
        node.sendDeviceSysInfo(deviceInstance);
      } else if (msg.payload === 'getMeterInfo') {
        node.sendDeviceMeterInfo(deviceInstance);
      } else if (msg.payload === 'clearEvents') {
        context.set('action', msg.payload);
      } else if (msg.payload === 'eraseStats') {
        node.sendEraseStatsResult(deviceInstance);
      } else {
        const actions = msg.payload.split('|');
        let enabledActions = [];
        actions.forEach(action => {
          if (EVENT_ACTIONS.indexOf(action) !== -1) {
            enabledActions.push(action);
          }
        });
        if (enabledActions.length > 0) {
          context.set('action', enabledActions.join('|'));
        } else {
          context.set('action', '');
        }
      }
    });

    node.checkAction = function (action) {
      return context.get('action') !== undefined &&
        context.get('action') !== null &&
        context.get('action').includes(action);
    };

    node.sendDeviceSysInfo = function (device) {
      device.getSysInfo().then(info => {
        if (info.relay_state === 1) {
          context.set('state', 'on');
          node.status({fill: 'yellow', shape: 'dot', text: 'turned on'});
        } else {
          context.set('state', 'off');
          node.status({fill: 'green', shape: 'dot', text: 'turned off'});
        }
        let msg = {};
        msg.payload = info;
        msg.payload.timestamp = moment().format();
        node.send(msg);
      });
    };

    node.sendDeviceMeterInfo = function (device) {
      device.emeter.getRealtime().then(info => {
        const state = context.get('state') === 'on' ? 'turned on': 'turned off';
        const current = numeral(info.current).format('0.[000]');
        const voltage = numeral(info.voltage).format('0.[0]');
        const power = numeral(info.power).format('0.[00]');
        node.status({fill: 'yellow', shape: 'dot', text: `${state} [${power}W: ${voltage}V@${current}A]`});
        const msg = {};
        msg.payload = info;
        msg.payload.timestamp = moment().format();
        node.send(msg);
      });
    };

    node.sendPowerUpdateEvent = function (powerOn) {
      if (node.checkAction('getPowerUpdateEvents')) {
        let msg = {};
        msg.payload = {};
        msg.payload.powerOn = powerOn;
        msg.payload.timestamp = moment().format();
        node.send(msg);
      }
    };

    node.sendInUseEvent = function (inUse) {
      if (node.checkAction('getInUseEvents')) {
        let msg = {};
        msg.payload = {};
        msg.payload.inUse = inUse;
        msg.payload.timestamp = moment().format();
        node.send(msg);
      }
    };

    node.sendDeviceOnlineEvent = function (online) {
      if (node.checkAction('getOnlineEvents')) {
        let msg = {};
        msg.payload = {};
        msg.payload.online = online;
        msg.payload.timestamp = moment().format();
        node.send(msg);
      }
    };

    node.sendEraseStatsResult = function (device) {
      device.emeter.eraseStats({}).then((result) => {
        const msg = {};
        msg.payload = result;
        node.send(msg);
      });
    };

    node.on('close', function() {
			clearInterval(node.recheck);
		});
  }
  RED.nodes.registerType('smart-plug', SmartPlugNode);

  RED.httpAdmin.get('/smarthome/plugs', (req, res) => {
    try {
      const client = new Client();
      let discoveryTimeout = 10000;
      let devices = [];
      client.on('device-new', device => {
        devices.push(device.host);
      });
      client.startDiscovery({deviceTypes: ['plug']});
      setTimeout(() => {
        client.stopDiscovery();
        res.end(JSON.stringify(devices));
      }, discoveryTimeout);
    } catch (error) {
      res.send(500).send(error.message);
    }
  });

  RED.httpAdmin.get('/smarthome/plug', (req, res) => {
    if (!req.query.ip) {
      return res.status(500).send('Missing Device IP…');
    }
    const client = new Client();
    client.getDevice({
      host: req.query.ip
    })
    .then(device => {
      res.end(device.model);
    })
    .catch(error => {
      res.send(500).send(error.message);
    });
  });

};