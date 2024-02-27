const User = require("../../models/userSchema");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { sendOtp } = require("../../utility/sendotp");
const OTP = require("../../models/otpSchema");
const flash = require("express-flash");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utility/SendMail");

module.exports = {
  initial: async (req, res) => {
    try {
      res.render("user/userpage");
    } catch (error) {
      console.log(error);
    }
  },

  gust: async (req, res) => {
    try {
      res.render("user/gustpage");
    } catch (error) {
      console.log(error);
    }
  },

  signIn: async (req, res) => {
    try {
      res.render("user/login");
    } catch (error) {
      console.log(error);
    }
  },

  postsignin: async (req, res) => {
    try {
      const { Username, Password } = req.body;
      console.log(Username, Password);
      const userdata = await User.findOne({ Email: Username });
      if (userdata) {
        if (userdata.Status == "Active") {
          const ispass = await bcrypt.compare(Password, userdata.userPassword);
          if (ispass && userdata.Status == "Active") {
            req.session.logged = true;
            req.session.user = userdata;

            // generate and send token
            // jwt.sign( )

            res.redirect("/");
          } else {
            req.flash("error", "Incorrect Username or Password");
            res.redirect("/signIn");
          }
        } else {
          req.flash("error", "User has been Blocked");
          res.redirect("/signIn");
        }
      } else {
        req.flash("error", "Email is not registered");
        res.redirect("/signIn");
      }
    } catch (err) {
      console.log(err);
    }
  },

  signUp: async (req, res) => {
    try {
      res.render("user/signUpPage");
    } catch (error) {
      console.log(error);
    }
  },

  signUpPost: async (req, res) => {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const { Name, Email, Password, ConfirmPassword } = req.body;
      const userPassword = await bcrypt.hash(Password, salt);
      const data = await User.findOne({ Email: Email });
      if (data) {
        req.flash("error", "Email Already Registered");
        res.redirect("/signIn");
      } else {
        req.session.Name = Name;
        req.session.Email = Email;
        req.session.Password = userPassword;

        //sending otp
        // const otpstat= await sendOtp(Email)
        // console.log(otpstat)
        // //deleting otp
        // setTimeout(async()=>{
        //     await OTP.deleteOne({Email:Email})
        //     console.log("otp deleted")
        // },120000)

        res.redirect("/send-otp");
      }
    } catch (err) {
      console.log(err);
    }
  },

  getotp: async (req, res) => {
    try {
      if (req.session.Email) {
        const Name = req.session.Name;
        const Email = req.session.Email;
        const userPassword = req.session.Password;
        const otpexist = await OTP.findOne({ Email: Email });
        if (otpexist) {
          res.render("user/otp", { error: "" });
        } else {
          const otpstat = await sendOtp(Email);
          //deleting otp
          setTimeout(async () => {
            await OTP.deleteOne({ Email: Email });
          }, 120000);

          res.render("user/otp", { error: "" });
        }
      } else {
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
    }
  },

  postotp: async (req, res) => {
    try {
      const otpArr = [];
      otpArr.push(req.body.num1);
      otpArr.push(req.body.num2);
      otpArr.push(req.body.num3);
      otpArr.push(req.body.num4);
      const otpNum = otpArr.map(Number);

      const finalOtp = Number(otpArr.join(""));
      const Name = req.session.Name;
      const Email = req.session.Email;
      const userPassword = req.session.Password;
      const generatedOtp = await OTP.findOne({ Email: Email });

      if (generatedOtp.otp == finalOtp) {
        const data = await User.insertMany({ Name, Email, userPassword });
        req.session.logged = true;
        req.session.user = await User.findOne({ Email: Email });
        res.redirect("/");
      } else {
        res.render("user/otp", { error: "Invalied OTP" });
        // res.redirect('/send-otp')
      }
    } catch (error) {
      console.log(error);
    }
  },

  reSendOTP: async (req, res) => {
    try {
      const Email = req.session.Email;
      const otp = await OTP.findOne({ Email });
      if (otp) {
        OTP.deleteOne({ Email });
      }

      const otpstat = await sendOtp(Email);
      //deleting otp
      setTimeout(async () => {
        await OTP.deleteOne({ Email: Email });
        console.log("otp deleted");
      }, 120000);
      console.log(otpstat);

      res.json({ success: true, msg: "otp Sended Successfully" });
    } catch (err) {
      console.log(err);
    }
  },

  getUserProfile: async (req, res) => {
    try {
      const user = req.session.user.Email;
      let userdata = await User.findOne({ Email: user });
      res.render("user/userProfile", { userdata });
    } catch (err) {
      console.log(err);
    }
  },

  postEditName: async (req, res) => {
    try {
      await User.updateOne(
        { Email: req.session.user.Email },
        { $set: { Name: req.body.newName } }
      );

      res.json({ response: true });
    } catch (err) {
      console.log(err);
    }
  },

  postUpdateAddress: async (req, res) => {
    try {
      const Address = req.body;
      console.log(Address);
      const Email = req.session.user.Email;
      const f = await User.updateOne(
        { Email: Email },
        { $push: { Address: Address } }
      );
      if (f) {
        res.json({ success: true });
      }
    } catch (err) {
      console.log(err);
    }
  },

  postUserUpdatePassword: async (req, res) => {
    try {
      const user = await User.findOne({ Email: req.session.user.Email });
      const ispass = await bcrypt.compare(req.body.password, user.userPassword);
      console.log(req.body);
      if (ispass) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const newpassword = await bcrypt.hash(req.body.newPassword, salt);
        await User.updateOne(
          { _id: user._id },
          { $set: { userPassword: newpassword } }
        );
        res.json({ success: true });
      }
    } catch (err) {
      console.log(err);
    }
  },

  getUser: async (req, res) => {
    try {
      const Email = req.session.user.Email;
      const userdata = await User.find({ Email: Email });
      res.json({ response: userdata.Address });
    } catch (err) {
      console.log(err);
    }
  },

  getForgetPassword: async (req, res) => {
    try {
      res.render("user/forgetPassword");
    } catch (err) {
      console.log(err);
    }
  },

  postForgetPassword: async (req, res) => {
    try {
      let email = req.body.email;
      console.log(email);
      // check the email is registered
      const user = await User.findOne({ Email: email });
      if (user) {
        const jwtSecret = process.env.JWTSECRET + user.userPassword;
        const payload = {
          email: user.Email,
          id: user._id,
        };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: "10m" });
        const link = `http://localhost:7000/resetPassword/${email}/${token}`;
        const mailOption = {
          from: process.env.AdminMail,
          to: email,
          subject: "Reset Password",
          text: `Your Reset link Valied for 10 minute ${link}`,
        };

        const mailResponse = await sendEmail.sendMail(mailOption);
        if (mailResponse) {
          res.json({
            success: true,
            msg: "Link has been sended to Your Email",
          });
        } else {
          res.json({ error: true, msg: "Try again later" });
        }
      } else {
        res.json({ error: true, msg: "Email not registered" });
      }
      // resend otp link through email
    } catch (err) {
      console.log(err);
    }
  },

  getResetPassword: async (req, res) => {
    try {
      const token = req.params.token;
      const user = await User.findOne({ Email: req.params.email });
      const jwtSecret = process.env.JWTSECRET + user.userPassword;
      if (user) {
        try {
          jwt.verify(token, jwtSecret);
          res.render("user/resetPassword", { email: user.Email });
        } catch (erorr) {
          console.log(erorr);
          req.flash("error", "Token Expired");
          res.redirect("/forgotPassword");
        }
      } else {
        req.flash("error", "Email is not registered");
        res.redirect("/signIn");
      }
    } catch (error) {
      console.log(error);
    }
  },

  postResetPassword: async (req, res) => {
    try {
      const token = req.params.token;
      const user = await User.findOne({ Email: req.params.email });
      const jwtSecret = process.env.JWTSECRET + user.userPassword;
      if (user) {
        try {
          jwt.verify(token, jwtSecret);

          const saltRounds = 10;
          const salt = await bcrypt.genSalt(saltRounds);
          const newpassword = await bcrypt.hash(req.body.Password, salt);
          const stat = await User.updateOne(
            { _id: user._id },
            { $set: { userPassword: newpassword } }
          );
          if (stat) {
            req.flash("error", "Password Updated Successfully");
            res.redirect("/signIn");
          } else {
            req.flash("error", "Error While Updating Password");
            res.redirect("/signIn");
          }
        } catch (erorr) {
          console.log(erorr);
          req.flash("error", "Token Expired");
          res.redirect("/forgotPassword");
        }
      } else {
        req.flash("error", "Email is not registered");
        res.redirect("/signIn");
      }
    } catch (error) {
      console.log(error);
    }
  },
};
