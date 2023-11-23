
const auth = async(req,res,next)=>{
    try{
        const {username,id} = req.cookies
        //console.log(req.cookies)
        if(!username && !id) return res.json({msg:"Chưa xác thực!"})
        req.user = {username,id}
        next()
    }catch(err)
    {
        return res.json({mgs: err.message});
    }
    
}

module.exports = auth
