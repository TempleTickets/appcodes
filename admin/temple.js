module.exports=function(server,service,bodyParser,uniqueId,marshal,usercount) {

    server.post("/addtemple",bodyParser,function(req,res) {
        var params = {
            TableName: "register",
            Item: {
                uniqueId: {S: uniqueId},
                id: {N: usercount.toString()},
                email: {S: req.body.email},
                //password: {S: req.body.password},
                address: {S: req.body.address},
                temple_name: {S: req.body.temple_name},
                //trusty: {S: req.body.trusty},
                isParent: {N: req.body.user_id.toString()},
                about_temple:{S:req.body.about_temple.toString()},
                mobile_no:{S:req.body.mobile_no1.toString()},
                mobile_no2:{S:(req.body.mobile_no2 || ' ')}
                //start_time:{S:req.body.start_time},
                //end_time:{S:req.body.end_time}
            },
            ConditionExpression: 'attribute_not_exists(email)',
            ReturnItemCollectionMetrics: 'SIZE'
        }

        service.register(params).then(function(data){
            usercount++;
            res.end(JSON.stringify({status:true,data:data,id:usercount}))
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
    server.post("/templelisting",function(req,res){
        var params={
            TableName:"register",
            IndexName:'Index6',
            KeyConditionExpression: 'uniqueId=:val and isParent=:id  ',
            // KeySchema:{
            //   type:{S:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
           // FilterExpression: 'email = :email',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':id': {N:req.body.user_id.toString()},
                // ':type': {S:'1'},
                ':val':{S:uniqueId}
            },
            //AttributesToGet:["email","uniqueId","about_temple","id","isParent","temple_name","mobile_no1","mobile_no2","address"],
             Select:"ALL_ATTRIBUTES",
            ConsistentRead: false, // optional (true | false)
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        }

        service.getTempleList(params).then(function(data){
            data.Items=data.Items.map(marshal.unmarshalItem);
            res.end(JSON.stringify({status:true,data:data.Items}));
        })
        .catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
    server.post("/gettemple",function(req,res){
        var params={
            TableName:"register",
            IndexName:'Index5',
            KeyConditionExpression: 'uniqueId=:val and id=:id  ',
            // KeySchema:{
            //   type:{S:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
           // FilterExpression: 'email = :email',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':id': {N:req.body.id.toString()},
                // ':type': {S:'1'},
                ':val':{S:uniqueId}
            },
            //AttributesToGet:["email","uniqueId","about_temple","id","isParent","temple_name","mobile_no1","mobile_no2","address"],
             Select:"ALL_ATTRIBUTES",
            ConsistentRead: false, // optional (true | false)
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        }
        service.getTemple(params).then(function(data){
                data.Items=data.Items.map(marshal.unmarshalItem);
            res.end(JSON.stringify({status:true,data:data.Items[0]}));
        })
        .catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
    server.post("/updatetemple",bodyParser,function(req,res){
        var params= {
            TableName: 'register',

            Key: {
                "uniqueId":{S:uniqueId},
                "email": {S:req.body.email.toString()}
            },
            UpdateExpression: "set temple_name = :temple_name , email= :email, mobile_no1= :mobile_no1 , address=:address , mobile_no2=:mobile_no2 ",
            ConditionExpression:'attribute_not_exists(email)',
            ExpressionAttributeValues: {
                ":temple_name": {S:req.body.temple_name},
                ":email": {S:req.body.email},
                ":mobile_no1":{S:req.body.mobile_no1.toString()},
                ":address":{S:req.body.address},
                ":trusty":{S:req.body.trusty},


            },
            ReturnValues: "UPDATED_NEW"
        }
        service.updateTemple(params).then(function(data){
            res.end(JSON.stringify({status:true,data:data}));
        },function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
}
