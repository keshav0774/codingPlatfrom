// const nodemailer = require("nodemailer");


// const transporter = nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         // type:"OAuth2",
//         user:process.env.USER_MAIL,
//         pass:process.env.USER_PASSWORD,
//     }
// })


// const sendResetEmail = async(email, resetCode, firstName)=>{

//  const sentinfo = await transporter.sendMail({
//         from: `"CodeIt" <${process.env.USER_MAIL}>`,
//         to: email,
//         subject: 'Password Reset Code',
//         html: `<h1>Your code: ${resetCode}</h1>`
//     });
//     console.log(sentinfo)
//     return sentinfo;
// }

// const sendVerificationMail = async(email, resetCode, firstName)=>{

//     const sentInfo = await transporter.sendMail({
//         from: `"CodeIt" <${process.env.USER_MAIL}>`,
//         to: email,
//         subject: 'Verify Your CodeIt Email', 
//         html: `
//             <h2>Welcome ${firstName}!</h2>
//             <p>Your email verification code is:</p>
//             <h1>${resetCode}</h1>
//             <p>Verify your email to start coding!</p>
//         `});
//     return sentInfo;
// }

// const sendTempPassword = async (mail , password)=>{
//     const sentinfo = await transporter.sendMail({
//         from: `"CodeIt" <${process.env.USER_MAIL}>`,
//         to: mail,
//         subject: 'Temporary Password',
//         html: `<h1>Your code: ${password}</h1>`
//     });
//     console.log(sentinfo)
//     return sentinfo;
// }


// const sendWelcomeEmail = async (email, name) => {
//     console.log("welcome api call ")
//     try {
//         const mailOptions = {
//             from: `"CodeIt" <${process.env.USER_MAIL}>`,
//             to: email,
//             subject: 'Welcome to CodeIt! 🚀',
//             text: `Hello ${name} ,

// Welcome to CodeIt! Your account has been successfully created.

// What you can do:
// • Run code in 10+ languages
// • Debug with your team
// • Submit solutions

// Happy Coding!
// Team CodeIt
//             `
//         };

//         const info = await transporter.sendMail(mailOptions);
//         console.log(` Welcome email sent to ${email}`);
//         return info;

//     } catch (error) {
//         console.error(' Welcome email error:', error);
//         throw error;
//     }
// };


// module.exports = {sendResetEmail,sendVerificationMail, sendWelcomeEmail, sendTempPassword}

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.USER_PASSWORD,
    }
});

// ── Shared base template ──
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CodeIt</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding:28px 36px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="display:inline-block;background:#ffffff;color:#000000;font-family:'Courier New',monospace;font-size:12px;font-weight:700;padding:8px 10px;border-radius:8px;letter-spacing:-0.5px;">&lt;/&gt;</div>
                  </td>
                  <td style="padding-left:12px;">
                    <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">CodeIt</span>
                    <br/>
                    <span style="font-size:11px;color:#48484a;letter-spacing:0.5px;">Run. Debug. Submit.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px 36px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);">
              <p style="margin:0;font-size:11px;color:#48484a;line-height:1.6;">
                This email was sent by <strong style="color:#98989d;">CodeIt</strong>. If you didn't request this, you can safely ignore it.
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#2a2a2e;">© 2026 CodeIt. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ── 1. Send OTP (Forget Password) ──
const sendResetEmail = async (email, resetCode, firstName) => {
    const content = `
        <h2 style="margin:0 0 6px;font-size:20px;font-weight:600;color:#ffffff;letter-spacing:-0.3px;">Password Reset Request</h2>
        <p style="margin:0 0 24px;font-size:13px;color:#48484a;">Hi ${firstName}, we received a request to reset your CodeIt password.</p>

        <p style="margin:0 0 12px;font-size:13px;color:#98989d;">Use the code below to reset your password. It expires in <strong style="color:#ff9f0a;">10 minutes</strong>.</p>

        <div style="background:#1c1c1e;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
          <span style="font-family:'Courier New',monospace;font-size:32px;font-weight:700;color:#ffffff;letter-spacing:10px;">${resetCode}</span>
        </div>

        <div style="background:rgba(255,69,58,0.06);border:1px solid rgba(255,69,58,0.15);border-radius:10px;padding:14px 16px;">
          <p style="margin:0;font-size:12px;color:#ff453a;">⚠ Never share this code with anyone. CodeIt will never ask for your OTP.</p>
        </div>
    `;
    const info = await transporter.sendMail({
        from: `"CodeIt" <${process.env.USER_MAIL}>`,
        to: email,
        subject: 'Your CodeIt Password Reset Code',
        html: baseTemplate(content)
    });
    console.log("Reset email sent:", info.messageId);
    return info;
};

