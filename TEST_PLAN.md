# Test Plan for Quick Logging Feature

## Overview
This document outlines the testing procedures for the quick logging endpoint (log.html).

## Test Environment
- **URL Base**: `https://aloniter.github.io/uzi/`
- **Endpoint**: `log.html`
- **Storage**: Firebase Realtime Database
- **Verification**: index.html (History tab)

## Test Cases

### ✅ Test 1: Log Pee (Basic)
**URL**: `/log.html?type=pee`

**Expected Result**:
- Page shows: 💧 emoji
- Message: "Logged!"
- JSON shows:
  ```json
  {
    "success": true,
    "id": "[firebase-id]",
    "type": "פיפי",
    "time": "HH:mm",
    "date": "D.M.YYYY"
  }
  ```
- "🐕 Open app" button appears

**Verification**:
1. Click "🐕 Open app" button
2. Navigate to "היסטוריה" (History) tab
3. Verify entry appears with:
   - Type: פיפי 💧
   - User: "Shortcut"
   - Correct timestamp
   - No note

---

### ✅ Test 2: Log Poop (Basic)
**URL**: `/log.html?type=poop`

**Expected Result**:
- Page shows: 💩 emoji
- Message: "Logged!"
- JSON shows type: "קקי"
- "🐕 Open app" button appears

**Verification**:
1. Open index.html
2. Check History tab
3. Verify entry shows קקי 💩

---

### ✅ Test 3: Log with Custom User
**URL**: `/log.html?type=pee&user=אלון`

**Expected Result**:
- Successfully logged
- Entry shows user: "אלון" (not "Shortcut")

**Verification**:
- Check History tab
- Verify user field shows "אלון"

---

### ✅ Test 4: Log with Note
**URL**: `/log.html?type=poop&note=after%20walk`

**Expected Result**:
- Successfully logged
- Entry includes note: "after walk"

**Verification**:
- Check History tab
- Verify note appears under the activity type

---

### ✅ Test 5: Log with Multiple Parameters
**URL**: `/log.html?type=pee&user=נעמי&note=good%20boy`

**Expected Result**:
- Type: פיפי 💧
- User: "נעמי"
- Note: "good boy"

**Verification**:
- All three fields correctly populated in History

---

### ❌ Test 6: Missing Type Parameter
**URL**: `/log.html`

**Expected Result**:
- ❌ emoji
- Message: "Missing type parameter"
- JSON shows:
  ```json
  {
    "error": "type is required",
    "valid_types": ["pee", "poop"]
  }
  ```
- NO entry in database

**Verification**:
- Check History tab - should show no new entry

---

### ❌ Test 7: Invalid Type
**URL**: `/log.html?type=food`

**Expected Result**:
- ❌ emoji
- Message: "Invalid type"
- JSON shows:
  ```json
  {
    "error": "Invalid type: food",
    "valid_types": ["pee", "poop"]
  }
  ```
- NO entry in database

**Verification**:
- Check History tab - should show no new entry

---

### ❌ Test 8: Case Insensitive Type
**URL**: `/log.html?type=PEE`

**Expected Result**:
- Should work (type converted to lowercase)
- Entry logged as פיפי 💧

**Verification**:
- Check History tab - entry should exist

---

### ✅ Test 9: Empty Note Parameter
**URL**: `/log.html?type=poop&note=`

**Expected Result**:
- Successfully logged
- No note displayed

**Verification**:
- Entry exists without note text

---

### ✅ Test 10: Special Characters in Note
**URL**: `/log.html?type=pee&note=%D7%90%D7%97%D7%A8%D7%99%20%D7%98%D7%99%D7%95%D7%9C`
(Hebrew: "אחרי טיול" = "after walk")

**Expected Result**:
- Note correctly decoded and displayed
- Hebrew text shows properly

**Verification**:
- Note appears in Hebrew in History tab

---

## Data Structure Validation

### Verify Firebase Entry Structure
After any successful log, check Firebase or browser DevTools to verify:

