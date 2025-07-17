import json
import subprocess
import sys
import os

# === CONSTANTS ===

DIAGRAMS = {
    "TAEDR_diagram": {
        "json": "../Diagrams/TAERDiagram.json",
        "mmd": "../Diagrams/TAERDiagram.mmd",
        "svg": "../Diagrams/TAERDiagram.svg",
        "png": "../projects/images/main/original/ThematicAnalysisStructureEDR2.png",
        "main_label": "Entities",
        "project_label": "Relationships",
        "main_title": "Entities",
        "project_title": "Relationships",
        "key_main": "entities",
        "key_project": "relationships",
        "key_links": "links",
        "key_styles": "styles",
        "key_classes": "classes",
        "key_class_map": "class_map"
    }
}

MMDC_COMMAND = "mmdc"

# === FILE HANDLING ===

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

# === RENDERING ===

def render_mermaid_files(mermaid_file, svg_output, png_output, mmdc_cmd):
    """Render Mermaid file into SVG and PNG formats (with plugins enabled)."""
    base_cmd = [mmdc_cmd, "--enable-plugins", "-i", mermaid_file]

    try:
        print(f"Running: {' '.join(base_cmd + ['-o', svg_output])}")
        result = subprocess.run(base_cmd + ["-o", svg_output], check=True, shell=True,
                                 capture_output=True, text=True)
        print(result.stdout)
        print(f"Diagram saved as: {svg_output}")

        result = subprocess.run(base_cmd + ["-o", png_output, "--scale", "4"], check=True, shell=True,
                                capture_output=True, text=True)
        print(result.stdout)
        print(f"High-quality PNG saved to: {png_output}")

    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Rendering failed:")
        print(f"Return Code: {e.returncode}")
        print(f"Command: {' '.join(e.cmd)}")
        print(f"Output:\n{e.stdout}")
        print(f"Error:\n{e.stderr}")
        sys.exit(1)


# === MAIN ===

def main():
    """Main routine to check dependencies and render all diagrams."""
    if not sys.stdin.isatty():
        print("[INFO] You're running this in IDLE or a non-terminal environment.")
        print("If rendering fails, try running this script from a proper terminal.")
        print()

    for diagram_name, config in DIAGRAMS.items():
        print(f"\nProcessing: {diagram_name}")

        site_data = load_json(config["json"])

        mermaid_lines = ["erDiagram", ""]
        if "entities" in site_data:
            for entity, attributes in site_data["entities"].items():
                mermaid_lines.append(f"    {entity} {{")
                for attribute in attributes:
                    mermaid_lines.append(f"        {attribute}")
                mermaid_lines.append("    }")

        if "relationships" in site_data:
            for relationship in site_data["relationships"]:
                source = relationship.get("from")
                target = relationship.get("to")
                rel_type = relationship.get("type", "many-to-many")
                mermaid_lines.append(f"  {source} ||--o{{ {target} : {rel_type} }}")

        write_mermaid_file(mermaid_lines, config["mmd"])

        try:
            render_mermaid_files(config["mmd"], config["svg"], config["png"], MMDC_COMMAND)
        except RuntimeError:
            print("\n[ERROR] Failed to generate Mermaid diagram.")
            sys.exit(1)

if __name__ == "__main__":
    main()
