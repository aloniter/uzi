# 📱 iOS Shortcuts - Quick Logging for Uzi

This guide explains how to set up **one-tap quick logging from your Lock Screen or Home Screen** using iOS Shortcuts - no need to unlock your phone or open the app!

## 🎯 Overview

Uzi now has a **direct API endpoint** (`api.html`) that allows instant logging without opening any webpage. Perfect for Lock Screen widgets, Home Screen icons, and ultra-fast logging.

## 📋 API Endpoints

### Direct API (Recommended - Silent & Fast)

Use these for shortcuts that run silently in the background:

```
https://aloniter.github.io/uzi/api.html?type=pee
https://aloniter.github.io/uzi/api.html?type=poop
```

Returns JSON response - perfect for silent shortcuts!

### Visual Logging Page (Alternative)

If you prefer to see a confirmation page:

```
https://aloniter.github.io/uzi/log.html?type=pee
https://aloniter.github.io/uzi/log.html?type=poop
```

### Parameters

| Parameter | Required | Valid Values | Default | Description |
|-----------|----------|--------------|---------|-------------|
| `type` | ✅ Yes | `pee`, `poop` | - | Type of activity to log |
| `user` | ❌ No | Any text | `"Shortcut"` | Who is logging the event |
| `note` | ❌ No | Any text | `""` | Additional notes |

### Examples

```
/log.html?type=pee
/log.html?type=poop
/log.html?type=pee&user=אלון
/log.html?type=poop&note=after%20walk
/log.html?type=pee&user=נעמי&note=good%20boy
```

## 🚀 Quick Setup (Import Pre-made Shortcuts)

### Option A: Import Shortcut Files

1. **Download the shortcut files** from the repo:
   - [Uzi-Pee.shortcut](shortcuts/Uzi-Pee.shortcut)
   - [Uzi-Poop.shortcut](shortcuts/Uzi-Poop.shortcut)

2. **Open each .shortcut file** on your iPhone
3. **Tap "Add Shortcut"**
4. **Done!** The shortcuts are ready to use

### Option B: Create Manually

## 🔧 Manual Setup - Silent Background Logging (Recommended)

This creates a shortcut that logs instantly without opening any webpage:

1. **Open Shortcuts app** on your iPhone
2. **Tap "+"** to create a new shortcut
3. **Add "URL"** action
   - Enter: `https://aloniter.github.io/uzi/api.html?type=pee`
   - (or `type=poop` for poop shortcut)
4. **Add "Get Contents of URL"** action
   - Leave all settings as default
5. **Add "Get Dictionary Value"** action
   - Key: `emoji`
6. **Add "Show Notification"** action (optional)
   - Title: "Logged!"
   - Body: Select the emoji from previous step
7. **Name your shortcut** (e.g., "💧 Pee" or "💩 Poop")
8. **Tap Settings icon** (top right)
9. **Choose an icon and color** that you'll recognize
10. **Tap "Done"**

### Alternative: Simple One-Action Shortcut

For the absolute simplest version (no notification):

1. **Open Shortcuts app**
2. **Tap "+"**
3. **Add "Get Contents of URL"**
4. **Enter:** `https://aloniter.github.io/uzi/api.html?type=pee`
5. **Name it and Done!**

### Advanced: Add Notes

For shortcuts that ask for a note before logging:

1. **Create the basic shortcut** as above
2. **Add "Ask for Input"** action at the start
   - Prompt: "Add a note (optional):"
3. **Add "URL Encode"** action on the input
4. **Modify the URL** to: `https://aloniter.github.io/uzi/api.html?type=pee&note=[Encoded Input]`
5. **Done!**

## 📌 Adding to Lock Screen (Fastest Access!)

### iOS 16 and later:

1. **Long-press your Lock Screen** to enter editing mode
2. **Tap "Customize"**
3. **Tap the widgets area** below the time
4. **Select "Shortcuts"**
5. **Choose your Uzi logging shortcuts** (💧 Pee and 💩 Poop)
6. **Tap "Done"**

**Now you can log with ONE TAP directly from your Lock Screen - even without unlocking your phone!**

## 🏠 Adding as Home Screen App Icons

Want shortcuts that look like real apps? Create app-like icons on your home screen:

### Method 1: Via Shortcuts App Settings

