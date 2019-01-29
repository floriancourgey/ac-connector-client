const fs = require('fs-extra');
var jxon = require('jxon');
var ACC = require('ac-connector');
var ACCLogManager = ACC.ACCLogManager;
var xtkQueryDef = ACC.xtkQueryDef;

var login = ACCLogManager.getLogin('My Connection Name');

var queryDef = new xtkQueryDef({ 'accLogin' : login });
/*
var soap =
  '<query operation="select" schema="nms:recipient">'+
    '<select><node expr="@id"/></select>'+
    '<where><condition expr="@email=\'email@email.com\'"/></where>'+
  '</query>';
var request = queryDef.ExecuteQuery(soap);
request.then( (result) => {
  // console.log('result:', result);
  var recipients = result['recipient-collection']['recipient'];
  console.log(recipients.length+' recipients found:', recipients);
}).catch( (e) => {console.log('Error ! ', e );});
*/

/*
var soap =
  '<query operation="select" schema="xtk:javascript">'+
    '<select><node expr="@namespace"/><node expr="@name"/><node expr="data"/></select>'+
    '<where><condition expr="@namespace=\'nms\'"/></where>'+
  '</query>';
var request = queryDef.ExecuteQuery(soap);
request.then( (result) => {
  console.log('result:', result);
  var recipients = result['javascript-collection']['javascript'];
  console.log(recipients.length+' JS files found:', recipients);
}).catch( (e) => {console.log('Error ! ', e );});
*/

var soap =
  '<query operation="select" schema="xtk:jssp">'+
    '<select><node expr="@namespace"/><node expr="@name"/><node expr="data"/></select>'+
    '<where><condition expr="@namespace=\'acx\'"/></where>'+
  '</query>';
// var soap =
var js = {
  query: {
    select: {
      node: [
        { '$expr': '@namespace' },
        { '$expr': '@name' },
        { '$expr': 'data' }
      ]
    },
    where: {
      // condition: { '$expr': '@namespace=\'acx\'' }
    },
    '$operation': 'select',
    '$schema': 'xtk:jssp'
  }
};
// console.log(jxon.stringToJs(soap));
// return;
var request = queryDef.ExecuteQuery(jxon.jsToString(js));
request.then( (result) => {
  console.log('Success!');
  // console.log('result:', result);
  var objects = result['jssp-collection']['jssp'];
  console.log(objects.length+' JS files found:');
  for(var object of objects){
    var name = object['attributes']['name'].replace(/[\:\/\\]/g, '_');
    var namespace = object['attributes']['namespace'].replace(/[\:\/\\]/g, '_');
    console.log(' - '+namespace+' '+name);
    var path = "download/xtk_jssp/"+namespace+'/'+name;
    var content = objects[0].data;
    fs.outputFile(path, content, function (err) {
      if(err) console.log(err); // => null
    });
  }
}).catch( (e) => {console.log('Error ! ', e );});
