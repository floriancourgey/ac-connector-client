if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
const fs = require('fs-extra');
const soap = require('soap');
const jxon = require('jxon');
const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser({explicitArray: false});
const xmlBuilder = new xml2js.Builder();

const endpoint = process.env.ACC_ENDPOINT
const wsdl = './wsdl/ac7-8889/xtk_queryDef.wsdl'

// process.env.http_proxy = 'http://127.0.0.1:8888'; // for Fiddler

var client = soap.createClientAsync(wsdl, {endpoint : endpoint});
client.then((client) => {
  console.log('Client Success!', client.describe());
  var js = {
    queryDef: {
      '$firstRows':"true",
      // '$lineCount':"5",
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
        condition: {'$expr': '@builtIn = 0'},
        condition: {'$expr': '@label NOT LIKE \'%Copy of%\''},
        condition: {'$expr': '@label NOT LIKE \'%Backup%\''},
        condition: {'$expr': '@label NOT LIKE \'%Sandbox%\''},
        // condition: {'$expr': "@internalName like '%fresh%'"},
        // condition: {'$expr': "@internalName like 'myWorkflow1'"},
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
    // var _ExecuteQueryResponse = jxon.stringToJs(client.lastResponse)['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ExecuteQueryResponse'];

    var _ExecuteQueryResponse = xmlParser.parseString(client.lastResponse, function(err, result){
      if(err) throw err;
      // console.log(client.lastResponse);
      var collection = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ExecuteQueryResponse']['pdomOutput']['workflow-collection']['workflow'];
      // if only 1 result, wrap it in an array
      if(!collection.length){
        collection = [collection];
      }
      for(var workflow of collection){
        workflows.push(workflow);
      }
      console.log(workflows[0]);

      // write
      for (workflow of workflows) {
        var name = workflow['$']['internalName'].replace(/[\:\/\\]/g, '_');
        var namespace = '_workflow';
        var path = 'download/'+namespace+'/'+name+'.js';
        // var content = jxon.jsToString(workflow);
        var content = xmlBuilder.buildObject(workflow);
        console.log('   Saving '+namespace+' '+name+' to '+path);
        // console.log('   with content:', content);
        fs.outputFileSync(path, content, function (err) {
          if(err) console.log(err); // => null
        });
      }
      return workflows;
      return;
    });
    return;

    // ['SOAP-ENV:Body']['ExecuteQueryResponse'];


  });
})
