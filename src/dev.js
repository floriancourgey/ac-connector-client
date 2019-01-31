if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
const soap = require('soap');
var jxon = require('jxon');
const ACC = require('ac-connector');

const endpoint = process.env.ACC_ENDPOINT
const wsdl = './wsdl/ac7-8889/xtk_queryDef.wsdl'

soap.createClient(wsdl, {endpoint : endpoint}, function(err, client) {
  if(err){
    console.log('soap.createClient error:', err);
    return;
  }
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
  args.entity = { $xml: jxon.jsToString(js)}
  args.duplicate = false
  client.SelectAll(args, function(err, result){
    if(err){
      console.log('client.SelectAll error:', err);
      return;
    }
    for(var node of result['entity']['queryDef']['select']['node']){
      console.log(node['attributes']['expr']);
    }
  });
});
