const { default: mongoose } = require('mongoose');
const {instance} = require('../config/razorpay');
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/courseEnrollmentEmail");



//capture the payment and inintiate the razorpay order
exports.capturePayment = async (req,res) => {
    // get courseId & userId
    const { course_id } = req.body;
    const {userId} = req.user.id;
    //validation
    //valid courseid
    if(!course_id) {
        return res.json({
            success:false,
            message:'Please provide valid course id'
        })
    };
    //valid course detail
    let course;
    try {
        course = await Course.findById(course_id);
        if (!course) {
                return res.json({ 
                    success: false, 
                    message: "Could not find the course" 
                });
            }
    
    //user already pay for the same course

    const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({ 
                    success: false, 
                    message: "Student is already Enrolled" 
                });
            }
        }
    catch (error) {
         console.log(error);
         return res.status(500).json({
            success: false, 
            message: error.message });
    }
    
    //order create
    const amount = course.price;
     const currency = "INR";

     const options = {
        amount: amount*100,//amount multi by 100 beacuse payment gateways (like Razorpay, Stripe, etc.) 
        // expect the amount in the smallest unit of the currency, ₹1 = 100 paise
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{//-->ab ye notes jab payement authorise ho jaayega tab kaam aayenge..it will provide course and user id to the course 
            //provider that which couse to be provided to which user
            courseId: course_id,
            userId,
        }
     };
     try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        //return response
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,

        });
     } catch (error) {
        console.log(error);
        return res.json({ 
            success: false,
            mesage: "Could not Initiate Order"
         });
     }
    


};

//verify signature of razporpay and server
exports.verifSignature = async (req,res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["X-razorpay-signature"];

    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature===digest) {
        console.log("Payment is Authorised");

        const {courseId , userId} = req.body.payload.payment.entity.notes;

        try {
            //fulfil the action

            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{studentsEnrolled: userId}},
                {new:true},
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:'Course not found',
                });
            }

            console.log(enrolledCourse);

            //find the student and add the course to theri list of enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                {_id:userId},
                {$push:{courses: courseId}},
                {new:true},
            );

            console.log(enrolledStudent);

            //mail send krdo confirmation wala
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulations, you are onboarded into new codehelp course",
            );

            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                mesage:"Signature Verified and course Added",
            });

        } 
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }

    }
    else {
        return res.status(400).json({
            success:false,
            message:"Invalid request",
        })
    }
};