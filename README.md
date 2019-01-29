# ac-conector-client

## Init your AC7 connection
```bash
$ npm install
$ ./node_modules/.bin/ACCManager
# Interface Access started, please open :
# http://localhost:4545
# Create a Connection named 'My Connection Name'
```

## Use it
### Display all schemas
```bash
$ node ./index.js --schema xtk:schema
[...]
- xtk sqlSchema [_cs,_isMemoNull,img,label,md5,name,namespace]
- xtk srcSchema [_cs,_isMemoNull,img,label,md5,name,namespace]
- xtk strings [_cs,_isMemoNull,img,label,md5,name,namespace]
- xtk workflowEvent [_cs,_isMemoNull,img,label,md5,name,namespace]
- xtk xslt [_cs,_isMemoNull,img,label,md5,name,namespace]
```

### Download all JSSP
```bash
$ node ./index.js --schema xtk:jssp --download
$ tree download
└───xtk_jssp
    ├───acx
    ├───crm
    ├───nms
    └───xtk
```
