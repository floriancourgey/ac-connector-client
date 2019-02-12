const arg = require('arg');
const fs = require('fs-extra');
var jxon = require('jxon');
var ACC = require('ac-connector');
var ACCLogManager = ACC.ACCLogManager;
var xtkQueryDef = ACC.xtkQueryDef;

var login = ACCLogManager.getLogin('My Connection Name');
var queryDef = new xtkQueryDef({'accLogin' : login});

const args = arg({
  '--schema': String,
  '--download': Boolean,
  '--limit': Number,
}, options = {permissive: false});
if(!args['--schema']){
  args['--schema'] = 'xtk:schema';
}
if(!args['--limit']){
  args['--limit'] = 15;
}

function request(schema, limit){
  var obj_namespace = schema.split(':')[0];
  var obj_name = schema.split(':')[1];

  console.log('Requesting object "'+obj_name+'" of namespace "'+obj_namespace+'"' );

  var js = {
    query: {
      '$operation': 'select',
      '$schema': schema,
      '$lineCount': limit,
      select: {
        node: [
          {'$expr': "data"},
          // {'$expr': "@created"},
      //     {'$expr': "@lastModified"}
        ]
      },
    },
  };
  var req = queryDef.ExecuteQuery(jxon.jsToString(js));
  // var req = queryDef.SelectAll(jxon.jsToString(js));
  req.then( (result) => {
    console.log('Success!');
    // console.log(result);
    var objects = result[obj_name+'-collection'][obj_name];
    console.log(objects.length+' '+schema+' files found.');
    if(objects.length < 1){
      return;
    }
    // console.log(objects);
    console.log(objects[0]);
    console.log('Object keys:', Object.keys(objects[0]));
    if(objects[0]['attributes']){
      console.log('Object["attributes"] keys:', Object.keys(objects[0]['attributes']));
    }
    console.log('List of files:');
    for(var object of objects){
      var name = object['attributes']['name'].replace(/[\:\/\\]/g, '_');
      var namespace = object['attributes']['namespace'].replace(/[\:\/\\]/g, '_');
      console.log(' - '+namespace+' '+name+' ['+Object.keys(object.attributes)+']');
      if(args['--download']){
        var path = 'download/'+obj_namespace+'_'+obj_name+'/'+namespace+'/'+name;
        var content = object.data;
        console.log('   Saving '+namespace+' '+name+' to '+path);
        console.log('   with content:', content);
        fs.outputFileSync(path, content, function (err) {
          if(err) console.log(err); // => null
        });
      }
    }
  }).catch( (e) => {
    // console.log('Error!');
    console.log('Error!', e.body);
  });
}

request(args['--schema'], args['--limit']);
