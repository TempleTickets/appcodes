module.exports=function(app,services,bodyParser,uniqueId,marshal,sha512)
{
    app.get("/verifyemail/:id/:token",function(req,res){
        var params={
            TableName: 'register',
            IndexName:'Index5',
            KeyConditionExpression: 'uniqueId=:val and id=:id  ',
            // KeySchema:{
            //   id:{N:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
            //FilterExpression: 'email = :email',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                //':email': {S:req.body.email},
                ':id': {N:req.params.id.toString()},
                ':val':{S:uniqueId}
            },
            Select:"ALL_ATTRIBUTES",
            ConsistentRead: true, // optional (true | false)
            ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
        }
        services.login(params).then(function(data) {
            if(data.Items.length>0)
            {
                var user=data.Items.map(marshal.unmarshalItem)[0];

                if(req.params.token==user.email_token)
                {

                    var params2={
                        TableName:"register",
                        Key:{
                            email:{S:user.email.toString()},
                            uniqueId:{S:uniqueId.toString()}
                        },
                        UpdateExpression:"set verify_email=:changed",
                        ExpressionAttributeValues: {
                            ":changed": {S: 'Yes'},
                        }
                        ,
                        ReturnValues:"UPDATED_NEW"
                    }
                    services.updatePassword(params2).then(function(data){
                        console.log(user.email_token+ "  "+req.params.token);
                        res.end(JSON.stringify({status:true,message:'Email verified'}));
                    })
                        .catch(function(err){
                            res.end(JSON.stringify({status:false,error:err}));
                        })
                }
                else{
                res.end(JSON.stringify({status:false,error:"Token Doesnt match"}))
                }
            }
            else{
            res.end(JSON.stringify({status:false,data:'Wrong Credentials'}));
            }
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}))

        })

    })

}
