const db = require('../config/db')

const emailController = {
    //Render giao dien
    getSignIn:  async (req,res)=>{
        res.render('pages/log-in') 
    },
    getSignUp: (req,res)=>{
        res.render("pages/register")
    },
    getInboxPage: async(req,res)=>{
        const userID = req.user.id
        let [result,data] = await db.query("SELECT * FROM email WHERE userID=? AND status=1",[userID]);
        let countRows = Math.ceil(result.length/5);
        //đếm số trang bắt đầu từ 1, mỗi trang 5 phần tử
        if(countRows == 0) countRows=1;

        //console.log(result,countRows)
        if(!result) return res.json("data do not exist!")
        var newArray = result.slice(0, 5);
        res.render('pages/home',{listuser: newArray, countRows: countRows})
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
       const { recipient,tieude,noidung} = req.body 
       const userID = parseInt(req.user.id)
       const tenfile = req.file.originalname;
       let status_send=0
       let status_receicve=1
       //console.log(req.body,userID,status_send)
       var date = new Date();  // Tạo đối tượng Date
    // Lấy giờ và phút từ đối tượng Date
        var hours = date.getHours();
        var minutes = date.getMinutes();

        // Xác định chuỗi AM hoặc PM
        var meridiem = hours >= 12 ? 'PM' : 'AM';

        // Chuyển đổi sang định dạng 12 giờ
        hours = hours % 12;
        hours = hours ? hours : 12;  // Nếu hours là 0, thì chuyển thành 12

        // Định dạng lại giờ và phút thành chuỗi có định dạng hh:mm AM/PM
        var thoigian = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + meridiem;


        //1. lưu người gửi với status=0
       const [result1,data1] = await db.query(`INSERT INTO email(tieude,noidung,tenfile,status,userID,thoigian) VALUES(?,?,?,?,?,?)`,[tieude,noidung,tenfile,status_send,userID,thoigian]);
       if(!result1) return res.json({msg: "Data 1 do not exist!"})
       //2. lưu người nhận với status=1
       const [result2,data2] = await db.query(`INSERT INTO email(tieude,noidung,tenfile,status,userID,thoigian) VALUES(?,?,?,?,?,?)`,[tieude,noidung,tenfile,status_receicve,recipient,thoigian]);
       if(!result2) return res.json({msg: "Data 2 do not exist!"})
       return res.redirect("/api/inbox-page")

    },
    deleteEmail: async(req,res)=>{
        const emailID = req.params.id
        const [result,data] = await db.query("DELETE FROM email WHERE id=?",[emailID]);
        if(!result) return res.json("data do not exist!")
       return res.redirect("/api/inbox-page")
    },

    panigationEmail: async(req,res)=>{
        const userID = req.user.id
        const pageNumber = req.query.page || 1; // Lấy số trang từ query parameter, mặc định là 1
        const itemsPerPage = 5; // Số phần tử trên mỗi trang
        const offset = (pageNumber - 1) * itemsPerPage;
        const [result,data] = await db.query("SELECT * FROM email WHERE userID=? AND status=1 ORDER BY id LIMIT ? OFFSET ?",[userID,itemsPerPage,offset]);
        if(!result) return res.json("data do not exist!")
       return res.status(200).json({result: result})
    }
}

module.exports = emailController