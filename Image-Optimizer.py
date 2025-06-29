import os
import sys
import subprocess
import platform
from zipfile import ZipFile
from datetime import datetime

# ===========================
# CONSTANTS
# ===========================

IMAGE_PROFILES = {
    "main": {
        "input_dir": "images/main/original",
        "output_base": "images/main/optimized",
        "quality": 85,
        "sizes": {
            "desktop": {"standard": 1280, "zoom": 1920},
            "laptop":  {"standard": 1024, "zoom": 1366},
            "mobile":  {"standard": 480,  "zoom": 768}
        }
    },
    "projects": {
        "input_dir": "projects/main/images/original",
        "output_base": "projects/main/images/optimized",
        "quality": 85,
        "sizes": {
            "desktop": {"standard": 1280, "zoom": 1920},
            "laptop":  {"standard": 1024, "zoom": 1366},
            "mobile":  {"standard": 480,  "zoom": 768}
        }
    }
}

ASSET_SETS = {
    "thumbs": {
        "main": {
            "input_dir": "images/thumbs/original",
            "output_dir": "images/thumbs/optimized",
            "width": 400,
            "quality": 85
        },
        "projects": {
            "input_dir": "projects/images/thumbs/original",
            "output_dir": "projects/images/thumbs/optimized",
            "width": 400,
            "quality": 85
        }
    },
    "icons": {
        "main": {
            "input_dir": "images/icons/original",
            "output_dir": "images/icons/optimized",
            "width": 100,
            "quality": 85
        },
        "projects": {
            "input_dir": "projects/images/icons/original",
            "output_dir": "projects/images/icons/optimized",
            "width": 100,
            "quality": 85
        }
    }
}

REQUIRED_PACKAGES = [
    ("Pillow", "PIL"),
    ("beautifulsoup4", "bs4")
]

EXPECTED_PLATFORMS = ["debian", "ubuntu"]

HTML_BACKUPS = {
    ".": {
        "dest": "backups/html/main",
        "keep": 3
    },
    "projects": {
        "dest": "backups/html/projects",
        "keep": 3
    }
}

HTML_IMAGE_CONFIG = {
    ".": {
        "responsive": {
            "base_path": "images/main/original/",
            "optimized_base": "images/main/optimized",
            "breakpoints": [
                {"media": "(min-width: 1280px)", "folder": "desktop"},
                {"media": "(min-width: 1024px)", "folder": "laptop"},
                {"media": "(min-width: 480px)", "folder": "mobile"}
            ],
            "fallback_device": "mobile"
        },
        "thumbs": {
            "tag": "img",
            "attribute": "src",
            "match": "images/thumbs/original/",
            "replace": "images/thumbs/optimized/"
        },
        "icons": {
            "tag": "img",
            "attribute": "src",
            "match": "images/icons/original/",
            "replace": "images/icons/optimized/"
        }
    },
    "projects": {
        "responsive": {
            "base_path": "images/main/original/",
            "optimized_base": "images/main/optimized",
            "breakpoints": [
                {"media": "(min-width: 1280px)", "folder": "desktop"},
                {"media": "(min-width: 1024px)", "folder": "laptop"},
                {"media": "(min-width: 480px)", "folder": "mobile"}
            ],
            "fallback_device": "mobile"
        },
        "thumbs": {
            "tag": "img",
            "attribute": "src",
            "match": "images/thumbs/original/",
            "replace": "images/thumbs/optimized/"
        },
        "icons": {
            "tag": "img",
            "attribute": "src",
            "match": "images/icons/original/",
            "replace": "images/icons/optimized/"
        }
    }
}


# ===========================
# FUNCTIONS
# ===========================

def install_package(pip_name, import_name):
    """Ensure a required package is installed."""
    try:
        __import__(import_name)
    except ImportError:
        print(f"Installing {pip_name}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", pip_name])


def check_platform(expected_platforms):
    """Log system platform and issue a warning if Linux distro isn't recognized."""
    os_type = platform.system().lower()
    if "windows" in os_type:
        print("Running on Windows")
    elif "linux" in os_type:
        print("Running on Linux")
        distro_info = subprocess.getoutput("cat /etc/os-release")
        if not any(p in distro_info for p in expected_platforms):
            print("Warning: Distro not in expected list — check for compatibility.")
    else:
        print("Warning: Unsupported OS for auto setup")


