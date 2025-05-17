export const emailVerification = (verificationLink) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EventX - Verify Your Email</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        body, html {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            background-color: #f4f6f9;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
            overflow: hidden;
        }
        .email-header {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -1px;
            margin-bottom: 10px;
        }
        .tagline {
            font-size: 16px;
            font-weight: 300;
            opacity: 0.8;
        }
        .email-content {
            padding: 40px 30px;
            text-align: center;
        }
        .email-content h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .email-content p {
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
        }
        .verify-btn {
            display: inline-block;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white !important;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: transform 0.3s ease;
        }
        .verify-btn:hover {
            transform: scale(1.05);
        }
        .email-footer {
            background-color: #f4f6f9;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #888;
        }
        .email-footer a {
            color: #2575fc;
            text-decoration: none;
        }
        .manual-link {
            margin-top: 20px;
            word-break: break-all;
            font-size: 14px;
            color: #666;
        }
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100%;
                border-radius: 0;
            }
            .email-content {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">EventX</div>
            <div class="tagline">Your Perfect Event, Perfectly Planned</div>
        </div>

        <div class="email-content">
            <h1>Verify Your Email Address</h1>
            <p>Thank you for registering with EventX. Please click the button below to verify your email address:</p>
            <a href="${verificationLink}" class="verify-btn">Verify My Email</a>
            <p class="manual-link">Or copy and paste this link in your browser:<br>${verificationLink}</p>
            <p>This link will expire in 30 minutes.</p>
        </div>

        <div class="email-footer">
            <p>© 2025 EventX. All rights reserved.</p>
            <p>If you didn't register for EventX, please ignore this email or <a href="mailto:support@eventx.com">contact our support</a>.</p>
        </div>
    </div>
</body>
</html>`;

export const resetCodeEmail = (code) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EventX - Password Reset</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        body, html {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            background-color: #f4f6f9;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
            overflow: hidden;
        }
        .email-header {
            background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -1px;
            margin-bottom: 10px;
        }
        .tagline {
            font-size: 16px;
            font-weight: 300;
            opacity: 0.8;
        }
        .email-content {
            padding: 40px 30px;
            text-align: center;
        }
        .email-content h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .email-content p {
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
        }
        .reset-code {
            display: inline-block;
            background-color: #f1f2f3;
            color: #333;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 10px;
            padding: 20px 30px;
            border-radius: 12px;
            margin: 20px 0;
            border: 2px dashed #ddd;
        }
        .reset-note {
            font-size: 14px;
            color: #888;
            margin-top: 20px;
        }
        .email-footer {
            background-color: #f4f6f9;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #888;
        }
        .email-footer a {
            color: #ff4757;
            text-decoration: none;
        }
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100%;
                border-radius: 0;
            }
            .email-content {
                padding: 30px 20px;
            }
            .reset-code {
                font-size: 24px;
                letter-spacing: 5px;
                padding: 15px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">EventX</div>
            <div class="tagline">Your Perfect Event, Perfectly Planned</div>
        </div>

        <div class="email-content">
            <h1>Password Reset</h1>
            <p>We received a request to reset your account password. Use the code below to complete the process:</p>
            <div class="reset-code">${code}</div>
            <p class="reset-note">This code is valid for 15 minutes. Do not share it with anyone.</p>
        </div>

        <div class="email-footer">
            <p>© 2025 EventX. All rights reserved.</p>
            <p>If you didn't request this reset, please <a href="mailto:support@eventx.com">contact our support</a>.</p>
        </div>
    </div>
</body>
</html>`;