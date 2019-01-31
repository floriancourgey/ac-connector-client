const soap = require('soap');
var jxon = require('jxon');
const ACC = require('ac-connector');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

// const ACCLogManager = ACC.ACCLogManager;
// const accLogin = ACC.ACCLogManager.getLogin('My Connection Name');
// if( !accLogin.isLoginRequested() )
//   accLogin.login();
//
// accLogin.getLoginPromise().resolve();
// console.log('accLogin', accLogin);

const endpoint = process.env.ACC_ENDPOINT
const wsdl = './wsdl/ac7-8889/xtk_queryDef.wsdl'

soap.createClient(wsdl, {endpoint : endpoint}, function(err, client) {
  var js = {
    queryDef: {
      '$firstRows':"true",
      '$lineCount':"1",
      '$operation':"select",
      '$schema': 'nms:recipient'
    }
  }
  var args = {};
  args.sessiontoken = process.env.ACC_SESSIONTOKEN;
  // args.sessiontoken = accLogin.sessionToken;
  args.entity = { $xml: jxon.jsToString(js)}
  args.duplicate = false
  // var req = queryDef.SelectAll();
  client.SelectAll(args, function(err2, result){
    if(err2){
      console.log('>>err2', err2, 'err2<<');
      return;
    }
    for(var node of result['entity']['queryDef']['select']['node']){
      console.log(node['attributes']['expr']);
    }
  });
});
