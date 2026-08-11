// Production email endpoint configuration.
// The frontend submits to /api/contact.
// Connect that endpoint to the chosen email provider after deployment.
// Never place SMTP passwords, API keys, or other secrets in this file.
window.PARLOR_CONTACT_CONFIG = { endpoint: "/api/contact" };
