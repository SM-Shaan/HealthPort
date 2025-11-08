"""
One-time fix: Update admin password from bcrypt hash to plain text
"""
from app.database import SessionLocal
from app.models import Admin

db = SessionLocal()
try:
    admin = db.query(Admin).filter(Admin.aemail == 'admin@healthport.com').first()

    if admin:
        # Check if password is hashed (bcrypt hashes are 60 chars)
        if len(admin.apassword) == 60:
            print(f"[FIX] Admin password is hashed ({len(admin.apassword)} chars)")
            print(f"[FIX] Updating to plain text password...")
            admin.apassword = "admin123"
            db.commit()
            print(f"[FIX] ✓ Password updated successfully to: admin123")
        else:
            print(f"[FIX] Password is already plain text ({len(admin.apassword)} chars)")
    else:
        print("[FIX] Admin user not found!")

except Exception as e:
    print(f"[ERROR] Fix failed: {e}")
    db.rollback()
finally:
    db.close()
