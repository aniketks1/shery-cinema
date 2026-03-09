import transporter from "../utils/mailer.js";

export const sendEmail = async ({ to, subject, html }) => {
	const mailOptions = {
		from: `"Shery Cinema" <${process.env.EMAIL_USER}>`,
		to: to,
		subject: subject,
		html: html,
	};

	await transporter.sendMail(mailOptions);
};

export default sendEmail;
