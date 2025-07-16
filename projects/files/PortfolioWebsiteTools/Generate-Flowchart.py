import json
import subprocess
import sys
import shutil
import os
import textwrap

# === FLOWCHART CONFIG ===

FLOWCHARTS = {
    "TAPythonWebUpdate": {
        "json": "diagrams/TAPythonWebUpdate.json",
        "png": "projects/images/main/original/TAPythonWebUpdate"
    },
    "QuizPythonUpdate": {
        "json": "diagrams/QuizPythonUpdate.json",
        "png": "projects/images/main/original/quiz-updateFlow"
    }
}

# === HELPERS ===

def ensure_graphviz_module():
    """Ensure the 'graphviz' Python module is installed."""
    try:
        import graphviz
        return graphviz
    except ImportError:
        print("Installing 'graphviz' module...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "graphviz"])
        import graphviz
        return graphviz

def ensure_graphviz_binary():
    """Ensure Graphviz binary (dot) is available in PATH."""
    if shutil.which("dot") is None:
        print("Missing 'dot' binary from Graphviz.\nDownload from: https://graphviz.org/download/\nEnsure it's added to your system PATH.")
        sys.exit(1)

def load_json(path):
    """Load JSON file from path."""
    with open(path, "r") as f:
        return json.load(f)

def shape_for(type_):
    """Map shape keyword to Graphviz shape."""
    if type_ == "terminator":
        return "oval"
    elif type_ == "decision":
        return "diamond"
    return "box"

def wrap_label(text, width=28):
    """Insert line breaks and apply bold font using HTML-like labels."""
    lines = textwrap.wrap(text, width)
    html = "<b>" + "<br/>".join(lines) + "</b>"
    return f"<{html}>"

def apply_class_styles(dot, class_definitions, class_map, node_style):
    """Apply custom styles to nodes using class definitions."""
    for node_id, class_name in class_map.items():
        if class_name in class_definitions:
            style = class_definitions[class_name]
            style_dict = dict(pair.split(":") for pair in style.split(","))
            merged_style = {**node_style, **style_dict}
            dot.node(node_id, _attributes=merged_style)

# === MAIN ===

def main():
    """Main entry point to generate flowchart(s)."""
    ensure_graphviz_binary()
    graphviz = ensure_graphviz_module()
    from graphviz import Digraph

    for name, paths in FLOWCHARTS.items():
        print(f"\nGenerating flowchart: {name}")
        data = load_json(paths["json"])

        defaults = data.get("defaults", {})
        rankdir = defaults.get("rankdir", "LR")

        node_style = {
            "fontname": "Arial",
            "fontsize": "50",
            "penwidth": "2",
            "style": "rounded,filled",
            "fontcolor": "white",
            "color": "black"
        }
        node_style.update({k: v for k, v in defaults.items() if k not in node_style and k != "rankdir"})

        dot = Digraph(name=name, format="png", engine="dot")
        dot.attr(rankdir=rankdir)
        dot.attr('node', shape='box', style='rounded,filled', fontname='Arial', fontsize='16')

        nodes = data.get("nodes", {})
        connections = data.get("connections", [])
        classes = data.get("classes", {})
        class_map = data.get("class_map", {})

        for node_id, props in nodes.items():
            label = wrap_label(props.get("label", node_id))
            shape = shape_for(props.get("shape", "box"))
            dot.node(node_id, label=label, shape=shape, **node_style)

        for conn in connections:
            src, dst = conn[0], conn[1]
            label = conn[2] if len(conn) > 2 else ""
            if label:
                dot.edge(src, dst, label=f'< <b>{label}</b> >', fontname="Arial", fontsize="50", fontcolor="black", penwidth="2.5")
            else:
                dot.edge(src, dst, fontname="Arial", fontsize="13", fontcolor="black", penwidth="5")

        apply_class_styles(dot, classes, class_map, node_style)
        dot.render(paths["png"], cleanup=True)
        print(f"PNG saved to: {paths['png']}")

if __name__ == "__main__":
    main()
