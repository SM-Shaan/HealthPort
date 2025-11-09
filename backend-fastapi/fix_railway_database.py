"""
Fix hospital manager usertype in Railway MySQL database
Run this script with Railway DATABASE_URL environment variable
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

def fix_railway_hospital_managers():
    """Fix hospital manager usertype in Railway database"""

    # Get DATABASE_URL from environment or prompt
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        print("\n" + "="*70)
        print("ERROR: DATABASE_URL environment variable not set!")
        print("="*70)
        print("\nTo fix the Railway database, you need the DATABASE_URL.")
        print("\nOption 1 - Get it from Railway Dashboard:")
        print("  1. Go to https://railway.app/dashboard")
        print("  2. Select your MySQL service")
        print("  3. Go to 'Variables' tab")
        print("  4. Copy the DATABASE_URL value")
        print("\nOption 2 - Run with environment variable:")
        print('  DATABASE_URL="mysql://user:pass@host:port/db" python fix_railway_database.py')
        print("\nOption 3 - Use SQL commands (see fix_railway.sql)")
        print("="*70 + "\n")
        sys.exit(1)

    # Convert mysql:// to mysql+pymysql:// if needed
    if database_url.startswith("mysql://"):
        database_url = database_url.replace("mysql://", "mysql+pymysql://", 1)

    print("\n" + "="*70)
    print("FIXING HOSPITAL MANAGERS IN RAILWAY DATABASE")
    print("="*70)

    try:
        # Create engine
        print("\n[1/4] Connecting to Railway MySQL database...")
        engine = create_engine(database_url)
        Session = sessionmaker(bind=engine)
        session = Session()

        # Test connection
        session.execute(text("SELECT 1"))
        print("✅ Connected successfully!")

        # Check current state
        print("\n[2/4] Checking current hospital manager records...")
        result = session.execute(text("""
            SELECT w.email, w.usertype, m.name
            FROM webuser w
            INNER JOIN hospital_manager m ON w.email = m.email
        """))

        managers = result.fetchall()

        if not managers:
            print("❌ No hospital managers found in database!")
            print("   You may need to run seed_data.py first.")
            session.close()
            return

        print(f"📋 Found {len(managers)} hospital manager(s):")
        for email, usertype, name in managers:
            status = "✅ Correct" if usertype == 'h' else "❌ Wrong"
            print(f"   - {email} ({name}): usertype='{usertype}' {status}")

        # Count how many need fixing
        wrong_count = sum(1 for _, usertype, _ in managers if usertype != 'h')

        if wrong_count == 0:
            print("\n✅ All hospital managers already have correct usertype 'h'")
            session.close()
            return

        # Fix the usertype
        print(f"\n[3/4] Fixing {wrong_count} hospital manager record(s)...")

        update_result = session.execute(text("""
            UPDATE webuser
            SET usertype = 'h'
            WHERE email IN (
                SELECT email FROM hospital_manager
            ) AND usertype != 'h'
        """))

        session.commit()
        rows_affected = update_result.rowcount
        print(f"✅ Updated {rows_affected} record(s)")

        # Verify the fix
        print("\n[4/4] Verifying changes...")
        verify_result = session.execute(text("""
            SELECT w.email, w.usertype, m.name
            FROM webuser w
            INNER JOIN hospital_manager m ON w.email = m.email
        """))

        verified_managers = verify_result.fetchall()
        all_correct = all(usertype == 'h' for _, usertype, _ in verified_managers)

        if all_correct:
            print("✅ All hospital managers now have correct usertype 'h'")
        else:
            print("⚠️ Some managers still have wrong usertype!")

        print("\n" + "="*70)
        print("HOSPITAL MANAGER LOGIN CREDENTIALS")
        print("="*70)
        for email, usertype, name in verified_managers:
            print(f"Email: {email}")
            print(f"Name: {name}")
            print(f"Password: manager123")
            print(f"Usertype: {usertype}")
            print("-" * 70)

        print("\n" + "="*70)
        print("FIX COMPLETED SUCCESSFULLY!")
        print("="*70)
        print("\nHospital managers can now log in at your frontend URL")
        print("="*70 + "\n")

        session.close()

    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        print("\n" + "="*70)
        print("FIX FAILED - See error above")
        print("="*70 + "\n")
        sys.exit(1)

if __name__ == "__main__":
    fix_railway_hospital_managers()