```json
{
  "type": "פיפי" | "קקי",
  "emoji": "💧" | "💩",
  "user": "string",
  "note": "string",
  "time": "HH:mm",
  "date": "D.M.YYYY",
  "timestamp": 1234567890123
}
```

**Critical checks**:
- ✅ `time` format is HH:mm (e.g., "14:30", not "2:30 PM")
- ✅ `date` format is D.M.YYYY (e.g., "30.12.2025")
- ✅ `timestamp` is a valid Unix timestamp
- ✅ `type` and `emoji` match the TYPES mapping
- ✅ All fields are strings except `timestamp` (number)

---

## Integration Testing

### Test 11: Simultaneous Logs
1. Open log.html?type=pee in one tab
2. Open log.html?type=poop in another tab
3. Both should log successfully
4. Both should appear in History tab

### Test 12: Network Timeout
1. Disable internet connection
2. Open log.html?type=pee
3. Should show timeout error after 10 seconds
4. Re-enable internet
5. Try again - should work

### Test 13: Rapid Succession
1. Log pee
2. Immediately log poop
3. Immediately log pee again
4. All three should appear in History in correct order (newest first)

---

## iOS Shortcuts Testing

### Test 14: Open URL Shortcut
1. Create shortcut with "Open URLs" action
2. Run from Home Screen
3. Should open Safari with log.html
4. Should show success confirmation
5. Tap "Open app" - should navigate to index.html

### Test 15: Get Contents of URL Shortcut
1. Create shortcut with "Get Contents of URL"
2. Run from Lock Screen widget
3. Should run in background
4. Check History tab - entry should exist

### Test 16: Siri Integration
1. Create named shortcut (e.g., "Log Uzi Pee")
2. Say "Hey Siri, Log Uzi Pee"
3. Shortcut should run
4. Verify entry in History

---

## Browser Compatibility

Test on multiple browsers:
- ✅ Safari (iOS)
- ✅ Safari (macOS)
- ✅ Chrome (Desktop)
- ✅ Firefox (Desktop)

All should work identically.

---

## Performance Testing

### Test 17: Response Time
- Log should complete in < 2 seconds on good connection
- Timeout after 10 seconds on poor connection

### Test 18: Offline Behavior
- Should show error message
- Should NOT create partial entries
- Should NOT corrupt database

---

## Regression Testing

After any code changes, rerun:
1. Test 1 (Basic Pee)
2. Test 2 (Basic Poop)
3. Test 6 (Missing Type)
4. Test 7 (Invalid Type)
5. Check one entry in History tab

---

## Success Criteria

✅ All basic logging tests (1-5) pass
✅ All error handling tests (6-7) pass
✅ Data structure matches script.js exactly
✅ Entries appear correctly in History tab
✅ "Open app" button works
✅ iOS Shortcuts integration works
✅ No JavaScript errors in console

---

## Known Limitations

⚠️ **Auto-close not possible**: Browser security prevents auto-closing tabs opened by shortcuts
⚠️ **Network required**: Offline logging not supported (by design - Firebase dependency)
⚠️ **Rate limiting**: Firebase may rate-limit excessive requests

---

## Debugging

If tests fail:

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: Verify Firebase POST request succeeded
3. **Verify Firebase URL**: Ensure FIREBASE_URL matches script.js
4. **Test in Safari**: Some features may not work in other browsers on iOS
5. **Clear Cache**: Force-refresh (Cmd+Shift+R) if seeing old code

---

## Test Report Template

```
Date: _________
Tester: _________
Browser: _________
Device: _________

Test Results:
[ ] Test 1: Log Pee - PASS/FAIL
[ ] Test 2: Log Poop - PASS/FAIL
[ ] Test 3: Custom User - PASS/FAIL
[ ] Test 4: With Note - PASS/FAIL
[ ] Test 5: Multiple Params - PASS/FAIL
[ ] Test 6: Missing Type - PASS/FAIL
[ ] Test 7: Invalid Type - PASS/FAIL
[ ] Test 8: Case Insensitive - PASS/FAIL
[ ] Test 14: iOS Shortcut - PASS/FAIL

Notes:
_________________________________
```
