"""
Fix existing hospital manager records
Changes usertype from 'm' to 'h' in webuser table
"""
from app.database import SessionLocal
from app.models import WebUser, HospitalManager

def fix_hospital_managers():
    """Fix hospital manager usertype in database"""
    db = SessionLocal()

    try:
        # Get all hospital managers
        managers = db.query(HospitalManager).all()

        if not managers:
            print("[FIX] No hospital managers found in database")
            return

        print(f"[FIX] Found {len(managers)} hospital managers")
        fixed_count = 0

        for manager in managers:
            # Find corresponding WebUser
            webuser = db.query(WebUser).filter(WebUser.email == manager.email).first()

            if not webuser:
                print(f"[WARNING] No WebUser found for manager: {manager.email}")
                continue

            if webuser.usertype == 'm':
                print(f"[FIX] Fixing {manager.email}: usertype 'm' -> 'h'")
                webuser.usertype = 'h'
                fixed_count += 1
            elif webuser.usertype == 'h':
                print(f"[SKIP] {manager.email} already has correct usertype 'h'")
            else:
                print(f"[WARNING] {manager.email} has unexpected usertype: '{webuser.usertype}'")

        if fixed_count > 0:
            db.commit()
            print(f"\n[SUCCESS] Fixed {fixed_count} hospital manager records!")
        else:
            print(f"\n[INFO] No fixes needed - all records correct")

        print("\nHospital Manager Login Credentials:")
        print("-" * 60)
        for manager in managers:
            print(f"Email: {manager.email} | Password: manager123")
        print("-" * 60)

    except Exception as e:
        print(f"[ERROR] Fix failed: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "="*60)
    print("FIXING HOSPITAL MANAGER LOGIN ISSUE")
    print("="*60 + "\n")
    fix_hospital_managers()
    print("\n" + "="*60)
    print("FIX COMPLETED")
    print("="*60 + "\n")
