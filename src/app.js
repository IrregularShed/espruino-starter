import { Wifi } from './lib/wifi.js';

let times = 0;

class App {
  constructor(opts) {
    console.log('environment', process.env);
    this.opts = opts;
    this.wifi = new Wifi(opts.wifi);
  }

  init() {
    this.wifi.on('connected', () => {
      this.online();
    });
    this.wifi.on('disconnected', () => {
      this.offline();
    });
    this.wifi.connect(); // get connection started
  }

  async online() {
    console.log('application online at', this.wifi.status.ip);
    times++;
    if (times < 4) {
      setTimeout(async () => {
        console.log('---------------- manually disconnect/reconnect test --------------', times);
        await this.wifi.disconnect();
      }, 5000);
    } else console.log('done disconnect trial of 3 times');
  }

  offline() {
    console.log('application offline');
  }
}

export default App;
export { App };
