# FireMail-Webhook

FireMail-Webhook is an open-source project designed to send email notifications using Firebase Functions whenever an email sent through Mailgun is delivered, opened, or clicked. It leverages Mailgun's webhook feature to trigger Firebase Functions, which then use Nodemailer to dispatch notifications.

## Features

- **Email Delivery Notifications**: Get notified when your emails are successfully delivered.
- **Email Interaction Tracking**: Receive alerts when recipients open or click on links within your emails.
- **Secure & Scalable**: Built on Firebase Functions for secure and scalable email event handling.
- **Customizable Notifications**: Easy to customize email notification content for different event types.

## Getting Started

### Prerequisites

- A Firebase account and a Firebase project.
- A Mailgun account with SMTP and webhook configuration.
- Node.js (version 18 or later recommended).

### Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/imasimali/FireMail-Webhook.git
   cd FireMail-Webhook
   ```

2. **Configure Firebase**

   - Set up Firebase CLI and login to your Firebase account.
   - Initialize Firebase in your project directory if you haven't already.

3. **Set Environment Variables**

   Configure your Mailgun SMTP credentials and Firebase project details as GitHub secrets for secure deployment.

   - `SMTP_EMAIL`: Your Mailgun SMTP email.
   - `SMTP_PASS`: Your Mailgun SMTP password.
   - `FIREBASE_PROJECT`: Your Firebase project ID.
   - `FIREBASE_TOKEN`: Your Firebase CI token.

4. **Deploy to Firebase**

   Push your changes to the `main` branch to automatically deploy your Firebase functions using GitHub Actions.

### Usage

Configure your Mailgun webhook to send events to your Firebase function's endpoint. The function will process these events and send email notifications accordingly.

## Contributing

We welcome contributions! Please feel free to fork the repository, make changes, and submit pull requests. You can also open issues for bugs, feature requests, or documentation improvements.

## License

This project is open source and available under the [MIT License](LICENSE).
