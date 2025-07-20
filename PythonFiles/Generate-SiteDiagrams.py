# ======================================
# PYTHON PROGRAM FOR GENERATING SIT MAPS
# ======================================

# =======
# IMPORTS
# =======
import json
import subprocess
import sys
import shutil
from pathlib import Path

# ========
# COSTANTS
# ========

# Diagram configuration
DIAGRAMS = {
    "siteHTML_structure": {
        "json": "../diagrams/SiteHTMLStructure.json",
        "mmd": "../diagrams/SiteHTMLStructure.mmd",
        "svg": "../diagrams/SiteHTMLStructure.svg",
        "png": "../projects/images/main/original/SiteHTMLStructure.png",
        "main_label": "SitePages",
        "second_label": "ProjectPages",
        "main_title": "Main Pages",
        "second_title": "Project Pages",
        "key_main": "main_pages",
        "key_second": "project_pages",
        "key_links": "links",
        "key_styles": "styles",
        "key_classes": "classes",
        "key_class_map": "class_map"
    },
    "SiteJS_main": {
        "json": "../diagrams/SiteJSMainPages.json",
        "mmd": "../diagrams/SiteJSMainPages.mmd",
        "svg": "../diagrams/SiteJSMainPages.svg",
        "png": "../projects/images/main/original/SiteJSMainPages.png",
        "main_label": "HTMLPages",
        "second_label": "JavaScript",
        "third_label": "JSONData",
        "main_title": "HTML Pages",
        "second_title": "JavaScript",
        "third_title": "JSON Data",
        "key_main": "HTMLPages",
        "key_second": "JavaScript",
        "key_third": "JSONData",
        "key_links": "links",
        "key_styles": "styles",
        "key_classes": "classes",
        "key_class_map": "class_map"
    },
    "SiteJS_projects": {
        "json": "../diagrams/SiteJSProjectPages.json",
        "mmd": "../diagrams/SiteJSProjectPages.mmd",
        "svg": "../diagrams/SiteJSProjectPages.svg",
        "png": "../projects/images/main/original/SiteJSProjectPages.png",
        "main_label": "HTMLPages",
        "second_label": "JavaScript",
        "third_label": "JSONData",
        "main_title": "HTML Pages",
        "second_title": "JavaScript",
        "third_title": "JSON Data",
        "key_main": "HTMLPages",
        "key_second": "JavaScript",
        "key_third": "JSONData",
        "key_links": "links",
        "key_styles": "styles",
        "key_classes": "classes",
        "key_class_map": "class_map"
    }
}

CONFIG_FILE = "../diagrams/siteMermaidConfig.json"
MMDC_COMMAND = str(shutil.which("mmdc") or "mmdc")

# Constants for diagram structure
SUBGRAPH_KEYS = [
    ("key_main", "main_label", "main_title"),
    ("key_second", "second_label", "second_title"),
    ("key_third", "third_label", "third_title")
]

MERMAID_STYLE_KEYS = [
    ("style", "key_styles"),
    ("classDef", "key_classes"),
    ("class", "key_class_map")
]

# ======================
# FILE + COMMAND HELPERS 
# ======================
def load_json(filepath):
    """Load a JSON file and return its contents."""
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading JSON file: {e}")
        sys.exit(1)


def write_mermaid_file(lines, filepath):
    """Write the final Mermaid syntax to a .mmd file."""
    try:
        with open(filepath, "w") as f:
            f.write("\n".join(lines))
    except Exception as e:
        print(f"Failed to write Mermaid file: {e}")
        sys.exit(1)


def check_command(cmd, description=None):
    """Ensure a system command is available on the PATH."""
    if description:
        print(f"[INFO] Checking for {description} ({cmd})...")
    path = shutil.which(cmd)
    if path is None:
        print(f"[ERROR] Required system command '{cmd}' not found.")
        sys.exit(1)
    print(f"[OK] Found '{cmd}' at: {path}")

        
# =====================
# MERMAID BUILD HELPERS
# =====================
def write_subgraph(mermaid_lines, label, title, items):
    """Append a subgraph block with its node definitions."""
    mermaid_lines.append(f"  subgraph {label} [{title}]")
    for name, file in items.items():
        mermaid_lines.append(f"    {name}[{file}]")
    mermaid_lines.append("  end\n")


def write_link(mermaid_lines, source, target):
    """Write a single directional link (arrow) line."""
    mermaid_lines.append(f"  {source} --> {target}")


def write_mermaid_def(mermaid_lines, kind, key, value):
    """Write a single Mermaid style/class/classDef line."""
    mermaid_lines.append(f"  {kind} {key} {value}")


# =========
# RENDERING 
# =========
def render_mermaid_files(mmd_file, svg_file, png_file, mmdc_cmd, config_path=None):
    """Render Mermaid .mmd file to SVG and high-res PNG using Mermaid CLI."""
    base_cmd = [mmdc_cmd, "-i", mmd_file]

    if config_path:
        base_cmd.extend(["-c", config_path])

    try:
        subprocess.run(base_cmd + ["-o", svg_file], check=True)
        print(f"Diagram saved as: {svg_file}")
        
        subprocess.run(base_cmd + ["-o", png_file, "--scale", "4"], check=True)
        print(f"High-quality PNG saved to: {png_file}")

    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Failed to render Mermaid diagram: {e}")
        sys.exit(1)


# =====
#  MAIN
# =====
def main():
    """Main routine to generate and render all Mermaid diagrams."""
    print("[INFO] If rendering fails, try running this script from a terminal.")
    print("Example (Linux/Debian): python3 generate_site_diagrams.py\n")

    check_command("node", "Node.js")
    check_command("npm", "Node Package Manager")
    check_command(MMDC_COMMAND, "Mermaid CLI")


    for name, config in DIAGRAMS.items():
        print(f"\n[INFO] Processing: {name}")

        site_data = load_json(config["json"])
        mermaid_lines = ["graph TD\n"]

        # Add subgraph blocks (main, second, third if available)
        for key, label_key, title_key in SUBGRAPH_KEYS:
            if key in config and config[key] in site_data:
                items = site_data[config[key]]
                label = config.get(label_key, label_key)
                title = config.get(title_key, label)
                write_subgraph(mermaid_lines, label, title, items)

        # Add directional links between nodes
        for source, target in site_data.get(config["key_links"], []):
            write_link(mermaid_lines, source, target)

        # Add node styles, classDefs, and class assignments
        for kind, key in MERMAID_STYLE_KEYS:
            for k, v in site_data.get(config[key], {}).items():
                write_mermaid_def(mermaid_lines, kind, k, v)

        # Save .mmd file
        write_mermaid_file(mermaid_lines, config["mmd"])

        # Render to SVG and PNG
        render_mermaid_files(
            config["mmd"],
            config["svg"],
            config["png"],
            MMDC_COMMAND,
            config_path=CONFIG_FILE
        )

if __name__ == "__main__":
    main()
