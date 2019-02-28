const fs = require('fs-extra');
const JXON = require('jxon');
const ACC = require('ac-connector');
const ACCLogManager = ACC.ACCLogManager;
const xtkQueryDef = ACC.xtkQueryDef;
const slugify = require('slugify');

// process.env.http_proxy = 'http://127.0.0.1:8888'; // for Fiddler

function slugifyFolder(s){
  const params = {remove: /[<>:"\/\\\|\?\*]/g};
  return slugify(s, params);
}
var connectionName = 'My Connection Name';
var connectionNameSlug = slugifyFolder(connectionName);
var login = ACCLogManager.getLogin(connectionName);
var queryDef = new xtkQueryDef({'accLogin' : login});

const xtkSession = ACC.xtkSession;
var session = new xtkSession({'accLogin' : login});
var o = session.GetEntityIfMoreRecent('xtk:schema|nms:webApp', null, true);
o.then(function(a){
  console.log(a);
});
