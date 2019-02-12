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
$ node src/index.js --schema xtk:schema
[...]
- xtk sqlSchema [_cs,_isMemoNull,img,label,md5,name,namespace]
- xtk srcSchema [_cs,_isMemoNull,img,label,md5,name,namespace]
- xtk strings [_cs,_isMemoNull,img,label,md5,name,namespace]
- xtk workflowEvent [_cs,_isMemoNull,img,label,md5,name,namespace]
- xtk xslt [_cs,_isMemoNull,img,label,md5,name,namespace]
```

### Download all JSSP
```bash
$ node src/index.js --schema xtk:jssp --download
$ tree download
└───xtk_jssp
    ├───acx
    ├───crm
    ├───nms
    └───xtk
```

### Download all workflows
Duplicate `.env.dist` to `.env` and fill in your endpoint + login/pass
```bash
$ node src/download-workflow.js
$ tree download/_workflow
├───myWorkflow1.js
└───myWorkflow2.js
```
![](/docs/myWorkflow1.jpg)
```bash
$ cat download/_workflow/myWorkflow1.js
```
```xml
<root internalName="myWorkflow1" keepResult="true" label="My Workflow 1">
  <activities>
    <end img="xtk:activities/end.png" label="End" name="end" x="416" y="136"/>
    <fork img="xtk:activities/fork.png" label="Fork" name="fork" x="176" y="88">
      <transitions>
        <transition enabled="true" name="transition1" target="writer" x="0" y="0"/>
        <transition enabled="true" name="transition2" target="js"/>
      </transitions>
    </fork>
    <js img="xtk:activities/script.png" label="JavaScript code" name="js" x="304" y="136">
      <transitions>
        <done enabled="true" label="Ok" name="done" target="end" x="0" y="0"/>
        <error enabled="false" label="Error" name="error"/>
      </transitions>
      <script>logInfo('Hello')</script>
    </js>
    <query distinct="true" img="nms:activities/query.png" keepAllExtraData="false" label="email is not empty" name="query" noAutoPk="false" noAutoPkFilter="false" schema="nms:recipient" useSource="0" x="40" y="88">
      <transitions>
        <result enabled="true" label="Result" name="result" target="fork"/>
      </transitions>
      <where displayFilter="email is not empty" filterName="backGroundFilterFrm" id="1134428176">
        <condition compositeKey="" dependkey="" enabledIf="" expr="@email IS NOT NULL" internalId="1134034958"/>
      </where>
      <humanCond>Query: email is not empty</humanCond>
    </query>
    <writer img="nms:activities/writer.png" label="Update data" mask="1" maxErrorCount="100" name="writer" noPreservation="true" operationType="insertOrUpdate" schema="nms:recipient" transactionSize="10000" x="320" y="40">
      <transitions>
        <done enabled="false" name="done"/>
        <remainder enabled="false" label="Rejects" name="remainder"/>
      </transitions>
    </writer>
  </activities>
  <variables/>
</root>
```