def ensure_directory(path):
    """Create a directory if it doesn't already exist."""
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"[Created] Directory: {path}")
    else:
        print(f"[Exists]  Directory: {path}")


def check_source_directory(path):
    """Check if a source directory exists."""
    if not os.path.exists(path):
        print(f"[Skip] Source folder does not exist: {path}")
        return False
    print(f"[Found] Source folder: {path}")
    return True


def process_all_images(input_dir, output_base, sizes):
    """Build a list of image resize tasks for all device/variant combinations."""
    tasks = []
    if not os.path.isdir(input_dir):
        print(f"Input folder not found: {input_dir}")
        return tasks

    for filename in os.listdir(input_dir):
        if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        input_path = os.path.join(input_dir, filename)
        for device, versions in sizes.items():
            for version_type, width in versions.items():
                output_path = os.path.join(output_base, device, version_type, filename)
                tasks.append((input_path, output_path, width))
    return tasks


def process_assets(input_dir, output_dir, target_width, quality):
    """Return tasks for asset resizing (thumbs/icons)."""
    tasks = []
    if not os.path.isdir(input_dir):
        print(f"Assets: Input folder not found: {input_dir}")
        return tasks

    for filename in os.listdir(input_dir):
        if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        tasks.append((
            os.path.join(input_dir, filename),
            os.path.join(output_dir, filename),
            target_width,
            quality
        ))
    return tasks


def resize_image(input_path, output_path, target_width, quality):
    """Resize and save a single image."""
    from PIL import Image
    try:
        with Image.open(input_path) as img:
            orig_width, orig_height = img.size
            if orig_width <= target_width:
                img_resized = img.copy()
            else:
                scale = target_width / orig_width
                target_height = int(orig_height * scale)
                img_resized = img.resize((target_width, target_height), Image.LANCZOS)
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            img_resized.save(output_path, optimize=True, quality=quality)
            print(f"Saved: {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")


def backup_html_folder(folder_path, backup_dest):
    """Back up all HTML files in the folder into a zip archive."""
    if not os.path.isdir(folder_path):
        print(f"[Skip] Folder does not exist: {folder_path}")
        return

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    folder_name = os.path.basename(os.path.normpath(folder_path))
    zip_filename = f"{folder_name}_html_backup_{timestamp}.zip"
    zip_path = os.path.join(backup_dest, zip_filename)

    with ZipFile(zip_path, 'w') as zipf:
        for root, _, files in os.walk(folder_path):
            for file in files:
                if file.endswith('.html'):
                    full_path = os.path.join(root, file)
                    arcname = os.path.relpath(full_path, folder_path)
                    zipf.write(full_path, arcname)
                    print(f"[Added] {arcname} to {zip_filename}")

    print(f"[Backup Complete] {zip_path}")


def cleanup_old_backups(backup_dir, keep=3):
    """Remove old backup zip files, keeping only the most recent 'keep' files."""
    if not os.path.isdir(backup_dir):
        print(f"[Skip] Backup folder does not exist: {backup_dir}")
        return

    zip_files = sorted(
        (os.path.join(backup_dir, f) for f in os.listdir(backup_dir) if f.endswith(".zip")),
        key=os.path.getmtime, reverse=True
    )

    for old_file in zip_files[keep:]:
        try:
            os.remove(old_file)
            print(f"[Deleted] Old backup: {old_file}")
        except Exception as e:
            print(f"[Error] Could not delete {old_file}: {e}")


def update_thumb_icon_paths(html_file, rules):
    """Replace src paths for thumbs and icons in the HTML file."""
    from bs4 import BeautifulSoup
    updated = False

    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    for key, rule in rules.items():
        if key == "responsive":
            continue
        for tag in soup.find_all(rule["tag"]):
            attr_value = tag.get(rule["attribute"], "")
            if attr_value.startswith(rule["match"]):
                tag[rule["attribute"]] = attr_value.replace(rule["match"], rule["replace"])
                updated = True
                print(f"[Updated] {attr_value} → {tag[rule['attribute']]}")

    if updated:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(soup.prettify())
        print(f"[Saved] {html_file}")
    else:
        print(f"[No Changes] {html_file}")


