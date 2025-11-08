"""
Quick script to check if admin user exists in database
"""
from app.database import SessionLocal
from app.models import WebUser, Admin

db = SessionLocal()
try:
    print("=" * 50)
    print("Checking Admin User in Database")
    print("=" * 50)

    # Check WebUser
    webuser = db.query(WebUser).filter(WebUser.email == 'admin@healthport.com').first()
    if webuser:
        print(f'✓ WebUser exists')
        print(f'  Email: {webuser.email}')
        print(f'  UserType: {webuser.usertype}')
    else:
        print('✗ WebUser NOT found for admin@healthport.com')

    print()

    # Check Admin
    admin = db.query(Admin).filter(Admin.aemail == 'admin@healthport.com').first()
    if admin:
        print(f'✓ Admin profile exists')
        print(f'  Email: {admin.aemail}')
        print(f'  Password: {admin.apassword}')
    else:
        print('✗ Admin profile NOT found for admin@healthport.com')

    print("=" * 50)

    # If not found, create it
    if not webuser or not admin:
        print("\nAttempting to create admin user...")
        from seed_data import seed_admin
        seed_admin(db)
        print("Done! Try checking again.")

finally:
    db.close()
