# ==============================
# PYTHON FLOWCHART CREATION TOOL
# ==============================

# =======
# IMPORTS
# =======
import json
import sys
import shutil
import textwrap
from graphviz import Digraph

# =========
# CONSTANTS
# =========

# Dictionary defining the diagrams to generate.
# Each entry includes:
# - The JSON definition of the diagram
# - The PNG output path (now includes .png extension)
# - The JSON config file for styles and layout
FLOWCHARTS = {
    "TAWebUpdate": {
        "json": "../diagrams/TAWebUpdateFlow.json",
        "png": "../projects/images/main/original/TAWebUpdateFlow.png",
        "config": "../diagrams/FlowConfig.json"
    },
    "QuizUpdate": {
        "json": "../diagrams/quizWebUpdateFlow.json",
        "png": "../projects/images/main/original/quizWebUpdateFlow.png",
        "config": "../diagrams/FlowConfig.json"
    },
    "TAImport": {
        "json": "../diagrams/TAImportFlow.json",
        "png": "../projects/images/main/original/TAImportFlow.png",
        "config": "../diagrams/FlowConfig.json"
    },
    "TAClean": {
        "json": "../diagrams/TACleanFlow.json",
        "png": "../projects/images/main/original/TACleanFlow.png",
        "config": "../diagrams/FlowConfig.json"
    },
    "QuizImport": {
        "json": "../diagrams/QuizImportFlow.json",
        "png": "../projects/images/main/original/QuizImportFlow.png",
        "config": "../diagrams/FlowConfig.json"
    },
    "QuizClean": {
        "json": "../diagrams/QuizCleanFlow.json",
        "png": "../projects/images/main/original/QuizCleanFlow.png",
        "config": "../diagrams/FlowConfig.json"
    }
}

# Required external Graphviz command and description for checks
CHECK_CMD = "dot"
CHECK_DES = "Graphviz binary"

# ================
# HELPER FUNCTIONS
# ================

def check_command(cmd, description=None):
    """Check if a command is available in the system PATH and the graphviz module is installed."""
    if description:
        print(f"[INFO] Checking for {description} ({cmd})...")
    try:
        __import__("graphviz")
    except ImportError:
        print("[ERROR] Missing Python module: graphviz. Install with 'pip install graphviz'")
        sys.exit(1)
    if shutil.which(cmd) is None:
        print(f"[ERROR] Required system command '{cmd}' not found.")
        sys.exit(1)
    print(f"[OK] Command '{cmd}' found.")

def load_json(path):
    """Load and return JSON content from a file path."""
    print(f"[INFO] Loading JSON: {path}")
    with open(path, "r") as f:
        return json.load(f)

def shape_for(type_, shape_map):
    """Return the shape for a given node type, defaulting to 'box'."""
    return shape_map.get(type_, "box")

def wrap_label(text, width):
    """Wrap long label text to improve readability in the diagram."""
    return "\n".join(textwrap.wrap(text, width))

def apply_class_styles(dot, class_definitions, class_map, node_style):
    """
    Apply class-specific styles to nodes, if defined.
    Merges default node style with any class-defined styles.
    """
    for node_id, class_name in class_map.items():
        if class_name in class_definitions:
            style = class_definitions[class_name]
            # Convert style string to dictionary
            style_dict = dict(pair.split(":") for pair in style.split(","))
            # Merge with default styles and apply to node
            dot.node(node_id, _attributes={**node_style, **style_dict})

# ===================
# DIAGRAM PREPARATION
# ===================

def prepare_diagram(name, json_path, config_path):
    """
    Load the diagram definition and config, then initialize the Graphviz Digraph.
    Returns:
    - the diagram object,
    - the raw node/connection/class data,
    - and all relevant config values.
    """
    print(f"\n[INFO] Generating flowchart: {name}")
    data = load_json(json_path)
    config = load_json(config_path)

    # Load styling/layout options from config
    defaults = config.get("defaults", {})
    node_style = config.get("node_defaults", {})
    edge_style = config.get("edge_defaults", {})
    shape_map = config.get("shape_map", {})
    label_wrap_width = int(defaults.get("labelwrap", 28))

    # Set up base diagram structure
    dot = Digraph(name=name, format="png", engine="dot")
    dot.attr(rankdir=defaults.get("rankdir", "LR"))
    dot.attr(nodesep=defaults.get("nodesep", "0.5"))
    dot.attr(ranksep=defaults.get("ranksep", "0.5"))
    dot.attr(margin=defaults.get("margin", "0.2"))
    dot.attr(arrowsize=defaults.get("arrowsize", "0.6"))
    dot.attr('graph',
             pad=defaults.get("pad", "0.2"),
             dpi=defaults.get("dpi", "96"),
             splines=defaults.get("splines", "true"))
    dot.attr('node', shape='box', **node_style)

    return dot, data, config, node_style, edge_style, label_wrap_width, shape_map

def add_edge_to_dot(dot, conn, edge_style):
    """
    Add an edge (connection) between two nodes, with optional label and styling.
    Handles special styling for 'yes'/'no' labels.
    """
    src, dst = conn[0], conn[1]
    label = conn[2] if len(conn) > 2 else ""

    # Extract base edge styling
    edge_args = {
        k: str(v) for k, v in edge_style.items()
        if not k.startswith("penwidth_") and not k.startswith("fontsize_")
    }

    if label:
        # Apply thicker lines for yes/no decision labels
        penwidth = edge_style.get("penwidth_yesno", edge_style.get("penwidth", "1")) \
            if label.strip().lower() in ("yes", "no") else edge_style.get("penwidth", "1")
        edge_args.update({
            "xlabel": label,
            "fontsize": edge_style.get("fontsize", "10"),
            "penwidth": penwidth
        })
    else:
        # Style for regular unlabeled connections
        edge_args.update({
            "fontsize": edge_style.get("fontsize_alt", "8"),
            "penwidth": edge_style.get("penwidth_alt", "0.8")
        })

    dot.edge(src, dst, **edge_args)

# =====
# MAIN
# ===== 
def main():
    """Main routine: check requirements, load each diagram, and generate flowchart PNGs."""
    check_command(CHECK_CMD, CHECK_DES)

    for name, paths in FLOWCHARTS.items():
        dot, data, config, node_style, edge_style, label_wrap_width, shape_map = prepare_diagram(
            name, paths["json"], paths["config"]
        )

        # Load core data from JSON
        nodes = data.get("nodes", {})
        connections = data.get("connections", [])
        classes = data.get("classes", {})
        class_map = data.get("class_map", {})

        # Add all nodes with shape and wrapped labels
        for node_id, props in nodes.items():
            label = wrap_label(props.get("label", node_id), width=label_wrap_width)
            shape = shape_for(props.get("shape", "box"), shape_map)
            dot.node(node_id, label=label, shape=shape, **node_style)

        # Add flowchart edges
        for conn in connections:
            add_edge_to_dot(dot, conn, edge_style)

        # Apply class-based node styles
        apply_class_styles(dot, classes, class_map, node_style)

        # Export PNG to file path (already includes .png)
        dot.render(filename=paths["png"].removesuffix(".png"), cleanup=True)
        print(f"[SUCCESS] PNG saved to: {paths['png']}")

if __name__ == "__main__":
    main()
