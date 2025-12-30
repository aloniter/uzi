# 📱 iOS Shortcuts - Quick Logging for Uzi

This guide explains how to set up one-tap quick logging from your iPhone Lock Screen using iOS Shortcuts.

## 🎯 Overview

The `log.html` endpoint allows you to log pee or poop events instantly via URL parameters, without opening the full app UI. This is perfect for Lock Screen widgets and quick actions.

## 📋 URL Format

### Base URLs

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

## 🔧 Setting Up iOS Shortcuts

### Option 1: Simple URL Shortcut (Recommended)

This creates a shortcut that opens the logging page in Safari:

1. **Open Shortcuts app** on your iPhone
2. **Tap "+"** to create a new shortcut
3. **Search for "Open URLs"** action
4. **Enter the URL:**
   - For Pee: `https://aloniter.github.io/uzi/log.html?type=pee`
   - For Poop: `https://aloniter.github.io/uzi/log.html?type=poop`
5. **Name your shortcut** (e.g., "🐕 Uzi Pee" or "🐕 Uzi Poop")
6. **Tap "Done"**

### Option 2: Silent Background Logging

This logs the event in the background without opening Safari:

1. **Open Shortcuts app**
2. **Tap "+"** to create a new shortcut
3. **Search for "Get Contents of URL"**
4. **Enter the URL:**
   - For Pee: `https://aloniter.github.io/uzi/log.html?type=pee`
   - For Poop: `https://aloniter.github.io/uzi/log.html?type=poop`
5. **Optional: Add "Show Result"** action to see confirmation
6. **Name your shortcut**
7. **Tap "Done"**

### Option 3: Advanced - Ask for Note

This prompts you to add a note before logging:

1. **Open Shortcuts app**
2. **Tap "+"** to create a new shortcut
3. **Add "Ask for Input"** action
   - Prompt: "Add a note (optional):"
   - Input Type: Text
4. **Add "URL Encode"** action
   - Input: Select "Provided Input" from previous step
5. **Add "Get Contents of URL"** action
   - URL: `https://aloniter.github.io/uzi/log.html?type=pee&note=` (then add the encoded text variable)
6. **Name your shortcut**
7. **Tap "Done"**

## 📌 Adding to Lock Screen

### iOS 16 and later:

1. **Long-press your Lock Screen** to enter editing mode
2. **Tap "Customize"**
3. **Tap the widgets area** below the time
4. **Select "Shortcuts"**
5. **Choose your Uzi logging shortcuts**
6. **Tap "Done"**

Now you can log with one tap directly from your Lock Screen!

### Home Screen Widget:

1. **Long-press Home Screen** to enter jiggle mode
2. **Tap "+" in the top-left corner**
3. **Search for "Shortcuts"**
4. **Select the widget size** you want
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

## 🚀 Pro Tips

1. **Create both shortcuts** (pee and poop) for maximum convenience
2. **Add to Lock Screen** for instant access without unlocking
3. **Use descriptive names** with emojis so you can identify them quickly
4. **Test first** by opening the URL in Safari before creating shortcuts
5. **Combine with Siri** - Shortcuts can be triggered with voice commands

---

Made with 🐕 for Uzi
