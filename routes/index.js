let express = require('express');
// console.log(express);
let router = express.Router();
const md5 = require('blueimp-md5')

const {UserModel} = require('../db/models')
// console.log(UserModel);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/*post register page*/
router.post('/register',(req,res)=> {
  //获取请求参数
  const {username, password, type} = req.body;
  // 2. 处理: 根据username查询users集合, 如果有, 直接返回了一个失败的提示数据, 如果没有, 保存, 完成后返回一个成功的信息
  UserModel.findOne({username}, (error, userDoc) => {
    if (userDoc) {
      //  此用户已存在
      //  返回失败响应
      res.json({code: 1, msg: '此用户已存在'});
    } else {
      //  此用户不存在，可以注册
      //  向浏览器返回一个cookie数据（实现注册成功后可以自动登录）new
      // new UserModel({username, password: md5(password), type}).save((error,userDoc)=>{
      //   res.cookie('userId', userDoc._id, {maxAge: 1000 * 60 * 60 * 24 * 7});
      //   res.json({code:0,data:{_id:userDoc._id,username,type}});
      // })

    }
  })
})

/*post login page*/
  const filter = {password:0,__v:0};
  //登录的路由
  router.post('/login',function (req,res) {
    const {username,password}=req.body;
    UserModel.findOne({username,password:md5(password)},filter,(error,userDoc)=>{
      if(userDoc){
        //  此用户已存在,可以登录
        //      // 向浏览器返回一个cookie数据(实现7天免登陆)
        res.cookie('userId',userDoc._id,{maxAge:1000*60*60*24*7});
        res.send({code:0,data:{_id:userDoc._id,username,type}})
      }else{
        res.send({code: 1, msg: '用户名或密码错误!'})
      }
    })
  })
module.exports = router;
