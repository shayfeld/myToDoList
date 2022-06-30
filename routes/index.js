const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Models
const User = require('../models/User');
const Item = require('../models/Item');

// Welcome page
router.get('/',(req, res)=>{
    res.render('login')
});

// Dashbord page
router.get('/dashboard', ensureAuthenticated, (req, res)=>{
    Item.find({userId:req.user._id}, (err, items) =>{
        res.render('dashboard',{
            treatmentList: items
        })
    })
    
});


// Add Item Handle
router.post('/', ensureAuthenticated, (req, res)=>{
    const {itemName, itemStyle} = req.body;
    const userId = req.user._id;
    let errors = [];
    //Check required fields
    if(!itemName){
        errors.push({msg:'Please fill the field'});
    }
    
    if(errors.length > 0){
        Item.find({userId:req.user._id}, (err, items) =>{
            res.render('dashboard',{
                errors,
                itemName,
                userId,
                treatmentList:items,
            });
        })
        
    }else{
        const item = new Item({
            itemName:itemName,
            userId:userId,
            itemStyle:itemStyle,
        });
        item.save()
        .then(() => {
            // Back to dashboard
            Item.find({userId:req.user._id}, (err, items) =>{
                res.redirect('dashboard/?treatmentList='+ items)
            })
        })
        .catch(err => console.log(err)); 
    }   

});

// Delete Item Handle
router.get('/deleteItem/:id', ensureAuthenticated, (req, res)=>{
    const id = req.params.id;
    Item.findByIdAndDelete(id)
    .then(()=>{
        // Back to dashboard
        Item.find({userId:req.user._id}, (err, items) =>{
            res.redirect('/dashboard/?treatmentList='+ items)
        })
    })
    .catch((err)=>{
        console.log(err);
    });
});
module.exports = router;