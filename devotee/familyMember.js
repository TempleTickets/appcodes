module.exports=function(server,services,bodyParser,uniqueId,marshal,path,fs,sha512){
    var familyId=1;
    server.post("/addfamilymember",function(req,res){

        var filename='uploads/userFamilyMember/family_'+sha512(parseInt(Math.random()*10000000000).toString())+'.jpg';

        fs.writeFile(filename,req.body.image,'base64',function(error){

        if(!error) {
            var params={
                TableName:"devoteeFamilyMembers",
                Item:{
                    first_name:{S:req.body.first_name},
                    user_id:{S:req.body.user_id.toString()},
                    id:{N:familyId.toString()},
                    uniqueId:{S:uniqueId.toString()},
                    last_name:{S:req.body.last_name},
                    email:{S:req.body.email},
                    mobile_no:{S:req.body.mobile_no},
                    dob:{S:req.body.dob},
                    gender:{S:req.body.gender},
                    dom:{S:req.body.dom},
                    gotra:{S:req.body.gotra},
                    rashi:{S:req.body.rashi},
                    nakshtra:{S:req.body.nakshtra},
                    address:{S:req.body.address},
                    pin_no:{S:req.body.pin_no},
                    pan_no:{S:req.body.pan_no},
                    image:{S:filename.toString()}
                }
            }
            services.addDevoteeFamilyMembers(params).then(function (data) {
                familyId++;
                res.end(JSON.stringify({status: true, data: data}));
            }).catch(function (err) {
                res.end(JSON.stringify({status: false, error: err}));
            })
              }
              else{
            res.end(JSON.stringify({status:false,error:error}));
        }
        })
    })
    server.post("/updatefamilymember",function(req,res){

        var filename='uploads/userFamilyMember/family_'+sha512(parseInt(Math.random()*10000000000).toString())+'.jpg';

        fs.writeFile(filename,req.body.image,'base64',function(error){

        if(!error) {
            var params={
                TableName:"devoteeFamilyMembers",
                Key:{
                    id:{N:req.body.id.toString()},
                    uniqueId:{S:uniqueId.toString()}
                },
                UpdateExpression:"set first_name=:first_name , last_name=:last_name, email=:email, mobile_no=:mobile_no, dob=:dob, gotra=:gotra, rashi=:rashi,dom=:dom,gender=:gender, nakshtra=:nakshtra, address=:address, pin_no=:pin_no, pan_no=:pan_no, image=:image",
                ExpressionAttributeValues:{
                    ":first_name":{S:req.body.first_name},
                    //":user_id":{S:req.body.user_id.toString()},
                    //":id":{N:familyId.toString()},
                    //":uniqueId":{S:uniqueId.toString()},
                    ":last_name":{S:req.body.last_name},
                    ":email":{S:req.body.email},
                    ":mobile_no":{S:req.body.mobile_no},
                    ":dob":{S:req.body.dob},
                    ":gender":{S:req.body.gender},
                    ":dom":{S:req.body.dom},
                    ":gotra":{S:req.body.gotra},
                    ":rashi":{S:req.body.rashi},
                    ":nakshtra":{S:req.body.nakshtra},
                    ":address":{S:req.body.address},
                    ":pin_no":{S:req.body.pin_no},
                    ":pan_no":{S:req.body.pan_no},
                    ":image":{S:filename.toString()}
                },
                ReturnValues:"UPDATED_NEW"
            }
            services.updateDevoteeFamilyMembers(params).then(function (data) {
               // familyId++;
                data=[data.Attributes];
                if(data.length>0){
                data=data.map(marshal.unmarshalItem)[0];
                data.image=path+data.image;
                }
                //data=data.Attributes.map(marshal.unmarshalItem);
                res.end(JSON.stringify({status: true, data: data}));
            }).catch(function (err) {
                res.end(JSON.stringify({status: false, error: err}));
            })
              }
              else{
            res.end(JSON.stringify({status:false,error:error}));
        }
        })
    })
    server.post("/getfamilylist",function(req,res){

        var params = {
            TableName: 'devoteeFamilyMembers',
            IndexName:'Index1',
            KeyConditionExpression: 'uniqueId=:val and user_id=:id  ',
            // KeySchema:{
            //   type:{S:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
            // FilterExpression: 'id = :type',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':id': {S:req.body.user_id.toString()},
                // ':type': {S:'1'},
                ':val':{S:uniqueId}
            },
            //Select:"ALL_ATTRIBUTES",
            ConsistentRead: false, // optional (true | false)
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        };
            services.getFamilyMembers(params).then(function (data) {
                data.Items=data.Items.map(marshal.unmarshalItem);
                data.Items.forEach(function(val,key){
                    data.Items[key].image=path+val.image;
                })
                res.end(JSON.stringify({status: true, data: data.Items}));
            }).catch(function (err) {
                res.end(JSON.stringify({status: false, error: err}));
            })

    })
    server.post("/getfamilymember",function(req,res){

        var params = {
            TableName: 'devoteeFamilyMembers',
            //IndexName:'Index1',
            KeyConditionExpression: 'uniqueId=:val and id=:familyid  ',
            // KeySchema:{
            //   type:{S:'0'},
            //   email:{S:req.body.email},
            //  // password:{S:'123456'},
            // },
            // FilterExpression: 'id = :type',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':familyid': {N:req.body.id.toString()},
                // ':type': {S:'1'},
                ':val':{S:uniqueId}
            },
            Select:"ALL_ATTRIBUTES",
            ConsistentRead: false, // optional (true | false)
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        };
            services.getFamilyMembers(params).then(function (data) {
                data.Items=data.Items.map(marshal.unmarshalItem);
                data.Items.forEach(function(val,key){
                    data.Items[key].image=path+val.image;
                })
                res.end(JSON.stringify({status: true, data: data.Items[0]}));
            }).catch(function (err) {
                res.end(JSON.stringify({status: false, error: err}));
            })

    })
    server.get("/createfamilymember",function(req,res){
        var params={
            TableName:'devoteeFamilyMembers',
            KeySchema: [
                {
                    AttributeName: "uniqueId",
                    KeyType: "HASH"
                },{
                    AttributeName: "id",
                    KeyType:"RANGE"
                }
            ],
            AttributeDefinitions: [
                {
                    AttributeName: "uniqueId",
                    AttributeType: "S"
                },
                {
                    AttributeName: "user_id",
                    AttributeType: "S"
                },
                {
                    AttributeName: "id",
                    AttributeType: "N"
                },

            ],
            GlobalSecondaryIndexes:[
                {
                    IndexName: "Index1",
                    KeySchema: [
                        {
                            AttributeName: "uniqueId",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "user_id",
                            KeyType: "RANGE"
                        }

                    ],
                    Projection: {
                        NonKeyAttributes: [ "user_id","id","first_name","last_name","email","mobile_no","dob","dom","gotra","rashi","nakshatra","gender","address","pin_no","pan_no","image" ],
                        ProjectionType: "INCLUDE"
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 10,
                        WriteCapacityUnits: 10
                    }
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }

        }
        services.createTable(params).then(function(data){
            res.end(JSON.stringify({status:true,data:data}));
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
    server.get("/deletefamilymember",function(req,res){
        var params={
            TableName:'devoteeFamilyMembers'
        }
        services.deleteTable(params).then(function(data){
            res.end(JSON.stringify({status:true,data:data}))
        }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
        })
    })
}
