import JsonRpcClient from './RpcClient/JsonRpcClient';
WebSocket
const tmpClient = new JsonRpcClient();
const gidArray = [];
// const q = new WebSocket('');
// (async () => {
//   let res = await tmpClient.addUri([
//     'https://github.com/aria2/aria2/releases/download/release-1.35.0/aria2-1.35.0-aarch64-linux-android-build1.zip'], { dir: './' }, 2);
//   let tmp = await res.json();
//   gidArray.push(tmp.result);
//   console.log(tmp);
//   res = await tmpClient.pause(tmp.result);
//   tmp = await res.json();
//   console.log(tmp);
//   res = await tmpClient.pause(tmp.result);
//   tmp = await res.json();
//   console.log(tmp);
// })();

(async () => {
  let res;
  let tmp;
  res = await tmpClient.tellStopped(0, 2);
  tmp = await res.json();
  console.log(tmp);
  res = await tmpClient.tellWaiting(0, 2);
  tmp = await res.json();
  console.log(tmp);
})();


/**
 * json.error
 * {
 *   code: number, message:string,
 * }
 */

// tmpClient.listMethods().then(async (res) => {
//     const tmp = await res.json();
//     const methodsArray: string[] = tmp.result;
//     const resultArray: string[] = [];
//     const methodsFunctionArray:  Array<string|undefined> = [];
//     methodsArray.forEach((s) => {
//         methodsFunctionArray.push(s.split('.').pop());
//         resultArray.push(s.split('.').pop() + "(){");
//         resultArray.push(`return this._methodSend("${s}");`);
//         resultArray.push("}");
//     });
//     console.log(resultArray.join('\n'));
//     console.log(methodsFunctionArray.join("\"|\""))
// }).catch((err) => {
//     console.log(err);
// })

// tmpClient.send({
//     requestInit: {
//         body: JSON.stringify({
//             'method': 'system.listMethods',
//             'id': 'qwer'
//         })
//     }
// }).then(async (res) => {
//     const tmp = await res.json();
//     const methodsArray: string[] = tmp.result;
//     const resultArray: string[] = [];
//     const methodsFunctionArray:  Array<string|undefined> = [];
//     methodsArray.forEach((s) => {
//         methodsFunctionArray.push(s.split('.').pop());
//         resultArray.push(s.split('.').pop() + "(){");
//         resultArray.push(`return this._methodSend("${s}");`);
//         resultArray.push("}");
//     });
//     console.log(resultArray.join('\n'));
//     console.log(methodsFunctionArray.join("\"|\""))
// }).catch((err) => {
//     console.log(err);
// })
