module.exports=function(server,service,bodyParser,uniqueId,marshal,usercount,email,randomstring,fs,path,request){
    server.post("/login",bodyParser,function(req,res){
        res.setHeader('content-type', 'application/json');
        console.log(req.body)
        var params = {
            TableName: 'register',
            IndexName:'Index5',
            KeyConditionExpression: 'uniqueId=:val and email=:email  ',
            // KeySchema:{
            //   id:{N:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
            //FilterExpression: 'email = :email',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':email': {S:req.body.email},
                //':password': {S:req.body.password},
                ':val':{S:uniqueId}
            },
            Select:"ALL_ATTRIBUTES",
            ConsistentRead: true, // optional (true | false)
            ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
        };




        service.login(params).then(function(data){
            if(data.Count>0)
            {

                var items=data.Items.map(marshal.unmarshalItem)[0]
                if(items.password==req.body.password){
                    items.image=path+items.image;
                    res.end(JSON.stringify({status:true,data:items}));
                }
                else{
                    res.end(JSON.stringify({status:false,error:{message:'Wrong Password'}}))
                }
            }
            else{
                res.end(JSON.stringify({status:false,error:{message:"Wrong Email"}}));
            }

        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })

    });
    server.get("/createtables",function(req,res){
        var params={
            KeySchema: [
                {
                    AttributeName: "uniqueId",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "id",
                    KeyType: "RANGE"
                }

            ],

            AttributeDefinitions: [
                {
                    AttributeName: "uniqueId",
                    AttributeType: "S"
                },
                {
                    AttributeName: "id",
                    AttributeType: "N"
                },{
                    AttributeName: "email",
                    AttributeType: "S"
                },{
                    AttributeName: "temple_name",
                    AttributeType: "S"
                },{
                    AttributeName: "password",
                    AttributeType: "S"
                },{
                    AttributeName: "address",
                    AttributeType: "S"
                },{
                    AttributeName: "trusty",
                    AttributeType: "S"
                },{
                    AttributeName: "isParent",
                    AttributeType: "N"
                },
                {
                    AttributeName:"changed",
                    AttributeType:"S"
                }
            ],
            GlobalSecondaryIndexes:[
                {
                    IndexName:"Index6",
                    KeySchema:[
                        {
                            AttributeName:"uniqueId",
                            KeyType:"HASH"
                        },
                        {
                            AttributeName:"isParent",
                            KeyType:"RANGE"
                        }
                    ],
                    Projection:{
                        //NonKeyAttributes:["isParent"],
                        ProjectionType:"ALL"
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 10,
                        WriteCapacityUnits: 10
                    }
                },
                {
                    IndexName:"Index7",
                    KeySchema:[
                        {
                            AttributeName:"uniqueId",
                            KeyType:"HASH"
                        },
                        {
                            AttributeName:"changed",
                            KeyType:"RANGE"
                        }
                    ],
                    Projection:{
                        //NonKeyAttributes:["isParent"],
                        ProjectionType:"ALL"
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 10,
                        WriteCapacityUnits: 10
                    }
                }
            ],
            LocalSecondaryIndexes: [
                {
                    IndexName: "Index1",
                    KeySchema: [
                        {
                            AttributeName: "uniqueId",
                            KeyType: "HASH"
                        },{
                            AttributeName: "temple_name",
                            KeyType: "RANGE"
                        }
                    ],
                    Projection: {
                        NonKeyAttributes: [ "temple_name","first_name","last_name","start_time","end_time","about_temple","email_token","temple_type","verify_mobile","verify_email","mobile_no","verify_code","mobile_no2" ],
                        ProjectionType: "INCLUDE"
                    }
                },
                {
                    IndexName: "Index2",
                    KeySchema: [
                        {
                            AttributeName: "uniqueId",
                            KeyType: "HASH"
                        },{
                            AttributeName: "password",
                            KeyType: "RANGE"
                        }
                    ],
                    Projection: {
                        NonKeyAttributes: [ "password" ],
                        ProjectionType: "INCLUDE"
                    }
                },
                {
                    IndexName: "Index3",
                    KeySchema: [
                        {
                            AttributeName: "uniqueId",
                            KeyType: "HASH"
                        },{
                            AttributeName: "address",
                            KeyType: "RANGE"
                        }
                    ],
                    Projection: {
                        NonKeyAttributes: [ "address" ],
                        ProjectionType: "INCLUDE"
                    }
                },{
                    IndexName: "Index4",
                    KeySchema: [
                        {
                            AttributeName: "uniqueId",
                            KeyType: "HASH"
                        },{
                            AttributeName: "trusty",
                            KeyType: "RANGE"
                        }
                    ],
                    Projection: {
                        NonKeyAttributes: [ "trusty" ],
                        ProjectionType: "INCLUDE"
                    }
                },{
                    IndexName: "Index5",
                    KeySchema: [
                        {
                            AttributeName: "uniqueId",
                            KeyType: "HASH"
                        },{
                            AttributeName: "email",
                            KeyType: "RANGE"
                        }
                    ],
                    Projection: {
                        NonKeyAttributes: [ "email","changed" ],
                        ProjectionType: "INCLUDE"
                    }
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            },

            TableName: "register"

        }

        /*var params={
         TableName : "register",
         KeySchema: [
         { AttributeName: "id", KeyType: "HASH"},  //Partition key
         { AttributeName: "email", KeyType: "RANGE" },


         ],
         AttributeDefinitions: [
         { AttributeName: "id", AttributeType: "N" },
         { AttributeName: "email", AttributeType: "S" },

         ],
         ProvisionedThroughput: {
         ReadCapacityUnits: 10,
         WriteCapacityUnits: 10
         },


         }*/
        service.createTable(params).then(function(data){
            res.end(JSON.stringify(data));
        }).catch(function(err){
            res.end(JSON.stringify(err));
        })
    })
    server.get("/deleteregistertable",function(req,res){
        var params = {
            TableName: 'register',
        };
        service.deleteTable(params).then(function(data) {
            // an error occurred
            res.end(JSON.stringify(data)); // successful response
        }).catch(function(err){
            res.end(JSON.stringify(err));
        });
    })
    server.post("/register",bodyParser,function(req,res){

        usercount++;
        var profileimage='uploads/profile/'+randomstring.generate(7)+'.png';
        fs.writeFile(profileimage,req.body.image,'base64',function(err){
            //res.end(JSON.stringify(err));
            if(!err)
            {
                var email_token=randomstring.generate(25);
                var params={
                    TableName:'register',
                    Item:{
                        uniqueId:{S:uniqueId},
                        id:{N:usercount.toString()},
                        email:{S:req.body.email},
                        password:{S:req.body.password},
                        address:{S:req.body.address},
                        temple_type:{S:req.body.temple_type},
                        temple_name:{S:req.body.temple_name},
                        trusty:{S:req.body.trusty},
                        email_token:{S:email_token},
                        first_name:{S:req.body.first_name},
                        last_name:{S:req.body.last_name},
                         image:{S:profileimage.toString()},
                        verify_email:{S:'Yes'},
                        verify_code:{S:'Yes'}
                    },
                    ConditionExpression: 'attribute_not_exists(email)',

                    ReturnItemCollectionMetrics:'SIZE'
                }

                service.register(params).then(function(data){
                    email.sendMail({
                        from: 'atulsingh.oms@gmail.com',
                        to: req.body.email,
                        subject: 'New Temporary Password',
                        html: 'Hello '+req.body.first_name+' <br> \
                            Email Id : '+req.body.email+' <br>\
                    Your email verification link is <br>\
                    http://111.93.90.230:8136/verifyemail/'+usercount+'/'+email_token
                    },function(err,info){
                        console.log(err);
                        if(err){
                            res.end(JSON.stringify({status:false,error:err}))
                        }
                        res.end(JSON.stringify({status:true,data:info}))

                    })
                    res.end(JSON.stringify({status:true,data:data,user_id:usercount}));
                }).catch(function(err){
                    usercount--;
                    res.end(JSON.stringify({status:false,sub_error:err,error:{message:"Email Already Exists"}}));
                })
            }
            else{
                res.end(JSON.stringify({status:false,error:err}));
            }
        })



    })
    server.post("/updateprofile",function(req,res){
        var email_token=randomstring.generate(25).toString();
        var notBase64 = /[^A-Z0-9+\/=]/i;
        if(!notBase64.test(req.body.image))
        {
            var profileimage='uploads/profile/'+randomstring.generate(7)+'.png';
            fs.writeFile(profileimage,req.body.image,'base64',function(err) {
                if(!err)
                {
                    var params={
                        TableName:"register",
                        //ConditionExpression: "id = :num",
                        Key:{
                            id:{N:req.body.id.toString()},
                            uniqueId:{S:uniqueId.toString()}
                        },
                        UpdateExpression:"set first_name=:first_name ,email_token=:email_token ,last_name=:last_name, email=:email, mobile_no=:mobile_no,temple_type=:temple_type ,temple_name=:temple_name,trusty=:trusty,verify_email=:verify_email,verify_code=:verify_code ,address=:address, image=:image",
                        ExpressionAttributeValues:{
                            ":email":{S:req.body.email},
                            //":password":{S:req.body.password},
                            ":address":{S:req.body.address},
                            ":temple_type":{S:req.body.temple_type},
                            ":temple_name":{S:req.body.temple_name},
                            ":trusty":{S:req.body.trusty},
                            ":email_token":{S:email_token},
                            ":first_name":{S:req.body.first_name},
                            ":last_name":{S:req.body.last_name},
                            ":image":{S:profileimage.toString()},
                            ":mobile_no":{S:req.body.mobile_no.toString()},
                            ":verify_email":{S:req.body.verify_email.toString()},
                            ":verify_code":{S:req.body.verify_code.toString()},
                          //  ":num":{N:req.body.id.toString()}
                        },
                        ReturnValues:"UPDATED_NEW"
                    };
                    updateProfile(params);
                }
                else{
                    res.end(JSON.stringify({status:false,error:err}));
                }
            })

        }
        else{
            var params={
                TableName:"register",
               //ConditionExpression: "id = :num",
                Key:{
                    id:{N:req.body.id.toString()},
                    uniqueId:{S:uniqueId.toString()}
                },
                UpdateExpression:"set first_name=:first_name , email_token=:email_token ,last_name=:last_name, email=:email, mobile_no=:mobile_no,temple_type=:temple_type ,temple_name=:temple_name,trusty=:trusty,verify_email=:verify_email,verify_code=:verify_code ,address=:address",
                ExpressionAttributeValues:{
                    ":email":{S:req.body.email},
                    //":password":{S:req.body.password},
                    ":address":{S:req.body.address},
                    ":temple_type":{S:req.body.temple_type},
                    ":temple_name":{S:req.body.temple_name},
                    ":trusty":{S:req.body.trusty},
                    ":email_token":{S:email_token},
                    ":first_name":{S:req.body.first_name},
                    ":last_name":{S:req.body.last_name},
                     ":mobile_no":{S:req.body.mobile_no.toString()},
                    ":verify_email":{S:req.body.verify_email.toString()},
                    ":verify_code":{S:req.body.verify_code.toString()},
                   // ":num":{N:req.body.id.toString()}
                },
                ReturnValues:"UPDATED_NEW"
            };
            updateProfile(params)
        }
        function updateProfile(params){
            service.updateAdminProfile(params).then(function(data){

                if(req.body.verify_email=='No')
                {
                    email.sendMail({
                        from: 'atulsingh.oms@gmail.com',
                        to: req.body.email,
                        subject: 'New Temporary Password',
                        html: 'Hello '+req.body.first_name+' <br> \
                            Email Id : '+req.body.email+' <br>\
                    Your email verification link is <br>\
                    http://111.93.90.230:8136/verifyemail/'+req.body.id+'/'+email_token
                    },function(err,info){
                        console.log(err);
                        if(err){
                            res.end(JSON.stringify({status:false,error:err}))
                        }
                        else{

                            res.end(JSON.stringify({status:true,data:info}))
                        }


                    })
                    if(req.body.verify_code=='No')
                    {
                        var params=
                            {
                                'mno':req.body.countryCode.toString()+req.body.mobile_no.toString(),
                                'text':(req.body.text),
                                'user':'OMSCORPS',
                                'pass':'Omc98o1',
                                'type':'1',
                                'esm':0,
                                'dcs':0,
                                'sid':'OMSOFT'
                            }
                        var query="";
                        for(key in params)
                        {
                            query += encodeURIComponent(key)+"="+encodeURIComponent(params[key])+"&";
                        }

                        request(
                            {
                                method: 'POST',
                                uri: 'http://78.108.164.67:8080/websmpp/websms?'+query,
                                headers: [
                                    {
                                        'content-type': 'application/x-www-form-urlencoded'
                                    }
                                ],
                                postData:{
                                    // mimeType: 'application/x-www-form-urlencoded',
                                    params:
                                        {
                                            'mno':req.body.mobile_no,
                                            'text':encodeURI(req.body.text),
                                            'user':'OMSCORP',
                                            'pass':'Omc98o1',
                                            'type':'1',
                                            'esm':0,
                                            'dcs':0,
                                            'sid':'OMSOFT'
                                        }
                                }
                            },function(err,resp,response){
                                if(!err)
                                {
                                    code=req.body.text.substr(req.body.text.indexOf('-')+2,4);
                                    var params2={
                                        TableName:"register",
                                        //IndexName:'Index5',
                                        Key:{
                                            uniqueId:{S:uniqueId.toString()},
                                            id:{N:req.body.id.toString()}
                                        },
                                        UpdateExpression:"set verify_code=:verify_code",
                                        ExpressionAttributeValues: {
                                            ":verify_code": {S: code},
                                        }
                                        ,
                                        ReturnValues:"UPDATED_NEW"
                                    }
                                    service.updatePassword(params2).then(function(data){
                                        res.end(JSON.stringify({status:true,message:resp}))
                                    })
                                        .catch(function(err){
                                            console.log(err);
                                            res.end(JSON.stringify({status:false,error:err}));
                                        })
                                }
                            })
                    }
                    res.end(JSON.stringify({status:true,data:data}));
                }
                else{
                    res.end(JSON.stringify({status:true,data:data}));
                }

            }).catch(function(err){
                res.end(JSON.stringify({status:false,error:err}));
            })
       }
    })
     server.post("/changepassword",function(req,res){
        var params={
            TableName:"register",
           // ConditionExpression: "id = :num",
            Key:{
                id:{S:req.body.id.toString()},
                uniqueId:{S:uniqueId.toString()}
            },
            UpdateExpression:"set password=:password ",
            ExpressionAttributeValues:{
                ":password":{S:req.body.password},
                ":num":{N:req.body.id.toString()}
                },
            ReturnValues:"UPDATED_NEW"
        };
        console.log(params)
        service.updateAdminProfile(params).then(function(data){
        //   npd().table('register')
        //       .feature(function(f){
        //           f.updateExpression('set password=:password')
        //           f.expressionAttributeValues({
        //               ":password":{S:req.body.password}
        //           })
        //           f.returnValues('UPDATED_NEW')
        //       })
        //       .where('id',req.body.id.toString())
        //       .where('uniqueId',uniqueId.toString())
        //       .update().then(function(data){
            res.end(JSON.stringify({status:true,data:data}))
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
}
