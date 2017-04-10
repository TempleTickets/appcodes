module.exports=function(server,services,bodyParser,uniqueId,marshal,email,randomstring,request)
{

    server.post("/resetpassword",function(req,res) {

            var params = {
                TableName: 'register',
                KeyConditionExpression: 'uniqueId=:val and id=:id  ',
                // KeySchema:{
                //   id:{N:'0'},
                //   email:{S:req.body.email},
                //  // password:{S:'123456'},
                // },

                ExpressionAttributeValues: { // a map of substitutions for all attribute values
                    ':id': {S:req.body.id},

                    ':val':{S:uniqueId}
                },
                Select:"ALL_ATTRIBUTES",
                ConsistentRead: true, // optional (true | false)
                ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
            };
            services.login(params).then(function(data){

                if(data.Count>0)
                {
                    var items=data.Items.map(marshal.unmarshalItem)[0];
                    console.log(items);
                    var temp_password=randomstring.generate(7);
                    var params2={
                    TableName:"register",
                    Key:{
                        id:{S:items.id.toString()},
                        uniqueId:{S:uniqueId.toString()}
                    },
                    UpdateExpression:"set password=:password , changed=:changed",
                    ExpressionAttributeValues: {
                        ":password": {S: temp_password.toString()},
                        ":changed":{S:'Yes'}
                    }
                    ,
                    ReturnValues:"UPDATED_NEW"
                }
                services.updatePassword(params2).then(function(data){
                    email.sendMail({
                        from: 'atulsingh.oms@gmail.com',
                        to: items.email,
                        subject: 'New Temporary Password',
                        html: 'Hello '+items.temple_name+' <br> Your new login details are as follows- <br>\
                            Email Id : '+items.email+' <br>\
                    Password : '+temp_password+'<br>\
                    Please save this email or write down your password as you will need it to login into your account.\
                    ',
                    },function(err,info){
                        console.log(err);
                        if(err){
                            res.end(JSON.stringify({status:false,error:err}))
                        }
                        res.end(JSON.stringify({status:true,data:info}))

                    })
                }).catch(function(err){
                    res.end(JSON.stringify({status:false,error:err}));
                })

                }
                else{
                    res.end(JSON.stringify({status:false,error:{message:"Wroong Email"}}));
                }
            })

    })
    server.post("/passwordchanged",function(req,res){
        var params3={
            TableName:"register",
            Key:{
                id:{N:req.body.id.toString()},
                uniqueId:{S:uniqueId.toString()}
            },
            UpdateExpression:"set changed=:changed",
            ExpressionAttributeValues: {
                ":changed": {S: 'No'},
            }
            ,
            ReturnValues:"UPDATED_NEW"
        }
        services.updatePassword(params3).then(function(data){
            res.end(JSON.stringify({status:true,data:data}));
        })
            .catch(function(err){
                res.end(JSON.stringify({status:false,error:err}));
            })
    })
    server.post("/sendsms",function(req,res){

        if(!req.body.mobile_no)
        {
            res.end(JSON.stringify({status:false,error:"Mobile Number Required"}))
        }
        if(!req.body.text)
        {
            res.end(JSON.stringify({status:false,error:"Text Required"}))
        }

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
                if(err){
                res.end(JSON.stringify({status:false,error:err}))
                }
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
               services.updatePassword(params2).then(function(data){
                   res.end(JSON.stringify({status:true,message:resp}))
               })
                   .catch(function(err){
                       res.end(JSON.stringify({status:false,error:err}));
                   })

            })
       // res.end(JSON.stringify(re))
    })
    server.post("/verifycode",function(req,res){
        var params={
            TableName: 'register',
            //IndexName:'Index5',
            KeyConditionExpression: 'uniqueId=:val and id=:id  ',
            // KeySchema:{
            //   id:{N:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
            //FilterExpression: 'email = :email',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                //':email': {S:req.body.email},
                ':id': {N:req.body.user_id.toString()},
                ':val':{S:uniqueId}
            },
            Select:"ALL_ATTRIBUTES",
            ConsistentRead: true, // optional (true | false)
            ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
        }
        services.login(params).then(function(data){
            if(data.Items.length>0)
            {
                var user=data.Items.map(marshal.unmarshalItem)[0];
                console.log(user.verify_code+" "+req.body.verificationCode)
                if(user.verify_code==req.body.verificationCode)
                {

                    var params3={
                        TableName:"register",
                        //IndexName:'Index5',
                        Key:{
                            id:{N:req.body.user_id.toString()},
                            uniqueId:{S:uniqueId.toString()},
                            //email:{S:req.body.email}
                        },
                        UpdateExpression:"set verify_mobile=:changed, mobile_no=:mobile_no",
                        ExpressionAttributeValues: {
                            ":changed": {S: 'yes'},
                            ":mobile_no":{S:req.body.countryCode+req.body.mobile_no.toString()}
                        }
                        ,
                        ReturnValues:"UPDATED_NEW"
                    }
                    services.updatePassword(params3).then(function(data){
                        res.end(JSON.stringify({status:true,data:data}));
                    })
                        .catch(function(err){
                            res.end(JSON.stringify({status:false,error:err}));
                        })
                }
                else{
                res.end(JSON.stringify({status:false,error:'Wrong Verification Code'}));
                }
            }
            else{


            res.end(JSON.stringify({status:false,error:'Wrong credentials'}))
            }
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })

    })
}
