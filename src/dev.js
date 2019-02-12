if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
const fs = require('fs-extra');
const soap = require('soap');
const jxon = require('jxon');
const xml2js = require('xml2js');

const endpoint = process.env.ACC_ENDPOINT
const wsdl = './wsdl/ac7-8889/xtk_queryDef.wsdl'

// process.env.http_proxy = 'http://127.0.0.1:8888'; // for Fiddler

var client = soap.createClientAsync(wsdl, {endpoint : endpoint});
client.then((client) => {
  console.log('Client Success!', client.describe());
  var js = {
    queryDef: {
      '$firstRows':"true",
      '$lineCount':"5",
      '$operation':"select",
      '$schema': 'xtk:workflow',
      select: {
        node: [
          {'$expr': "@label"},
          {'$expr': "@internalName"},
          {'$expr': "data"},
        ]
      },
      where: {
        condition: {'$expr': "@internalName like '%fresh%'"}
      }
    }
  }
  var args = {};
  args.sessiontoken = process.env.ACC_SESSIONTOKEN;
  args.entity = { $xml: jxon.jsToString(js)}
  return client.ExecuteQuery(args, function(err, result){
    if(err){
      console.log('Err', err);
      return;
    }
    // console.log('Success! Request:', client.lastRequest);
    // console.log('Success! Response:', client.lastResponse);
    var workflows = [];
    var _ExecuteQueryResponse = jxon.stringToJs(client.lastResponse)['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ExecuteQueryResponse'];
    _ExecuteQueryResponse = xml2js.parseString(client.lastResponse, function(err, result){
      if(err) throw err;
      console.log(result['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['ExecuteQueryResponse'][0]['pdomOutput']);
      return;
    });
    return;
    // ['SOAP-ENV:Body']['ExecuteQueryResponse'];

    for(var workflow of _ExecuteQueryResponse['pdomOutput']['workflow-collection']['workflow']){
      workflows.push(workflow);
    }
    console.log(workflows[0]);

    // write
    for (workflow of workflows) {
      var name = workflow['$internalName'].replace(/[\:\/\\]/g, '_');
      var namespace = '_workflow';
      var content = jxon.jsToString(workflow);
      console.log('   Saving '+namespace+' '+name+' to '+path);
      console.log('   with content:', content);
      fs.outputFileSync(path, content, function (err) {
        if(err) console.log(err); // => null
      });
    }
    return workflows;
  });
})
