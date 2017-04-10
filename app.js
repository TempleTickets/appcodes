/*var $credentials = {
  "accessKeyId": "AKIAI6UMLCOZU3EFIZRQ",
  "secretAccessKey": "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",
  "region": "eu-west-1"
}*/
var userCount = 1;
var staffCount=1;
var devoteeId=1;
var config={
    region: "eu-west-1",
    endpoint: "dynamodb.eu-west-1.amazonaws.com",
    accessKeyId: "AKIAI6UMLCOZU3EFIZRQ",
    secretAccessKey: "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",
    apiVersion: '2012-08-10'
};
var express= require('express');
var BigPipe=require('bigpipe');
var mailer=require('nodemailer');
var randomstring=require('randomstring');
var request=require('request');
var server=express();
var devotee=express();
var app=express();
var email=mailer.createTransport({
   //host: 'smtp.gmail.com', // hostname
    service:"Gmail",
    //secureConnection: true, // use SSL
    //port: 465, // port for secure SMTP
    //transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'atulsingh.oms@gmail.com',
        pass: 'fckgwrhqq2'
    }
});
var dynamodb=require('aws-sdk');
var queryBuilder=require('npdynamodb');
var body=require('body-parser');
var router=express.Router();
var bodyParser=body.urlencoded({ extended: true });
var defer=require('node-defer');
var marshal = require('dynamodb-marshaler');
var sha512=require('js-sha512').sha512;
var fs=require("fs");
var path='http://111.93.90.230:8136/';
dynamodb.config.update(config);
var db=new dynamodb.DynamoDB(config);
var npd = queryBuilder.createClient(db);
var docClient = new dynamodb.DynamoDB.DocumentClient();
var dynamo = new dynamodb.DynamoDB();
var services=require('./services')(dynamo,docClient,defer);
var uniqueId=sha512('fckgwrhqq2');

function headersUse(req,res,next)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}
/* Services starts */
server.use(headersUse);
server.use(body.json({limit:'50mb'})); // support json encoded bodies
server.use(body.urlencoded({ limit:'50mb',extended: true }));

/* admin Services */

require('./routes/default')(server,sha512);
require('./admin/login')(server,services,bodyParser,uniqueId,marshal,userCount,email,randomstring,fs,path,request);
require('./admin/passwordServices')(server,services,bodyParser,uniqueId,marshal,email,randomstring,request);
require('./admin/temple')(server,services,bodyParser,uniqueId,marshal,userCount);
require('./admin/bankservice')(server,services,bodyParser,uniqueId,marshal,fs,sha512);
require('./admin/templeTiming')(server,services,bodyParser,uniqueId,marshal,fs,sha512);
require('./admin/pooja')(server,services,bodyParser,uniqueId,marshal,fs,sha512,npd,path);
require('./admin/user')(server,services,bodyParser,uniqueId,marshal,fs,sha512,staffCount);
require('./admin/walkinService')(server,services,bodyParser,uniqueId,marshal,fs,sha512);
require('./admin/dietyServices')(server,services,bodyParser,uniqueId,marshal,fs,sha512,path);
app.use("/api/v1/admin",server);
/* admin services end */
/* Devotee Services */
devotee.use(headersUse);
devotee.use(body.json({limit:'50mb'})); // support json encoded bodies
devotee.use(body.urlencoded({ limit:'50mb',extended: true }));
require('./devotee/login')(devotee,services,bodyParser,uniqueId,marshal,devoteeId,sha512)
require('./devotee/temple')(devotee,services,bodyParser,uniqueId,marshal,devoteeId,sha512)
require('./devotee/profile')(devotee,services,bodyParser,uniqueId,marshal,path,fs,sha512)
require('./devotee/familyMember')(devotee,services,bodyParser,uniqueId,marshal,path,fs,sha512)
require('./devotee/settings')(devotee,services,bodyParser,uniqueId,marshal,path,fs,sha512)
require('./devotee/pooja')(devotee,services,bodyParser,uniqueId,marshal,npd,sha512)
require('./devotee/donate')(devotee,services,bodyParser,uniqueId,marshal,npd,sha512)
app.use("/api/v1/devotee",devotee);

require('./verifyemail')(app,services,bodyParser,uniqueId,marshal,sha512);


/* Devotee Services End*/
/* Services End */
app.use(headersUse);
app.use(express.static(__dirname +  '/'));
var bigpipe=new BigPipe(app,{
    dist:__dirname+'/dist',
    pagelets:__dirname+'/pagelets'
});
app.listen('8136',function(){
  console.log("Server Started");
});
