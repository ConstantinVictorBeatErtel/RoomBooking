# Supabase Authentication Setup Guide

## Overview
This guide will help you enable Supabase authentication for your RoomBooking application, allowing users to sign in and only delete their own bookings.

## Step 1: Run Database Migration

1. **Log into your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your RoomBooking project

2. **Open the SQL Editor**
   - Navigate to the SQL Editor in the left sidebar
   - Click "New Query"

3. **Execute the Migration Script**
   - Copy the contents of `supabase_migration.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute the migration

   This will:
   - Add a `user_id` column to the `bookings` table
   - Enable Row Level Security (RLS) on the `bookings` table
   - Create policies allowing:
     - Anyone to view bookings (for calendar display)
     - Authenticated users to create bookings with their user_id
     - Users to delete only their own bookings

## Step 2: Enable Supabase Auth

1. **In Supabase Dashboard, go to Authentication → Settings**

2. **Configure Email Auth**
   - Ensure "Enable Email Provider" is turned ON
   - Set "Confirm email" to your preference:
     - ON: Users must confirm their email (more secure)
     - OFF: Users can sign in immediately (faster testing)

3. **Configure Site URL** (important for email confirmation)
   - Set "Site URL" to your application URL:
     - Development: `http://localhost:3000`
     - Production: Your deployed app URL

4. **Configure Redirect URLs**
   - Add allowed redirect URLs:
     - Development: `http://localhost:3000/**`
     - Production: `https://yourdomain.com/**`

## Step 3: Test Authentication Flow

1. **Start your application**
   ```bash
   npm start
   ```

2. **Test Sign Up**
   - You should see the sign-in form when you visit the app
   - Click "Don't have an account? Sign Up"
   - Register with a Berkeley email (or any email if you removed that validation)
   - If email confirmation is enabled, check your email for the confirmation link

3. **Test Sign In**
   - Sign in with your registered credentials
   - You should now see the booking interface with a "Sign Out" button

4. **Test Booking Creation**
   - Create a new booking
   - The booking should now be associated with your user account

5. **Test Booking Deletion**
   - When viewing your own bookings in single-room view, you should see a trash icon
   - Click the trash icon to delete your booking
   - Try viewing bookings created by other users - you should NOT see a delete button

## Step 4: (Optional) Migrate Existing Bookings

If you have existing bookings in your database that need to be associated with users:

```sql
-- Option 1: Create a default "system" user for old bookings
-- First, manually create a user account via the sign-up flow
-- Then run this query, replacing 'USER_ID_HERE' with the actual user ID:

UPDATE bookings
SET user_id = 'USER_ID_HERE'
WHERE user_id IS NULL;

-- Option 2: Link bookings to users based on email
-- This assumes you have person records with matching emails
UPDATE bookings b
SET user_id = au.id
FROM person p
JOIN auth.users au ON au.email = p.email
WHERE b.person_id = p.id AND b.user_id IS NULL;
```

## Security Features Implemented

1. **Row Level Security (RLS)**
   - Database-level enforcement ensures users can only delete their own bookings
   - Even if someone bypasses the frontend, the database will reject unauthorized deletes

2. **Authentication State Management**
   - Users must be signed in to create bookings
   - Session management handled by Supabase
   - Automatic token refresh

3. **Authorization Checks**
   - Frontend only shows delete buttons for user's own bookings
   - Backend (Supabase RLS) enforces authorization at database level

## Troubleshooting

### Issue: "Policy violation" error when creating bookings
**Solution**: Make sure you're signed in and the policy allows inserts with `auth.uid() = user_id`

### Issue: Email confirmation not working
**Solution**:
- Check your Supabase email settings in Authentication → Settings → Email
- Verify your Site URL and Redirect URLs are correct
- Check spam folder for confirmation emails

### Issue: Can't delete any bookings
**Solution**:
- Verify the booking has a `user_id` that matches your current user
- Check that RLS is enabled and policies are created correctly
- Old bookings without a `user_id` cannot be deleted (by design)

### Issue: "User is not authenticated" when trying to book
**Solution**:
- Sign out and sign back in
- Check browser console for any auth errors
- Verify Supabase environment variables are set correctly

## Code Changes Summary

### New Files Created
- `src/contexts/AuthContext.js` - Authentication context provider
- `src/components/auth/AuthForm.js` - Sign in/sign up form component
- `supabase_migration.sql` - Database migration script

### Modified Files
- `src/App.js` - Added AuthProvider wrapper
- `src/components/RoomBookingPage.js` - Added auth checks and delete functionality
- `src/components/booking/BookingCalendar.js` - Added delete buttons for own bookings

## Next Steps

1. **Add password reset functionality**
   - Supabase provides `resetPasswordForEmail()` method
   - Add a "Forgot Password?" link to AuthForm

2. **Add profile management**
   - Allow users to update their email/password
   - Show user's booking history

3. **Add OAuth providers** (optional)
   - Enable Google, GitHub, or other OAuth providers in Supabase
   - Update AuthForm to include OAuth buttons

4. **Email notifications**
   - Set up email confirmations for bookings
   - Send reminder emails before bookings

## Support

For issues with:
- **Supabase setup**: Check [Supabase Documentation](https://supabase.com/docs)
- **Authentication flows**: See [Supabase Auth docs](https://supabase.com/docs/guides/auth)
- **Row Level Security**: See [RLS docs](https://supabase.com/docs/guides/auth/row-level-security)
