const nodemailer = require('nodemailer')



const sendEmail =async (options)=>{

    // 1) create transporter 
    const transporter = nodemailer.createTransport({
        host : process.env.EMAIL_HOST,
        port : process.env.EMAIL_PORT ,  //if false => 587 ,, if ture => 465
         secure :true,
         auth : {
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
         },

    })

    // 2) define email options
    const mailOpts = {
        from : "RECA E-SHOP APP",
        to :options.email,
        subject:options.subject,
        text: options.message
    } 

    // 3) send email 
    await transporter.sendMail(mailOpts)
    console.log(process.env.EMAIL_HOST,)
    console.log(process.env.EMAIL_PORT)
    console.log(process.env.EMAIL_USER)
    console.log(process.env.EMAIL_PASS)

}



module.exports = sendEmail