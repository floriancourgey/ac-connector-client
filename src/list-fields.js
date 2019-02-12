if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
const soap = require('soap');
var jxon = require('jxon');
const ACC = require('ac-connector');

const endpoint = process.env.ACC_ENDPOINT
const wsdl = './wsdl/ac7-8889/xtk_queryDef.wsdl'

var ret = soap.createClientAsync(wsdl, {endpoint : endpoint}).then((client) => {
  var js = {
    queryDef: {
      '$firstRows':"true",
      '$lineCount':"5",
      '$operation':"select",
      '$schema': 'xtk:workflow',
    }
  }
  var args = {};
  args.sessiontoken = process.env.ACC_SESSIONTOKEN;
  args.entity = { $xml: jxon.jsToString(js)}
  args.duplicate = false
  return client.SelectAllAsync(args);
}).then((result) => {
  var fields = [];
  for(var node of result['entity']['queryDef']['select']['node']){
    var field = node['attributes']['expr'];
    fields.push(field);
  }
  console.log(fields);
  return fields;
}).then((fields) => {
  console.log(fields);
});
