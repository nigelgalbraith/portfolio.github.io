# IMPORTS

import json
import sys
import shutil
import textwrap
from graphviz import Digraph

# CONSTANTS

FLOWCHARTS = {
    "TAWebUpdate": {
        "json": "../diagrams/TAWebUpdateFlow.json",
        "png": "../projects/images/main/original/TAWebUpdateFlow",
        "config": "../diagrams/FlowConfig.json"
    },
    "QuizUpdate": {
        "json": "../diagrams/quizWebUpdateFlow.json",
        "png": "../projects/images/main/original/quizWebUpdateFlow",
        "config": "../diagrams/FlowConfig.json"
    },
    "TAImport": {
        "json": "../diagrams/TAImportFlow.json",
        "png": "../projects/images/main/original/TAImportFlow",
        "config": "../diagrams/FlowConfig.json"
    },
    "TAClean": {
        "json": "../diagrams/TACleanFlow.json",
        "png": "../projects/images/main/original/TACleanFlow",
        "config": "../diagrams/FlowConfig.json"
    },
    "QuizImport": {
        "json": "../diagrams/QuizImportFlow.json",
        "png": "../projects/images/main/original/QuizImportFlow",
        "config": "../diagrams/FlowConfig.json"
    },
    "QuizClean": {
        "json": "../diagrams/QuizCleanFlow.json",
        "png": "../projects/images/main/original/QuizCleanFlow",
        "config": "../diagrams/FlowConfig.json"
    }
}

CHECK_CMD = "dot"
CHECK_DES = "Graphviz binary"

def check_command(cmd, description=None):
    """Check if a command is available in the system PATH."""
    if description:
        print(f"[INFO] Checking for {description} ({cmd})...")

    try:
        __import__("graphviz")
    except ImportError:
        print("[ERROR] Missing Python module: graphviz. Install with 'pip install graphviz'")
        sys.exit(1)

    if shutil.which(cmd) is None:
        print(f"[ERROR] Required system command '{cmd}' not found.")
        print("Please install it or ensure it is in your system PATH.")
        sys.exit(1)
    else:
        print(f"[OK] Command '{cmd}' found.")

def load_json(path):
    """Load and return JSON content from a file path."""
    print(f"[INFO] Loading JSON: {path}")
    with open(path, "r") as f:
        return json.load(f)

def shape_for(type_, shape_map):
    """Return the shape for a given node type."""
    return shape_map.get(type_, "box")

def wrap_label(text, width):
    """Wrap a label text to the specified width."""
    return "\n".join(textwrap.wrap(text, width))

def apply_class_styles(dot, class_definitions, class_map, node_style):
    """Apply class-based styles to nodes using Graphviz attributes."""
    for node_id, class_name in class_map.items():
        if class_name in class_definitions:
            style = class_definitions[class_name]
            style_dict = dict(pair.split(":") for pair in style.split(","))
            dot.node(node_id, _attributes={**node_style, **style_dict})

# MAIN
def main():
    """Generate flowcharts from JSON definitions and style config."""
    # Ensure Graphviz and required modules are installed
    check_command(CHECK_CMD, CHECK_DES)  

     # Load flowchart JSON definition & styling and config settings
    for name, paths in FLOWCHARTS.items():
        print(f"\n[INFO] Generating flowchart: {name}")
        data = load_json(paths["json"])          
        config = load_json(paths["config"])        

        # Extract config settings and defaults
        defaults = config.get("defaults", {})
        node_style = config.get("node_defaults", {})
        edge_style = config.get("edge_defaults", {})
        shape_map = config.get("shape_map", {})

        # Default text wrap width
        label_wrap_width = int(defaults.get("labelwrap", 28))  

        # Initialize Graphviz diagram with attributes
        dot = Digraph(name=name, format="png", engine="dot")
        dot.attr(rankdir=defaults["rankdir"])        # Flow direction (e.g., LR, TB)
        dot.attr(nodesep=defaults["nodesep"])        # Horizontal spacing between nodes
        dot.attr(ranksep=defaults["ranksep"])        # Vertical spacing between ranks
        dot.attr(margin=defaults["margin"])          # Diagram margin
        dot.attr(arrowsize=defaults["arrowsize"])    # Arrowhead size
        dot.attr('graph',
                 pad=defaults["pad"],                # Padding around the graph
                 dpi=defaults["dpi"],                # DPI for PNG output
                 splines=defaults["splines"])        # Edge routing style
        dot.attr('node', shape='box', **node_style)  # Default node styling

        # Get diagram node and connection definitions
        nodes = data.get("nodes", {})
        connections = data.get("connections", [])
        classes = data.get("classes", {})
        class_map = data.get("class_map", {})

        # Add nodes to the diagram
        for node_id, props in nodes.items():
            label = wrap_label(props.get("label", node_id), width=label_wrap_width)     # Wrap long labels
            shape = shape_for(props.get("shape", "box"), shape_map)                     # Get node shape
            dot.node(node_id, label=label, shape=shape, **node_style)                   # Draw node

        # Add edges (connections) between nodes
        for conn in connections:
            src, dst = conn[0], conn[1]
            # Optional connector label
            label = conn[2] if len(conn) > 2 else ""  

            # Start with base edge style
            edge_args = {
                k: str(v) for k, v in edge_style.items()
                if not k.startswith("penwidth_") and not k.startswith("fontsize_")
            }

            if label:
                # Apply special styling for "yes"/"no" labels
                penwidth = edge_style["penwidth_yesno"] if label.strip().lower() in ("yes", "no") else edge_style["penwidth"]
                edge_args.update({
                    "xlabel": label,
                    "fontsize": edge_style["fontsize"],
                    "penwidth": penwidth
                })
            else:
                # Alternate style for unlabeled edges
                edge_args.update({
                    "fontsize": edge_style["fontsize_alt"],
                    "penwidth": edge_style["penwidth_alt"]
                })
            # Draw edge
            dot.edge(src, dst, **edge_args)  

        # Apply styling for node classes (e.g., color themes)
        apply_class_styles(dot, classes, class_map, node_style)

        # Render the final PNG and clean up temporary files
        dot.render(paths["png"], cleanup=True)
        print(f"[SUCCESS] PNG saved to: {paths['png']}.png")

if __name__ == "__main__":
    main()
