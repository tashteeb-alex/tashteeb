TASHTEEB WEBSITE V1 - HOW TO EDIT
=================================
Settings (phone, forms, social, tracking, work photos):  assets/config.js
Colors and fonts:                                         assets/style.css (top of file, ":root")
Texts:                                                    index.html (every text has English + Arabic)
Link preview (name, description, domain, image):          index.html, the "BRAND / LINK PREVIEW" block at the top
Preview image:                                            assets/og-image.png (1200 x 630)

Add work photos:
1. Put the photos in assets/work/ (create the folder)
2. In assets/config.js, add them under gallery.single / gallery.multiple / gallery.finishing

Publish: drag the whole folder to app.netlify.com/drop (or to your site's "Deploys" page to update).