def update_responsive_picture(html_file, responsive_rule):
    """Rewrite <picture> blocks in HTML with responsive <source> tags based on breakpoints."""
    from bs4 import BeautifulSoup
    updated = False

    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    base_path = responsive_rule["base_path"]
    optimized_base = responsive_rule["optimized_base"]
    fallback_folder = responsive_rule["fallback_device"]

    for picture in soup.find_all("picture"):
        img = picture.find("img")
        if not img:
            continue
        src = img.get("src", "")

        # Check if the img src still uses the original base path
        if not src.startswith(base_path):
            print(f"[Skip] No responsive match for <img src=\"{src}\">")
            continue

        filename = os.path.basename(src)

        # Clear existing <source> tags
        for tag in picture.find_all("source"):
            tag.decompose()

        # Insert <source> tags for each breakpoint
        for bp in responsive_rule["breakpoints"]:
            source = soup.new_tag("source")
            source["media"] = bp["media"]
            source["srcset"] = f"{optimized_base}/{bp['folder']}/standard/{filename}"
            picture.insert(0, source)

        # Update the fallback <img> tag
        img["src"] = f"{optimized_base}/{fallback_folder}/standard/{filename}"
        updated = True
        print(f"[Responsive Rewrite] {src} → <picture> with breakpoints")

    if updated:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(soup.prettify())
        print(f"[Saved] {html_file}")
    else:
        print(f"[No Changes] {html_file}")



def prettify_all_html(source_folder):
    """Prettify all HTML files in a given folder using BeautifulSoup."""
    from bs4 import BeautifulSoup
    print(f"\n[Prettify] Tidying HTML in: {source_folder}")

    if not os.path.isdir(source_folder):
        print(f"[Skip] Folder does not exist: {source_folder}")
        return

    for root, _, files in os.walk(source_folder):
        for file in files:
            if not file.endswith(".html"):
                continue
            html_path = os.path.join(root, file)
            try:
                with open(html_path, 'r', encoding='utf-8') as f:
                    soup = BeautifulSoup(f, 'html.parser')
                with open(html_path, 'w', encoding='utf-8') as f:
                    f.write(soup.prettify())
                print(f"[Prettified] {html_path}")
            except Exception as e:
                print(f"[Error] Could not prettify {html_path}: {e}")


# ===========================
# MAIN EXECUTION
# ===========================

def main():
    for pip_name, import_name in REQUIRED_PACKAGES:
        install_package(pip_name, import_name)

    check_platform(EXPECTED_PLATFORMS)

    for profile in IMAGE_PROFILES.values():
        for device, versions in profile["sizes"].items():
            for version_type in versions:
                ensure_directory(os.path.join(profile["output_base"], device, version_type))

    for asset_type in ASSET_SETS.values():
        for config in asset_type.values():
            ensure_directory(config["input_dir"])
            ensure_directory(config["output_dir"])

    for label, config in IMAGE_PROFILES.items():
        print(f"Processing profile: {label}")
        for task in process_all_images(config["input_dir"], config["output_base"], config["sizes"]):
            resize_image(*task, config["quality"])

    for asset_type, sets in ASSET_SETS.items():
        for label, config in sets.items():
            print(f"Processing {asset_type} for: {label}")
            for task in process_assets(config["input_dir"], config["output_dir"], config["width"], config["quality"]):
                resize_image(*task)

    print("Done. Responsive images and asset images generated.")

    for source, config in HTML_BACKUPS.items():
        if not check_source_directory(source):
            continue
        ensure_directory(config["dest"])
        backup_html_folder(source, config["dest"])
        cleanup_old_backups(config["dest"], config["keep"])

    for source, rules in HTML_IMAGE_CONFIG.items():
        print(f"\n[Scan] Checking HTML in folder: {source}")
        if not check_source_directory(source):
            continue

        responsive = rules.get("responsive")
        for file in os.listdir(source):
            if file.endswith(".html"):
                html_path = os.path.join(source, file)
                print(f"[Processing] {html_path}")
                if responsive:
                    update_responsive_picture(html_path, responsive)
                update_thumb_icon_paths(html_path, rules)

    for folder in HTML_IMAGE_CONFIG:
        prettify_all_html(folder)


if __name__ == "__main__":
    main()
