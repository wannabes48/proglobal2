# Firebase Authentication Email Templates

Here are the premium HTML templates tailored for the ProGlobal Markets branding. You can copy and paste these directly into your **Firebase Console → Authentication → Templates** section. 

Ensure you click the **"Customize action URL"** in Firebase if you want to route these links to your own React app instead of the default Firebase domain.

---

## 1. Email Address Verification

**Subject:** `Verify your email for ProGlobal Markets`

```html
<!DOCTYPE html>
<html>
<body style="background-color: #0d0f12; color: #ffffff; font-family: 'Inter', Helvetica, sans-serif; padding: 40px 20px; text-align: center;">
  <div style="max-w-md; margin: 0 auto; background-color: #1a1d24; border: 1px solid rgba(234, 179, 8, 0.1); border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <h1 style="color: #eab308; margin-bottom: 8px; font-size: 24px;">ProGlobal<span style="font-size: 10px; letter-spacing: 4px; text-transform: uppercase; display: block; opacity: 0.8;">Markets</span></h1>
    <h2 style="font-size: 20px; margin-top: 30px; margin-bottom: 20px;">Verify your identity</h2>
    <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
      Hello %DISPLAY_NAME%,<br><br>
      To secure your institutional portfolio, please verify your email address by clicking the secure link below.
    </p>
    <a href="%LINK%" style="display: inline-block; background: linear-gradient(180deg, #eab308 0%, #b45309 100%); color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Verify Email</a>
    <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">If you didn't request this, you can safely ignore this email.</p>
  </div>
</body>
</html>
```

---

## 2. Password Reset

**Subject:** `Reset your password for ProGlobal Markets`

```html
<!DOCTYPE html>
<html>
<body style="background-color: #0d0f12; color: #ffffff; font-family: 'Inter', Helvetica, sans-serif; padding: 40px 20px; text-align: center;">
  <div style="max-w-md; margin: 0 auto; background-color: #1a1d24; border: 1px solid rgba(234, 179, 8, 0.1); border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <h1 style="color: #eab308; margin-bottom: 8px; font-size: 24px;">ProGlobal<span style="font-size: 10px; letter-spacing: 4px; text-transform: uppercase; display: block; opacity: 0.8;">Markets</span></h1>
    <h2 style="font-size: 20px; margin-top: 30px; margin-bottom: 20px;">Secure Password Reset</h2>
    <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
      Hello %DISPLAY_NAME%,<br><br>
      We received a request to reset the password for your ProGlobal Markets account. Click the button below to establish a new secure password.
    </p>
    <a href="%LINK%" style="display: inline-block; background: linear-gradient(180deg, #eab308 0%, #b45309 100%); color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Reset Password</a>
    <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">For security reasons, this link will expire soon. If you didn't request a reset, please contact support immediately.</p>
  </div>
</body>
</html>
```

---

## 3. Email Address Change

**Subject:** `Confirm your new email for ProGlobal Markets`

```html
<!DOCTYPE html>
<html>
<body style="background-color: #0d0f12; color: #ffffff; font-family: 'Inter', Helvetica, sans-serif; padding: 40px 20px; text-align: center;">
  <div style="max-w-md; margin: 0 auto; background-color: #1a1d24; border: 1px solid rgba(234, 179, 8, 0.1); border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <h1 style="color: #eab308; margin-bottom: 8px; font-size: 24px;">ProGlobal<span style="font-size: 10px; letter-spacing: 4px; text-transform: uppercase; display: block; opacity: 0.8;">Markets</span></h1>
    <h2 style="font-size: 20px; margin-top: 30px; margin-bottom: 20px;">Email Update Request</h2>
    <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
      Hello %DISPLAY_NAME%,<br><br>
      A request was made to change the email address associated with your account to <strong>%NEW_EMAIL%</strong>. Please confirm this change to ensure uninterrupted access.
    </p>
    <a href="%LINK%" style="display: inline-block; background: linear-gradient(180deg, #eab308 0%, #b45309 100%); color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Confirm New Email</a>
    <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">If you did not authorize this change, please ignore this email and your address will remain %EMAIL%.</p>
  </div>
</body>
</html>
```

---

## 4. MFA Enrollment Notification (2FA Setup)
*(Firebase doesn't have a native template specifically for MFA enrollment success, but you can use this structure if you send custom emails via Cloud Functions, or replace standard welcome/alert templates).*

**Subject:** `Security Alert: 2FA Enabled on your account`

```html
<!DOCTYPE html>
<html>
<body style="background-color: #0d0f12; color: #ffffff; font-family: 'Inter', Helvetica, sans-serif; padding: 40px 20px; text-align: center;">
  <div style="max-w-md; margin: 0 auto; background-color: #1a1d24; border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <h1 style="color: #eab308; margin-bottom: 8px; font-size: 24px;">ProGlobal<span style="font-size: 10px; letter-spacing: 4px; text-transform: uppercase; display: block; opacity: 0.8;">Markets</span></h1>
    <h2 style="font-size: 20px; margin-top: 30px; margin-bottom: 20px; color: #4ade80;">Security Upgrade Successful</h2>
    <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
      Hello %DISPLAY_NAME%,<br><br>
      Multi-Factor Authentication (2FA) has been successfully enabled on your ProGlobal account. Your portfolio is now secured with military-grade protection.
    </p>
    <div style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); padding: 15px; border-radius: 8px; margin-bottom: 30px;">
      <p style="color: #4ade80; font-size: 12px; margin: 0;"><strong>Active Protection:</strong> Authenticator App (TOTP)</p>
    </div>
    <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">If you did not perform this action, please secure your account immediately.</p>
  </div>
</body>
</html>
```
