# IMPORTS

import json
import subprocess
import sys
import shutil
import os
from pathlib import Path

# CONSTANTS
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
        "main_title": "HTML Pages",
        "second_title": "JavaScript",
        "key_main": "HTMLPages",
        "key_second": "JavaScript",
        "key_links": "links",
        "key_styles": "styles",
        "key_classes": "classes",
        "key_class_map": "class_map",
        "key_third": "JSONData",
        "third_label": "JSONData",
        "third_title": "JSON Data"
    }
}

CONFIG_FILE = "../diagrams/siteMermaidConfig.json"
MMDC_COMMAND = "mmdc"


def load_json(filepath):
    """Load a JSON file and return its contents."""
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading JSON file: {e}")
        sys.exit(1)


def write_mermaid_file(lines, filepath):
    """Write Mermaid syntax lines to a file."""
    try:
        with open(filepath, "w") as f:
            f.write("\n".join(lines))
    except Exception as e:
        print(f"Failed to write Mermaid file: {e}")
        sys.exit(1)


def check_command(cmd):
    """Ensure a system command is available."""
    if shutil.which(cmd) is None:
        print(f"[ERROR] Required command not found: {cmd}")
        print("Ensure it is installed and available in your system PATH.")
        sys.exit(1)


def render_mermaid_files(mermaid_file, svg_output, png_output, mmdc_cmd, config_path=None):
    """Render Mermaid file into SVG and PNG formats."""
    base_cmd = [mmdc_cmd, "-i", mermaid_file]

    if config_path:
        base_cmd.extend(["-c", config_path])

    try:
        subprocess.run(base_cmd + ["-o", svg_output], check=True)
        print(f"Diagram saved as: {svg_output}")
        subprocess.run(base_cmd + ["-o", png_output, "--scale", "4"], check=True)
        print(f"High-quality PNG saved to: {png_output}")
    except Exception as e:
        print(f"[ERROR] Failed to render Mermaid diagram: {e}")
        sys.exit(1)


# MAIN

def main():
    """Main routine to check dependencies and render all diagrams."""
    print("[INFO] If rendering fails, try running this script from a terminal instead of IDLE.")
    print("Example (Debian/Linux):")
    print("  python3 generate_site_diagrams.py\n")

    # Ensure the required 'mmdc' command is available
    check_command(MMDC_COMMAND)

    # Process each diagram defined in the DIAGRAMS dictionary
    for diagram_name, config in DIAGRAMS.items():
        print(f"\nProcessing: {diagram_name}")

        # Load JSON input for the diagram
        site_data = load_json(config["json"])

        # Begin building Mermaid syntax
        mermaid_lines = ["graph TD\n"]

        # Add subgraphs for main/second/optional third sections
        for group in [("key_main", "main_label", "main_title"),
                      ("key_second", "second_label", "second_title"),
                      ("key_third", "third_label", "third_title")]:
            key, label_key, title_key = group
            if key in config and config[key] in site_data:
                items = site_data[config[key]]
                label = config.get(label_key, label_key)
                title = config.get(title_key, label)
                mermaid_lines.append(f"  subgraph {label} [{title}]")
                for name, file in items.items():
                    mermaid_lines.append(f"    {name}[{file}]")
                mermaid_lines.append("  end\n")

        # Add connections, styles, and class definitions
        for source, target in site_data.get(config["key_links"], []):
            mermaid_lines.append(f"  {source} --> {target}")
        for node, style in site_data.get(config["key_styles"], {}).items():
            mermaid_lines.append(f"  style {node} {style}")
        for class_name, definition in site_data.get(config["key_classes"], {}).items():
            mermaid_lines.append(f"  classDef {class_name} {definition}")
        for node, class_name in site_data.get(config["key_class_map"], {}).items():
            mermaid_lines.append(f"  class {node} {class_name}")

        # Write the Mermaid syntax to the .mmd file
        write_mermaid_file(mermaid_lines, config["mmd"])

        # Render the diagram as both SVG and PNG
        try:
            render_mermaid_files(
                config["mmd"],
                config["svg"],
                config["png"],
                MMDC_COMMAND,
                config_path=CONFIG_FILE
            )
        except Exception as e:
            print(f"[ERROR] Failed to render: {e}")


if __name__ == "__main__":
    main()
