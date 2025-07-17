figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "process-csv") {
    try {
      const rows = parseCSV(msg.csv);
      const selectedFrames = figma.currentPage.selection.filter(n => n.type === "FRAME");

      if (selectedFrames.length !== rows.length) {
        figma.notify(`Selected ${selectedFrames.length} frames, but CSV has ${rows.length} rows`);
        return;
      }

      for (let i = 0; i < selectedFrames.length; i++) {
        await updateFrameWithRow(selectedFrames[i], rows[i]);
      }

      figma.notify("Updated selected frames from CSV");
      figma.closePlugin();

    } catch (err) {
      console.error("Error processing CSV:", err);
      figma.notify("Error while processing the CSV.");
    }
  }
};

function parseCSV(csv) {
  const lines = csv.trim().split("\n").filter(line => line.trim() !== "");
  const headers = lines[0].split(",").map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return row;
  });
}

async function updateFrameWithRow(frame, row) {
  const allLayers = frame.findAll();

  for (const layer of allLayers) {
    if (!layer.name.startsWith("{{") || !layer.name.endsWith("}}")) continue;

    const key = layer.name.slice(2, -2).trim(); // Strip {{ and }}
    const value = row[key];

    if (!value) continue;

    // Update color
    if (value.match(/^#[0-9A-Fa-f]{6}$/) && "fills" in layer) {
      try {
        const fills = clone(layer.fills);
        fills[0] = {
          type: "SOLID",
          color: hexToRgb(value),
          opacity: 1
        };
        layer.fills = fills;
      } catch (e) {
        console.warn(`Failed to apply color to ${layer.name}`, e);
      }
    }

    // Update image
    else if (value.match(/^https?:\/\/.*\.(png|jpe?g|webp)(\?.*)?$/i) && "fills" in layer) {
      try {
        const imageBytes = await fetch(value).then(res => res.arrayBuffer());
        const image = figma.createImage(new Uint8Array(imageBytes));
        layer.fills = [{
          type: "IMAGE",
          scaleMode: "FIT",
          imageHash: image.hash
        }];
      } catch (e) {
        console.warn(`Failed to load image for ${key}`, e);
      }
    }

    // Update text
    else if (layer.type === "TEXT") {
      try {
        await figma.loadFontAsync(layer.fontName);
        layer.characters = value;
      } catch (e) {
        console.warn(`Failed to update text in ${layer.name}`, e);
      }
    }
  }

  // Optional: Rename frame based on CSV value
  if (row["FrameName"]) {
    frame.name = row["FrameName"];
  }
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

function clone(val) {
  return JSON.parse(JSON.stringify(val));
}