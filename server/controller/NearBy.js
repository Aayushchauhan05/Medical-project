const { doctor } = require("../Modals/User");
const nodemailer = require('nodemailer');

const Findnearby = async (req, res) => {

    const { location, email,disease,phone,address } = req.body;

    try {
        const neardoc = await doctor.aggregate([{
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: location.coordinates,
                },
                distanceField: "dist.calculated",
                maxDistance: 5,
                query: { category: "doctor" },
                includeLocs: "dist.location",
                spherical: true
            }
        }]);

        await res.status(200).json({ neardoc });

       
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'ashtyn99@ethereal.email',
                pass: '4UxYuhCpuTgVqARpyr'
            }
        });

        neardoc.forEach((elem) => {
            const mailOptions = {
                from: "ashtyn99@ethereal.email",
                to: elem.email,

                subject: ` Consultation Request for `,
                text: `
                Hello Dr. ${elem.username},
                
                We have received a request from a patient seeking a consultation regarding "__${disease}__". The following are the patient's contact details:
                
                - *Email :- ${email}
                - *Phone Number:${phone}
                - *Location:${address}
                
                The patient has expressed interest in discussing their condition with you. Please reach out to them at your earliest convenience.
                
                Let us know if you need any further information or assistance.
                
                Thank you for your time.
                
                Best regards,
                
                Medico`,

            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

module.exports = { Findnearby };
