# ABM Ads Plugin

A Figma plugin that syncs your selected frames with dynamic content from a CSV file — including text, background color, images, and even frame renaming — using variable placeholders like {{Name}}.

✨ Features
- ✅ Text replacement: Updates text layers with values from a CSV.
- 🎨 Color fills: Sets solid fill color for layers using hex codes (e.g., #FF5733).
- 🖼️ Image fills: Loads images from public URLs (PNG, JPG, JPEG, WEBP).
- 🏷️ Frame renaming: Dynamically renames frames if their name is wrapped in {{ }}.
- ⚙️ Auto-mapping: Works with any column headers in your CSV — no hardcoded keys.
- 🧠 Smart matching: Only layers named like {{Variable}} get updated.


🧩 How It Works
1. In Figma, select the same number of frames as rows in your CSV.
2. Each frame should contain layers named using double curly braces, like {{Name}} or {{Background}}.
3. Upload your CSV using the plugin panel.
4. Plugin updates each selected frame with matching data.

### How to Run the Plugin in Figma

This is a local plugin for development or private use. Here’s how to load and use it in your Figma desktop or browser app.

Step-by-step:
1. Open Figma and any design file.
2. Go to the Menu → Plugins → Development → Import Plugin from Manifest…
3. Select the manifest.json file from this plugin folder.
4. The plugin will now appear in your Plugins > Development menu under the name “ABM Ads”.
5. Select the frames you want to update (same number as rows in your CSV).
6. Run the plugin from Plugins > Development > ABM Ads.
7. Upload your .csv file and click Sync to Figma.


### Supported Value Types

- Value Format	-   Result
- Some text    	-   Replaces characters in TEXT layer
- #RRGGBB        	-   Sets solid fill color
- Image URL       -	Loads and applies image fill



### Example

CSV:

- Name,Background,Logo
- Stan,#FF5733,https://example.com/logo.png

Figma Layers:

- Text layer named {{Name}} → becomes Stan
- Rectangle named {{Background}} → fill becomes #FF5733
- Shape named {{Logo}} → fill becomes the image from the URL
- Frame named {{Name}} → renamed to Stan


### Requirements
- Each selected frame corresponds to one row in the CSV.
- Layer names must use the format {{HeaderName}}.
- For image fills, the URL must be public and direct.
