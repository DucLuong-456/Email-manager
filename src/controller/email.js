const db = require('../config/db')

const emailController = {
    //Render giao dien
    getSignIn:  async (req,res)=>{
        //Callback
        // db.query("SELECT * FROM user", function(err,data){
        //     console.log(data)
        //     res.send("connect successed!")
        // });

        //await 
        // const [result,data] = await db.query("SELECT * FROM user");
        // if(!result) return res.json("data do not exist!")
        // console.log(result)
        // res.send("connect successed!")
        res.render('pages/log-in') 
    },
    getSignUp: (req,res)=>{
        res.render("pages/register")
    },
    getInboxPage: async(req,res)=>{
        const userID = req.user.id
        const [result,data] = await db.query("SELECT * FROM email WHERE userID=? AND status=1",[userID]);
        if(!result) return res.json("data do not exist!")
        res.render('pages/home',{listuser: result})
    },
    getOutboxPage: async(req,res)=>{
        const userID = req.user.id
        const [result,data] = await db.query("SELECT * FROM email WHERE userID=? AND status=0",[userID]);
        if(!result) return res.json("data do not exist!")
        res.render('pages/outbox',{listuser: result})
    },
    getEmailDetail: async(req,res)=>{
        const emailID = req.params.id
        const [result,data] = await db.query("SELECT * FROM email WHERE id=?",[emailID]);
        if(!result) return res.json("data do not exist!")
        res.render('pages/detail-email',{emailDetail: result})
    },
    getCreateEmail: async(req,res)=>{
        const [result,data] = await db.query("SELECT * FROM user");
        if(!result) return res.json("data do not exist!")
        res.render('pages/compose-email',{listuser: result})
    },
    Logout: (req,res)=>{
        res.clearCookie('username')
        res.clearCookie('id')
        return res.redirect('/api/sign-in')
    },

    //handler
    createUser: async(req,res)=>{
        const {fullname,emailaddress,password} = req.body
        const [result,data] = await db.query(`INSERT INTO user(fullname,emailaddress,password) VALUES(?,?,?)`,[fullname,emailaddress,password]);
        if(!result) return res.json({msg: "Data do not exist!"})
        //return res.json({msg:"create user successed!"})
        return res.redirect("/api/sign-in")
        
    },
    login: async(req,res)=>{
        const {fullname,password} = req.body
        const [result,data] = await db.query("SELECT * FROM user WHERE fullname= ?",[fullname]);
        if(!result[0]) return res.json({msg: "Data do not exist!"})
        if(result[0].password !== password) return res.json({msg: "Đăng nhập không thành công!"})
        res.cookie("id",result[0].id)
        res.cookie("username",fullname)
       // return res.json({msg:"login successed!"})
       return res.redirect("/api/inbox-page")

    },
    CreateEmail: async(req,res)=>{
       const { recipient,tieude,noidung,tenfile} = req.body 
       const userID = parseInt(req.user.id)
       let status_send=0
       let status_receicve=1
       //console.log(req.body,userID,status_send)
       //1. lưu người gửi với status=0
       const [result1,data1] = await db.query(`INSERT INTO email(tieude,noidung,tenfile,status,userID) VALUES(?,?,?,?,?)`,[tieude,noidung,tenfile,status_send,userID]);
       if(!result1) return res.json({msg: "Data 1 do not exist!"})
       //2. lưu người nhận với status=1
       const [result2,data2] = await db.query(`INSERT INTO email(tieude,noidung,tenfile,status,userID) VALUES(?,?,?,?,?)`,[tieude,noidung,tenfile,status_receicve,recipient]);
       if(!result2) return res.json({msg: "Data 2 do not exist!"})
       return res.redirect("/api/inbox-page")

    }
}

module.exports = emailController