1. **Open Shortcuts app**
2. **Find your Uzi shortcut**
3. **Tap the (⋯) menu** on the shortcut
4. **Tap "Add to Home Screen"**
5. **Choose a name** (e.g., "💧 Pee" or just use emoji)
6. **Select an icon:**
   - Choose a color and glyph
   - Or upload a custom icon (use Uzi's logo!)
7. **Tap "Add"**
8. **Done!** The shortcut appears as an app icon

### Method 2: Via Safari (For Custom Icons)

1. **Open Safari** on your iPhone
2. **Go to:** `https://aloniter.github.io/uzi/api.html?type=pee`
3. **Tap the Share button** (square with arrow)
4. **Scroll down and tap "Add to Home Screen"**
5. **Name it** (e.g., "💧 Pee")
6. **Tap "Add"**
7. **Repeat for poop** with `type=poop`

**Now you have app icons that log instantly when tapped!**

## 🔔 Home Screen Widget (Multiple Shortcuts)

For a widget with both shortcuts visible:

1. **Long-press Home Screen** to enter jiggle mode
2. **Tap "+" in the top-left corner**
3. **Search for "Shortcuts"**
4. **Select the widget size** you want (Medium shows 4 shortcuts)
5. **Drag to Home Screen**
6. **Tap the widget to configure** and select your Uzi shortcuts
7. **Tap outside to finish**

## ✅ Verification

After running a shortcut:

1. **Open the main Uzi app** (index.html)
2. **Go to "היסטוריה" (History) tab**
3. **Verify your entry appears** with the correct time and type

## 🔍 Troubleshooting

### "Missing type parameter" error
- Make sure your URL includes `?type=pee` or `?type=poop`

### "Invalid type" error
- Only `pee` and `poop` are valid types (lowercase)

### Entry not appearing in app
- Check your internet connection
- Firebase might be experiencing delays (wait 5-10 seconds and refresh)
- Open log.html in Safari to see the full error message

### Shortcut not working
- Verify the URL is correct (copy-paste from this guide)
- Check that you're connected to the internet
- Try opening the URL in Safari manually first

## 🎨 Customization

### Adding Custom User Names

Replace `Shortcut` with your name:

```
/log.html?type=pee&user=אלון
/log.html?type=poop&user=נעמי
```

### URL Encoding Notes

When adding notes with spaces or special characters, they must be URL-encoded:
- Space → `%20`
- Hebrew characters → Use a URL encoder

Example: `after walk` → `after%20walk`

## 📊 Data Storage

All logs are stored in Firebase Realtime Database, the same as the main app. The quick log endpoint creates entries with:

- **type**: Activity type in Hebrew (פיפי/קקי)
- **emoji**: Visual indicator (💧/💩)
- **user**: Who logged it
- **note**: Optional note text
- **time**: HH:mm format
- **date**: D.M.YYYY format
- **timestamp**: Unix timestamp for sorting

## 🔗 Direct API Links (Copy & Paste)

Use these URLs in your shortcuts:

### Basic Links
```
Pee:  https://aloniter.github.io/uzi/api.html?type=pee
Poop: https://aloniter.github.io/uzi/api.html?type=poop
```

### With User Name
```
https://aloniter.github.io/uzi/api.html?type=pee&user=אלון
https://aloniter.github.io/uzi/api.html?type=poop&user=נעמי
```

### With Note
```
https://aloniter.github.io/uzi/api.html?type=pee&note=after%20walk
https://aloniter.github.io/uzi/api.html?type=poop&note=good%20boy
```

## 🚀 Pro Tips

1. **Lock Screen is King** - Add both shortcuts to your Lock Screen for instant logging without unlocking
2. **Use Emojis in Names** - "💧" and "💩" are instantly recognizable
3. **Home Screen App Icons** - Make them look like real apps for quick access
4. **Add to iPhone's Back Tap** (Settings → Accessibility → Touch → Back Tap)
   - Double-tap or triple-tap the back of your iPhone to log!
5. **Combine with Siri** - Say "Hey Siri, Uzi Pee" to log hands-free
6. **Create Multiple Versions** - One for each family member with different `user` parameter
7. **Test First** - Open the API URL in Safari to verify it works before creating shortcuts
8. **Silent Mode** - Remove the "Show Notification" action for completely silent logging

## 🎯 Recommended Setup

For the absolute fastest logging experience:

1. **Lock Screen Widgets:**
   - 💧 Pee (left widget)
   - 💩 Poop (right widget)

2. **Home Screen App Icons:**
   - Use Uzi's logo with blue color for Pee
   - Use Uzi's logo with brown color for Poop

3. **Back Tap Gesture:**
   - Double-tap back = Pee
   - Triple-tap back = Poop

With this setup, you can log in **under 1 second** from your Lock Screen! 🚀

---

Made with 🐕 for Uzi
