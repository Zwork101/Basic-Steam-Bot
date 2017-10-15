# Basic-Steam-Bot
Trying out some stuff. 

# How to find your SharedSecret and IdentitySecret
If you have an iOS device check out this guide: https://forums.backpack.tf/index.php?/topic/45995-guide-how-to-get-your-shared-secret-from-ios-device-steam-mobile/

If you have an Android device check out this guide: https://forums.backpack.tf/index.php?/topic/46354-guide-how-to-find-the-steam-identity_secret-on-an-android-phone/

If you have SDA (Steam Desktop Authenticator):
// If you  set up an encryption key when you downloaded SDA you need to remove the encryption before doing any of this //
1. Open the SDA folder
2. Then open the maFiles folder 
3. Open the notepad / text file with your steamID
4. Search for "shared_secret":"bunchofnumberhere" and copy the numbers (ends with =) and paste it in the correct part of config.json
5. Search for "identity_secret":"bunchofnumbershere" and copy the numbers (ends with =) and paste it in the correct part of config.json
6. Done
