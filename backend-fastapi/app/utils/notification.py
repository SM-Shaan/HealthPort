import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class NotificationService:
    """Service for sending notifications via email"""

    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@healthport.com")

    def send_email(
        self,
        to_email: str,
        subject: str,
        body: str,
        html_body: Optional[str] = None
    ) -> bool:
        """
        Send an email notification

        Args:
            to_email: Recipient email address
            subject: Email subject
            body: Plain text email body
            html_body: Optional HTML email body

        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Create message
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.from_email
            msg["To"] = to_email

            # Add plain text part
            text_part = MIMEText(body, "plain")
            msg.attach(text_part)

            # Add HTML part if provided
            if html_body:
                html_part = MIMEText(html_body, "html")
                msg.attach(html_part)

            # Send email
            if self.smtp_username and self.smtp_password:
                with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                    server.starttls()
                    server.login(self.smtp_username, self.smtp_password)
                    server.send_message(msg)
                return True
            else:
                # If no SMTP credentials, log the email (for development)
                print(f"\n[EMAIL LOG - No SMTP credentials configured]")
                print(f"To: {to_email}")
                print(f"Subject: {subject}")
                print(f"Body:\n{body}")
                print(f"{'='*60}\n")
                return True

        except Exception as e:
            print(f"Error sending email to {to_email}: {str(e)}")
            return False

    def send_appointment_confirmation(
        self,
        patient_email: str,
        patient_name: str,
        doctor_name: str,
        appointment_date: datetime,
        appointment_number: int,
        hospital_name: str = "HealthPort"
    ) -> bool:
        """Send appointment confirmation email to patient"""
        subject = f"Appointment Confirmation - {hospital_name}"

        body = f"""
Dear {patient_name},

Your appointment has been successfully booked!

Appointment Details:
- Appointment Number: #{appointment_number}
- Doctor: Dr. {doctor_name}
- Date & Time: {appointment_date.strftime('%B %d, %Y at %I:%M %p')}
- Hospital: {hospital_name}

Please arrive 15 minutes before your appointment time.

If you need to cancel or reschedule, please contact us at least 24 hours in advance.

Thank you for choosing {hospital_name}!

Best regards,
The {hospital_name} Team
        """

        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2563eb;">Appointment Confirmation</h2>
            <p>Dear <strong>{patient_name}</strong>,</p>
            <p>Your appointment has been successfully booked!</p>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin-top: 0;">Appointment Details</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Appointment Number:</strong> #{appointment_number}</li>
                    <li><strong>Doctor:</strong> Dr. {doctor_name}</li>
                    <li><strong>Date & Time:</strong> {appointment_date.strftime('%B %d, %Y at %I:%M %p')}</li>
                    <li><strong>Hospital:</strong> {hospital_name}</li>
                </ul>
            </div>

            <p><strong>Important:</strong> Please arrive 15 minutes before your appointment time.</p>
            <p>If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>

            <p>Thank you for choosing {hospital_name}!</p>

            <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>The {hospital_name} Team</strong>
            </p>
        </body>
        </html>
        """

        return self.send_email(patient_email, subject, body, html_body)

    def send_doctor_appointment_notification(
        self,
        doctor_email: str,
        doctor_name: str,
        patient_name: str,
        appointment_date: datetime,
        appointment_number: int
    ) -> bool:
        """Send new appointment notification to doctor"""
        subject = "New Appointment Booked"

        body = f"""
Dear Dr. {doctor_name},

A new appointment has been booked with you.

Appointment Details:
- Appointment Number: #{appointment_number}
- Patient: {patient_name}
- Date & Time: {appointment_date.strftime('%B %d, %Y at %I:%M %p')}

Please review your schedule accordingly.

Best regards,
HealthPort Team
        """

        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2563eb;">New Appointment Booked</h2>
            <p>Dear <strong>Dr. {doctor_name}</strong>,</p>
            <p>A new appointment has been booked with you.</p>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin-top: 0;">Appointment Details</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Appointment Number:</strong> #{appointment_number}</li>
                    <li><strong>Patient:</strong> {patient_name}</li>
                    <li><strong>Date & Time:</strong> {appointment_date.strftime('%B %d, %Y at %I:%M %p')}</li>
                </ul>
            </div>

            <p>Please review your schedule accordingly.</p>

            <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>HealthPort Team</strong>
            </p>
        </body>
        </html>
        """

        return self.send_email(doctor_email, subject, body, html_body)

# Create a singleton instance
notification_service = NotificationService()
