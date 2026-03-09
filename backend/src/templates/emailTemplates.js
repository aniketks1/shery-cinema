export const verificationEmailTemplate = (name, verificationLink) => {
	return `
	<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Email Verification</title>

<style>
	body{
		margin:0;
		padding:0;
		background:#f4f6fb;
		font-family: Arial, Helvetica, sans-serif;
	}

	.container{
		max-width:600px;
		margin:40px auto;
		background:#ffffff;
		border-radius:10px;
		box-shadow:0 8px 20px rgba(0,0,0,0.08);
		overflow:hidden;
	}

	.header{
		background:linear-gradient(135deg,#4f46e5,#6366f1);
		color:white;
		text-align:center;
		padding:30px;
	}

	.header h1{
		margin:0;
		font-size:26px;
	}

	.content{
		padding:35px;
		color:#333;
		text-align:center;
	}

	.content h2{
		margin-top:0;
		color:#222;
	}

	.content p{
		line-height:1.6;
		color:#555;
	}

	.verify-btn{
		text-decoration:none;
		display:inline-block;
		margin-top:25px;
		padding:14px 30px;
		background:#4f46e5;
		color:#fff;
		border-radius:6px;
		font-weight:bold;
		font-size:15px;
		transition:background 0.3s ease;
	}

	.verify-btn:hover{
		background:#4338ca;
	}

	.link-box{
		margin-top:25px;
		word-break:break-all;
		background:#f5f7ff;
		padding:12px;
		border-radius:5px;
		font-size:13px;
		color:#555;
	}

	.footer{
		text-align:center;
		padding:20px;
		font-size:12px;
		color:#888;
		background:#fafafa;
		border-top:1px solid #eee;
	}
</style>

</head>

<body>

<div class="container">

	<div class="header">
		<h1>Email Verification</h1>
	</div>

	<div class="content">
		<h2>Hello ${name} 👋</h2>

		<p>
			Thank you for creating an account.  
			Please verify your email address to activate your account.
		</p>

		<a class="verify-btn" href="${verificationLink}">
			Verify Email
		</a>

		<p style="margin-top:30px;">
			This verification link will expire in <strong>10 minutes</strong>.
		</p>

		<div class="link-box">
			If the button does not work, copy and paste this link into your browser:<br>
			${verificationLink}
		</div>

	</div>

	<div class="footer">
		<p>
			If you did not create this account, you can safely ignore this email.
		</p>
	</div>

</div>

</body>
</html>
	`;
};
