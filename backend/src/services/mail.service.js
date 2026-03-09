import resend from "../utils/mailer.js";

export const sendEmail = async ({ to, subject, html }) => {
	const { data, error } = await resend.emails.send({
		from: `Shery Cinema <${process.env.EMAIL_FROM}>`,
		to: to,
		subject: subject,
		html: html,
	});
};

export default sendEmail;
