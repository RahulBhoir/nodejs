const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fruitsDB',{ useNewUrlParser: true } )


const fruitSchema = mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  rating: {
    type:Number,
    min:1,
    max: 10
  },
  review: String
});

// this will create a collection named Fruits but we have to pass Fruit. the model will add 's' to it
const Fruit = mongoose.model('Fruit',fruitSchema);

const fruit = new Fruit({
  name:'mango',
  rating:10,
  review:'king of fruits'
});

// fruit.save();

const peopleSchema = mongoose.Schema({
  name: String,
  age:Number,
  favouriteFruit:fruitSchema,

});

const Person = mongoose.model('Person',peopleSchema);


// Fruit.deleteOne({name:'pineapple'},function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log('success');
//   }
// });

// Person.deleteOne({name:'harshita'},function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log('success');
//   }
// });


const cherry = new Fruit({
  name:'cherry',
  rating:10,
  review:'they are small in size'
}
);

const person = new Person({
  name: 'harshita',
  age:5,
  favouriteFruit:cherry,
})

// pineapple.save();
// person.save();



const sonu = new Person({
  name:'Sonu',
  age:16
});

const nimo = new Person({
  name:'Nirmala',
  age:47
});

// Person.insertMany([sonu,nimo],function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log('success');
//   }
// });


// Person.updateOne({_id:"5feadf1f781b4e1eb17966ed"},{name:'Pranali'},function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log('successfully updated the entry');
//   }
// });

// Person.findOneAndRemove({name:'Nirmala'},function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log('successfully deleted the entry');
//   }
// });


Person.updateOne({name:'Rahul'},{favouriteFruit:cherry},function(err){
  if(err){
    console.log(err);
  }else{
    console.log('rahul updated with favourite Fruit cherry');
  }
});


Person.find(function(err,persons){
  if(err){
    console.log(err)
  }else{
    mongoose.connection.close();
    persons.forEach(element => {
      console.log(element.name);
    });
  }
});

