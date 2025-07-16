import json, sys, shutil, textwrap
from graphviz import Digraph

# === FLOWCHART CONFIG ===

FLOWCHARTS = {
    "TAPythonWebUpdate": {
        "json": "diagrams/TAPythonWebUpdate.json",
        "png": "projects/images/main/original/TAPythonWebUpdate",
        "config": "diagrams/Flow-Config.json"
    },
    "QuizPythonUpdate": {
        "json": "diagrams/QuizPythonUpdate.json",
        "png": "projects/images/main/original/quiz-updateFlow",
        "config": "diagrams/Flow-Config.json"
    }
}

# === HELPERS ===

def ensure_graphviz_module():
    """Ensure the 'graphviz' Python module is installed."""
    try:
        import graphviz
        return graphviz
    except ImportError:
        print("[ERROR] 'graphviz' Python module is missing. Install with: pip install graphviz")
    if shutil.which("dot") is None:
        print("[ERROR] Graphviz system package is missing. Install it using your package manager.")
    sys.exit(1)

def ensure_graphviz_binary():
    """Ensure Graphviz 'dot' binary is available."""
    if shutil.which("dot") is None:
        print("Missing 'dot' binary from Graphviz.")
        sys.exit(1)

def load_json(path):
    """Load and return a JSON file from path."""
    with open(path, "r") as f:
        return json.load(f)

def shape_for(type_, shape_map):
    """Get Graphviz shape from type using shape_map."""
    return shape_map.get(type_, "box")

def wrap_label(text, width):
    """Wrap long text into multiple lines."""
    return "\n".join(textwrap.wrap(text, width))

def apply_class_styles(dot, class_definitions, class_map, node_style):
    """Apply custom styles to nodes using class definitions."""
    for node_id, class_name in class_map.items():
        if class_name in class_definitions:
            style = class_definitions[class_name]
            style_dict = dict(pair.split(":") for pair in style.split(","))
            dot.node(node_id, _attributes={**node_style, **style_dict})


# === MAIN ===

def main():
    """Generate flowcharts from JSON definitions and config."""
    ensure_graphviz_binary()
    ensure_graphviz_module()

    for name, paths in FLOWCHARTS.items():
        print(f"\nGenerating flowchart: {name}")
        data = load_json(paths["json"])
        config = load_json(paths["config"])

        defaults = config.get("defaults", {})
        edge_style = config.get("edge_defaults", {})
        shape_map = config.get("shape_map", {})
        rankdir = defaults.get("rankdir", "LR")
        label_wrap_width = int(defaults.get("labelwrap", 28))

        node_style = {
            "fontname": defaults.get("fontname", "Arial"),
            "fontsize": defaults.get("fontsize", "16"),
            "penwidth": defaults.get("penwidth", "2"),
            "style": defaults.get("style", "rounded,filled"),
            "fontcolor": defaults.get("fontcolor", "black"),
            "color": defaults.get("color", "black"),
            "fillcolor": defaults.get("fillcolor", "#f9f9f9"),
            "width": defaults.get("width", "6"),
            "height": defaults.get("height", "5"),
            "margin": defaults.get("nodemargin", "0.5")
        }

        dot = Digraph(name=name, format="png", engine="dot")
        dot.attr(rankdir=rankdir)
        dot.attr(nodesep=defaults.get("nodesep", "1.0"))
        dot.attr(ranksep=defaults.get("ranksep", "1.0"))
        dot.attr(margin=defaults.get("margin", "0.5"))
        dot.attr(arrowsize=defaults.get("arrowsize", "1.0"))
        dot.attr(nodesep=defaults.get("nodesep", "1.0"),
                 ranksep=defaults.get("ranksep", "1.0"),
                 margin=defaults.get("margin", "1.0,1.0"))
        dot.attr('node', shape='box', **node_style)

        nodes = data.get("nodes", {})
        connections = data.get("connections", [])
        classes = data.get("classes", {})
        class_map = data.get("class_map", {})

        for node_id, props in nodes.items():
            label = wrap_label(props.get("label", node_id), width=label_wrap_width)
            shape = shape_for(props.get("shape", "box"), shape_map)
            dot.node(node_id, label=label, shape=shape, **node_style)

        for conn in connections:
            src, dst = conn[0], conn[1]
            label = conn[2] if len(conn) > 2 else ""
            edge_args = {
                "fontname": edge_style.get("fontname", "Arial"),
                "fontcolor": edge_style.get("fontcolor", "black"),
                "arrowsize": defaults.get("arrowsize", "1.0")
            }

            if label:
                penwidth = (
                    edge_style.get("penwidth_yesno", edge_style.get("penwidth", "2.5"))
                    if label.strip().lower() in ("yes", "no")
                    else edge_style.get("penwidth", "2.5")
                )
                edge_args.update({
                    "xlabel": label,
                    "fontsize": edge_style.get("fontsize", "40"),
                    "penwidth": edge_style.get("penwidth_alt", "5")
                })
            else:
                edge_args.update({
                    "fontsize": edge_style.get("fontsize_alt", "13"),
                    "penwidth": edge_style.get("penwidth_alt", "5")
                })

            dot.edge(src, dst, **edge_args)


        apply_class_styles(dot, classes, class_map, node_style)
        dot.graph_attr.update({
            "pad": defaults.get("pad", "0.5"),
            "dpi": defaults.get("dpi", "96"),
            "splines": defaults.get("splines", "ortho")
        })
        dot.render(paths["png"], cleanup=True)
        png_output_path = paths["png"] + ".png"
        print(f"PNG saved to: {png_output_path}")

if __name__ == "__main__":
    main()
