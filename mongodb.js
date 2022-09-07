db.leads.insertMany([
    {"name": "From Channel", "state": "Tamil Nadu"}, 
    {"name": "From Mumbai", "state": "Maharashtra"}
])

db.leads.updateMany(
    {"isActive": true},
    {
        $set: {
            "isActive": false
        }
    }
)

//Queries
//Eq
//lt - less than
//lte
//gt
//gte

//$and
//$or

// 1. find() - will return all the documents in the collection
// 2. db.leads.find({"Tax": "30"})
// 3. db.leads.find({"Tax": "30", "Salary": "120000"}) AND by default
// 4. Find method with tax less than 30 db.leads.find({"Tax": {$lte: "30"}})
// 5. db.leads.find({$and: [{"Tax": "30"}, {"salary": {$lte: "100000"}}]})


// db.leads.find()
// db.leads.find({}, {"city":1}) - get city key from all documents in the collection
// in most cases you will need this _id for processing needs
// click/delete/remove/edit -> 
// db.leads.find({}, {"city":1, "_id": 0})
// db.leads.find({"Tax": {$lte: "30"}}, {"Tax":1, "_id": 0})