// ── 2. Email Verification ──
const sendVerificationMail = async (email, resetCode, firstName) => {
    const content = `
        <h2 style="margin:0 0 6px;font-size:20px;font-weight:600;color:#ffffff;letter-spacing:-0.3px;">Verify Your Email</h2>
        <p style="margin:0 0 24px;font-size:13px;color:#48484a;">Welcome to CodeIt, ${firstName}! One last step — verify your email to start coding.</p>

        <p style="margin:0 0 12px;font-size:13px;color:#98989d;">Enter this code to complete your registration. Expires in <strong style="color:#ff9f0a;">10 minutes</strong>.</p>

        <div style="background:#1c1c1e;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
          <span style="font-family:'Courier New',monospace;font-size:32px;font-weight:700;color:#ffffff;letter-spacing:10px;">${resetCode}</span>
        </div>

        <div style="background:rgba(50,215,75,0.05);border:1px solid rgba(50,215,75,0.15);border-radius:10px;padding:14px 16px;">
          <p style="margin:0;font-size:12px;color:#32d74b;">✓ Once verified, you'll have full access to all CodeIt features.</p>
        </div>
    `;
    const info = await transporter.sendMail({
        from: `"CodeIt" <${process.env.USER_MAIL}>`,
        to: email,
        subject: 'Verify Your CodeIt Account',
        html: baseTemplate(content)
    });
    return info;
};

// ── 3. Temp Password ──
const sendTempPassword = async (mail, password) => {
    const content = `
        <h2 style="margin:0 0 6px;font-size:20px;font-weight:600;color:#ffffff;letter-spacing:-0.3px;">Your Temporary Password</h2>
        <p style="margin:0 0 24px;font-size:13px;color:#48484a;">Your password has been successfully reset. Use the temporary password below to login.</p>

        <div style="background:#1c1c1e;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px 24px;margin:0 0 24px;">
          <p style="margin:0 0 6px;font-size:11px;color:#48484a;text-transform:uppercase;letter-spacing:0.08em;">Temporary Password</p>
          <span style="font-family:'Courier New',monospace;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:2px;">${password}</span>
        </div>

        <div style="background:rgba(255,159,10,0.06);border:1px solid rgba(255,159,10,0.15);border-radius:10px;padding:14px 16px;">
          <p style="margin:0;font-size:12px;color:#ff9f0a;">⚠ Please update your password immediately after logging in for security.</p>
        </div>
    `;
    const info = await transporter.sendMail({
        from: `"CodeIt" <${process.env.USER_MAIL}>`,
        to: mail,
        subject: 'Your CodeIt Temporary Password',
        html: baseTemplate(content)
    });
    console.log("Temp password email sent:", info.messageId);
    return info;
};

// ── 4. Welcome Email ──
const sendWelcomeEmail = async (email, name) => {
    console.log("Welcome email sending...");
    const content = `
        <h2 style="margin:0 0 6px;font-size:20px;font-weight:600;color:#ffffff;letter-spacing:-0.3px;">Welcome to CodeIt, ${name}! 🚀</h2>
        <p style="margin:0 0 24px;font-size:13px;color:#48484a;">Your account has been successfully created. You're all set to start your coding journey.</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          ${[
            { icon: '⚡', title: 'Run Code Instantly', desc: 'Execute code in 10+ languages with zero setup.' },
            { icon: '🧠', title: 'AI Assistant', desc: 'Get hints and guidance from our built-in AI.' },
            { icon: '📊', title: 'Track Progress', desc: 'Monitor your solved problems and submissions.' },
            { icon: '🏆', title: 'Compete & Grow', desc: 'Solve challenges and climb the leaderboard.' },
          ].map(f => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:36px;">
                      <div style="width:28px;height:28px;background:#1c1c1e;border:1px solid rgba(255,255,255,0.06);border-radius:7px;text-align:center;line-height:28px;font-size:13px;">${f.icon}</div>
                    </td>
                    <td style="padding-left:12px;">
                      <p style="margin:0;font-size:13px;font-weight:600;color:#f5f5f7;">${f.title}</p>
                      <p style="margin:2px 0 0;font-size:11px;color:#48484a;">${f.desc}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          `).join('')}
        </table>

        <div style="text-align:center;">
          <a href="#" style="display:inline-block;background:#ffffff;color:#000000;font-size:13px;font-weight:600;padding:12px 28px;border-radius:10px;text-decoration:none;letter-spacing:-0.2px;">Start Coding →</a>
        </div>
    `;
    const info = await transporter.sendMail({
        from: `"CodeIt" <${process.env.USER_MAIL}>`,
        to: email,
        subject: 'Welcome to CodeIt! 🚀',
        html: baseTemplate(content)
    });
    console.log(`Welcome email sent to ${email}`);
    return info;
};

module.exports = { sendResetEmail, sendVerificationMail, sendWelcomeEmail, sendTempPassword };