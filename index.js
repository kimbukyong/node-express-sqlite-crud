var express = require('express');
var app = express();

//let comments = [];
const { Sequelize, DataTypes } = require('sequelize');
//const sequelize = new Sequelize('sqlite::memory:');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

(async () => {
  await sequelize.sync({ force: false }); //force: true는 기존에 DB가 있더라도 재생성하겠다는 의미이다.
  console.log("All models were synchronized successfully.");
})();


app.use(express.json()) 
app.use(express.urlencoded({extended:true}))

// set the view engine to ejs
app.set('view engine', 'ejs'); //나가는 경로

// use res.render to load up an ejs view file

// index page
app.get('/', async function(req, res) {
  
  const comments = await Comments.findAll();
  res.render('index',{comments:comments});
});

app.get('/create', function(req, res) {
  res.send('hi')
  console.log(req.query)
});

app.post('/create', async function(req, res) {
  //res.send('Post-hi')
  console.log(req.body)
  const{content} = req.body

  //comments.push(content)  //파이썬으로 보면 append 같은 역할
  //console.log(comments) 
  const jane = await Comments.create({ content: content });
  console.log("Jane's auto-generated ID:", jane.id);

  res.redirect('/')  // 리다렉트로 다시 index로 가라. 

});

app.post('/update/:id', async function(req, res) {
  
  console.log(req.params)
  console.log(req.body)
  
  const{content} = req.body
  const {id} = req.params

  await Comments.update({ content: content }, {
    where: {
      id: id
    }
  });

  //await Comments.create({ content: content });
  res.redirect('/')  // 리다렉트로 다시 index로 가라. 
});

app.post('/delete/:id', async function(req, res) {
  
  console.log(req.params)
  //console.log(req.body)
  
  //const{content} = req.body
  const {id} = req.params

  await Comments.destroy( {
    where: {
      id: id
    }
  });
  //await Comments.create({ content: content });
  res.redirect('/')  // 리다렉트로 다시 index로 가라. 
});



app.listen(8080);
console.log('Server is listening on port 8080');