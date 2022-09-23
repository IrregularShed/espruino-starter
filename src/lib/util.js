import to from 'await-to-js';

function promisify(f, opts = {}) {
  return function () {
    // return a wrapper-function
    let args = [],
      len = arguments.length;
    while (len--) args[len] = arguments[len];
    return new Promise((resolve, reject) => {
      function callback(err, result) {
        if (opts.noReturn) {
          resolve();
          return;
        }
        if (opts.errorFirst) {
          if (err) opts.resolveOnly ? resolve(err) : reject(err);
          else resolve(result);
        } else {
          // non null err here is actually the result as this is not an error first callback
          if (!err) opts.resolveOnly ? resolve('error') : reject('null=error');
          else resolve(err);
        }
      }
      args.push(callback); // append our custom callback to the end of f arguments
      f.apply(this, args); // call the original function
    });
  };
}

async function promisfyTest(r = false, errorFirst) {
  function necb(r, cb) {
    setTimeout(() => {
      return cb(r ? 'result' : null);
    }, 1000);
  }

  function efcb(r, cb) {
    setTimeout(() => {
      return r ? cb(null, 'result') : cb('error', null);
    }, 1000);
  }

  let pifyFunc = promisify(errorFirst ? efcb : necb, errorFirst);

  let [err, res] = await to(pifyFunc(r));
  if (err) {
    console.log('rejected error', err);
  } else console.log('resolved', res);
  return true;
}

async function rAwait(prom) {
  // Will catch error and resolve instead of reject
  let [err, res] = await to(prom(...arguments));
  if (err) return err;
  else return res;
}

function isIP(str) {
  return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(
    str
  );
}

export { isIP, promisify, to, rAwait, promisfyTest };
