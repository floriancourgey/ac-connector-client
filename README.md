# ac-conector-client

## Init your AC7 connection
```console
$ npm install
$ ./node_modules/.bin/ACCManager
Interface Access started, please open :
http://localhost:4545
Create a Connection named 'My Connection Name'
```

## Use it
### Display all schemas
```console
$ node src/index.js --schema xtk:schema
[...]
- xtk sqlSchema [_cs,_isMemoNull,img,label,md5,name,namespace]
- xtk srcSchema [_cs,_isMemoNull,img,label,md5,name,namespace]
- xtk strings [_cs,_isMemoNull,img,label,md5,name,namespace]
- xtk workflowEvent [_cs,_isMemoNull,img,label,md5,name,namespace]
- xtk xslt [_cs,_isMemoNull,img,label,md5,name,namespace]
```

### Download all JSSP
```console
$ node src/index.js --schema xtk:jssp --download
$ tree download
└───xtk_jssp
    ├───acx
    ├───crm
    ├───nms
    └───xtk
```

### Download all workflows (xtk:workflow)
Duplicate `.env.dist` to `.env` and fill in your endpoint + login/pass
```console
$ node src/download-workflow.js
$ tree download/_workflow
├───myWorkflow1.js
└───myWorkflow2.js
```
![](/docs/myWorkflow1.jpg)
```console
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
    <query img="nms:activities/query.png" label="email is not empty" name="query" schema="nms:recipient" useSource="0" x="40" y="88">
      <transitions>
        <result enabled="true" label="Result" name="result" target="fork"/>
      </transitions>
      <where displayFilter="email is not empty" filterName="backGroundFilterFrm">
        <condition enabledIf="" expr="@email IS NOT NULL"/>
      </where>
      <humanCond>Query: email is not empty</humanCond>
    </query>
    <writer img="nms:activities/writer.png" label="Update data" name="writer" operationType="insertOrUpdate" schema="nms:recipient" transactionSize="10000" x="320" y="40">
      <transitions>
        <done enabled="false" name="done"/>
        <remainder enabled="false" label="Rejects" name="remainder"/>
      </transitions>
    </writer>
  </activities>
  <variables/>
</root>
```


## Download all Web applications (nms:webApp)
Duplicate `.env.dist` to `.env` and fill in your endpoint + login/pass
```console
$ node src/download-webApp.js
$ tree download/_webApp
├───APP01.js
└───newWebApp.js
$ cat download/_webApp/newWebApp.js
```
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root background="nms:backgrounds/survey.png" entitySchema="nms:webApp" internalName="newWebApp" label="New Web application" schema="nms:recipient">
  <properties windowTitle="Enter the title of the window here" labelPosition="left" navigationMode="button" renderingEngine="1"/>
  <errorPage label="Error" name="errorPage">
    <endPage>
      <source>&lt;table style="color: red;"&gt;
&lt;tr&gt;
&lt;td style="vertical-align: middle; padding-left: 0.5em;"&gt;&lt;img src="/xtk/img/error.png"/&gt;&lt;/td&gt;
&lt;td style="vertical-align: middle; padding: 1em;"&gt;
&lt;p&gt;&lt;%= $(line1) %&gt;&lt;/p&gt;
&lt;p&gt;&lt;%= $(line2) %&gt;&lt;/p&gt;
&lt;/td&gt;
&lt;/tr&gt;
&lt;/table&gt;</source>
      <strings>
        <string id="line2" value="If this problem persists, please contact your Adobe Campaign administrator."/>
        <string id="line1" value="An error occurred."/>
      </strings>
    </endPage>
  </errorPage>
  <closedFormLog>This form is currently closed.</closedFormLog>
</root>
```
