import json, sys, shutil, textwrap
from graphviz import Digraph

# === ERD CONFIG ===
ERD_CONFIG = "../diagrams/ERDConfig.json"  
ERD_JSON = "../diagrams/TAERDDiagram.json"  
OUTPUT_PNG = "../projects/images/main/original/ThematicAnalysisStructureEDR2"

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

# === ERD SPECIFIC FUNCTION ===

def prepare_erd_data(data, config):
    """Prepare the ERD data without generating the diagram."""
    return data, config

# === MAIN ===

def main():
    """Generate ERD diagram from JSON definitions and config."""
    ensure_graphviz_binary()
    ensure_graphviz_module()

    print(f"\nGenerating ERD diagram...")

    # Load data and config files
    data = load_json(ERD_JSON)
    config = load_json(ERD_CONFIG)

    # Load settings from the config file
    defaults = config.get("defaults", {})
    edge_style = config.get("edge_defaults", {})
    shape_map = config.get("shape_map", {})
    rankdir = defaults.get("rankdir", "LR")
    splines = defaults.get("splines", "false")

    dot = Digraph(name="TAERDiagram", format="png", engine="dot")
    dot.attr(rankdir=rankdir, splines=splines)

    nodes = data.get("entities", {})
    relationships = data.get("relationships", [])

    # Loop to generate entity nodes for the ERD diagram
    for entity, attributes in nodes.items():
        label = f"{entity}\n" + "\n".join(attributes)
        shape = shape_map.get("entity", "rect")
        fillcolor = defaults.get("entity_fillcolor", "#d4e6f1")
        dot.node(entity, label=label, shape=shape, style="filled", fillcolor=fillcolor)

    # Loop to generate relationships for the ERD diagram
    for relationship in relationships:
        source = relationship.get("from")
        target = relationship.get("to")
        rel_type = relationship.get("type", "many-to-many")
        edge_color = edge_style.get("color", "#000000")
        fontname = edge_style.get("fontname", "Arial")
        fontsize = edge_style.get("fontsize", "12")
        dot.edge(source, target, label=rel_type, color=edge_color, fontname=fontname, fontsize=fontsize, style="solid")

    # Render ERD diagram to PNG
    dot.render(OUTPUT_PNG, cleanup=True)
    print(f"ERD PNG saved to: {OUTPUT_PNG}.png")

if __name__ == "__main__":
    main()
