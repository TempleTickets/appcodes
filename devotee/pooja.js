module.exports=function(server,services,bodyParser,uniqueId,marshal,querybuilder,sha512){
    server.post("/getbookedpoojalist",function(req,res){
       // res.end(JSON.stringify(querybuilder().table('pooja')));
        querybuilder().table('pooja')
            .indexName('Index1')
            .select("user_id","id","title","description","significance","pujari_name","price","type","duration",'terms',"samagri",'startdate','enddate','limit','pooja_type','number_days','is_approval')
            //.where("user_id",req.body.user_id.toString())
            .where('uniqueId',uniqueId)
            .then(function(data){
                querybuilder().table("register")
                    .select("id","temple_name","address")
                    .where('uniqueId',uniqueId)
                    .then(function(data3){
                        querybuilder().table('bookedPoojas')
                            .indexName('Index1')
                            .select("id","pooja_id")
                            .where("user_id", req.body.user_id)
                            .where('uniqueId',uniqueId)
                            .then(function(data2){
                                data.Items.forEach(function(val,key){
                                    data.Items[key].isBooked=false;
                                    data2.Items.forEach(function(val2){
                                        if(val.id==val2.pooja_id)
                                        {
                                            data.Items[key].isBooked=true;
                                        }
                                    })
                                    data3.Items.forEach(function(val2){
                                        if(val.user_id.toString()==val2.id.toString())
                                        {
                                            data.Items[key].temple_id=val2.id;
                                            data.Items[key].temple_name=val2.temple_name;
                                            data.Items[key].address=val2.address;
                                        }
                                    })
                                })
                                res.end(JSON.stringify({status:true,data:data.Items}));


                            })
                            .catch(function(err){
                                console.log(err)
                                res.end(JSON.stringify({status:false,error:err}));
                            });
                    }).catch(function(err){
                        res.end(JSON.stringify({status:false,error:err}));
                })

            })
            .catch(function(err){
                console.log(err)
                res.end(JSON.stringify({status:false,error:err}));
            });

    })
}
