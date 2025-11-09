-- SQL Script to Fix Hospital Manager Login Issue
-- Run this directly in Railway MySQL console or any MySQL client

-- ============================================================
-- STEP 1: Check current state
-- ============================================================
SELECT
    'Current State' as Info,
    w.email,
    w.usertype,
    m.name as manager_name
FROM webuser w
INNER JOIN hospital_manager m ON w.email = m.email;

-- ============================================================
-- STEP 2: Fix the usertype (Change 'm' to 'h')
-- ============================================================
UPDATE webuser
SET usertype = 'h'
WHERE email IN (
    SELECT email FROM hospital_manager
) AND usertype != 'h';

-- ============================================================
-- STEP 3: Verify the fix
-- ============================================================
SELECT
    'After Fix' as Info,
    w.email,
    w.usertype,
    m.name as manager_name
FROM webuser w
INNER JOIN hospital_manager m ON w.email = m.email;

-- ============================================================
-- STEP 4: Show login credentials
-- ============================================================
SELECT
    'LOGIN CREDENTIALS' as Info,
    m.email,
    m.name,
    'manager123' as password,
    w.usertype
FROM hospital_manager m
INNER JOIN webuser w ON m.email = w.email;

-- ============================================================
-- Expected Result:
-- All hospital managers should have usertype = 'h'
-- ============================================================
