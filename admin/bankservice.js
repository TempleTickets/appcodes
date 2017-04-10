module.exports=function(server,services,bodyParser,uniqueId,marshal,fs,sha512){
    server.post("/bankregister",bodyParser,function(req,res){
      var filename='uploads/cheque/cheque_'+sha512(req.body.user_id.toString())+'.png';
      if(req.body.pan_no)
      {
        var panfile='uploads/pan/pan_'+sha512(req.body.user_id.toString())+'.png';
        fs.writeFile(panfile,req.body.pan_no,'base64',function(error){
            if(error)
            {
              res.end(JSON.stringify({status:false,error:error}))
            }
        })
      }
      if(req.body.tan_no)
      {
          var tanfile='uploads/tan/tan_'+sha512(req.body.user_id.toString())+'.png';
          fs.writeFile(tanfile,req.body.tan_no,'base64',function(error){
              if(error)
              {
                  res.end(JSON.stringify({status:false,error:error}))
              }
          })
      }
        if(req.body.registration_no)
        {
            var registrationfile='uploads/registration/registration_'+sha512(req.body.user_id.toString())+'.png';
            fs.writeFile(registrationfile,req.body.registration_no,'base64',function(error){
                if(error)
                {
                    res.end(JSON.stringify({status:false,error:error}))
                }
            })
        }
        if(req.body.g_reg_no)
        {
            var g_regfile='uploads/g_reg/g_reg_'+sha512(req.body.user_id.toString())+'.png';
            fs.writeFile(g_regfile,req.body.g_reg_no,'base64',function(error){
                if(error)
                {
                    res.end(JSON.stringify({status:false,error:error}))
                }
            })
        }
        if(req.body.sec_12A)
        {
            var sec12file='uploads/sec12a/sec12a'+sha512(req.body.user_id.toString())+'.png';
            fs.writeFile(sec12file,req.body.sec_12A,'base64',function(error){
                if(error)
                {
                    res.end(JSON.stringify({status:false,error:error}))
                }
            })
        }
       fs.writeFile(filename,req.body.upload_cheque,'base64',function(error){

        if(error!='null'){

          var params={
            TableName:'bankDetails',
            Item:{
              user_id:{N:req.body.user_id.toString()},
              uniqueId:{S:uniqueId},
              registration_no:{S:(registrationfile || ' ')},
              pan_no:{S:(panfile || ' ')},
              tan_no:{S:(tanfile || ' ')},
              g_reg_no:{S:(g_regfile || ' ')},
               sec_12A:{S:(sec12file || ' ')} ,
              bank_name:{S:req.body.bank_name},
              account_holder_name:{S:req.body.account_holder_name},
              account_number:{S:req.body.account_number},
              form_58:{S:req.body.form_58},
              upload_cheque:{S:filename},
              ifsc_code:{S:req.body.ifsc_code},

            },
            ReturnItemCollectionMetrics:'SIZE'
          };
          services.addBankDetail(params).then(function(result){

              res.end(JSON.stringify({status:true,message:result}));
          }).catch(function(err){
            res.end(JSON.stringify({status:false,error:err}));
          })
        }
        else{
          res.end(JSON.stringify(error));
        }

      })

    })
  server.get("/createbanktable",function(req,res){
    var params={
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

      AttributeDefinitions: [
        {
          AttributeName: "uniqueId",
          AttributeType: "S"
        },
        {
          AttributeName: "user_id",
          AttributeType: "N"
        },{
          AttributeName: "registration_no",
          AttributeType: "S"
        },{
          AttributeName: "pan_no",
          AttributeType: "S"
        },{
          AttributeName: "tan_no",
          AttributeType: "S"
        },{
          AttributeName: "g_reg_no",
          AttributeType: "S"
        },{
          AttributeName: "bank_name",
          AttributeType: "S"
        },{
          AttributeName: "account_holder_name",
          AttributeType: "S"
        },{
          AttributeName: "account_number",
          AttributeType: "S"
        },{
          AttributeName: "form_58",
          AttributeType: "S"
        },{
          AttributeName: "ifsc_code",
          AttributeType: "S"
        },{
          AttributeName: "upload_cheque",
          AttributeType: "S"
        }
      ],
      GlobalSecondaryIndexes:[{
        IndexName: "Index6",
        KeySchema: [
          {
            AttributeName: "uniqueId",
            KeyType: "HASH"
          },{
            AttributeName: "account_holder_name",
            KeyType: "RANGE"
          }
        ],
        Projection: {
          NonKeyAttributes: [ "account_holder_name","sec_12A" ],
          ProjectionType: "INCLUDE"
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10
        }
      },
        {
          IndexName: "Index7",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "account_number",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "account_number" ],
            ProjectionType: "INCLUDE"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
          }
        },
        {
          IndexName: "Index9",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "form_58",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "form_58" ],
            ProjectionType: "INCLUDE"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
          }
        },
        {
          IndexName: "Index10",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "ifsc_code",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "ifsc_code" ],
            ProjectionType: "INCLUDE"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
          }
        },
        {
          IndexName: "Index11",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "upload_cheque",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "upload_cheque" ],
            ProjectionType: "INCLUDE"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
          }
        }],
      LocalSecondaryIndexes: [
        {
          IndexName: "Index1",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "registration_no",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "registration_no" ],
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
              AttributeName: "pan_no",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "pan_no" ],
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
              AttributeName: "tan_no",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "tan_no" ],
            ProjectionType: "INCLUDE"
          }
        },
        {
          IndexName: "Index4",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "g_reg_no",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "trusty" ],
            ProjectionType: "INCLUDE"
          }
        },
        {
          IndexName: "Index5",
          KeySchema: [
            {
              AttributeName: "uniqueId",
              KeyType: "HASH"
            },{
              AttributeName: "bank_name",
              KeyType: "RANGE"
            }
          ],
          Projection: {
            NonKeyAttributes: [ "bank_name" ],
            ProjectionType: "INCLUDE"
          }
        },

      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 16,
        WriteCapacityUnits: 16
      },

      TableName: "bankDetails"

    };
    services.createTable(params).then(function(data){
      res.end(JSON.stringify(data));
    }).catch(function(err){
      res.end(JSON.stringify(err));
    })
  })
  server.get("/deletebanktable",function(req,res){
    var params = {
      TableName: 'bankDetails',
    };
    services.deleteTable(params).then(function(data) {
      // an error occurred
      res.end(JSON.stringify(data)); // successful response
    }).catch(function(err){
      res.end(JSON.stringify(err));
    });
  })
}
