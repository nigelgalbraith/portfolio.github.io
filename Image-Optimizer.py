# ===========================
# IMPORTS
# ===========================

import os
import sys
import subprocess
import platform
from zipfile import ZipFile
from datetime import datetime

# ===========================
# CONSTANTS
# ===========================

# Configuration for responsive main images
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
        "input_dir": "projects/images/main/original",
        "output_base": "projects/images/main/optimized",
        "quality": 85,
        "sizes": {
            "desktop": {"standard": 1280, "zoom": 1920},
            "laptop":  {"standard": 1024, "zoom": 1366},
            "mobile":  {"standard": 480,  "zoom": 768}
        }
    }
}

# Thumbnail and icon configuration
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

# Packages to ensure are installed
REQUIRED_PACKAGES = [
    ("Pillow", "PIL"),
    ("beautifulsoup4", "bs4")
]

# Platforms this script is optimized for
EXPECTED_PLATFORMS = ["debian", "ubuntu"]

# Backup settings for HTML files
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

# HTML file processing config: responsive images + thumb/icon rewrites
HTML_IMAGE_CONFIG = {
    ".": {
        "responsive": {
            "base_path": ["images/main/original/",
                          "images/main/"],
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
            "match": ["images/thumbs/original/",
                      "images/thumbs"],
            "replace": "images/thumbs/optimized/"
        },
        "icons": {
            "tag": "img",
            "attribute": "src",
            "match": ["images/icons/original/",
                      "images/icons/"],
            "replace": "images/icons/optimized/"
        }
    },
    "projects": {
        "responsive": {
            "base_path": ["images/main/original/",
                          "images/main/"],
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
            "match": ["images/thumbs/original/",
                      "images/thumbs/"],
            "replace": "images/thumbs/optimized/"
        },
        "icons": {
            "tag": "img",
            "attribute": "src",
            "match": ["images/icons/original/",
                      "images/icons/"],
            "replace": "images/icons/optimized/"
        }
    }
}


# ===========================
# UTILITY FUNCTIONS
# ===========================

def install_package(pip_name, import_name):
    """ Check and install required packages """
    try:
        __import__(import_name)
    except ImportError:
        print(f"Installing {pip_name}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", pip_name])


def check_platform(expected_platforms):
    """ Print the current platform and check distro """
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
    """ Ensure a directory exists """
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"[Created] Directory: {path}")
    else:
        print(f"[Exists]  Directory: {path}")


def check_source_directory(path):
    """ Confirm source directory is available """
    if not os.path.exists(path):
        print(f"[Skip] Source folder does not exist: {path}")
        return False
    print(f"[Found] Source folder: {path}")
    return True


def process_all_images(input_dir, output_base, sizes):
    """ Build tasks for responsive image resizing """
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
    """ Build tasks for thumbs/icons resizing """
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
    """ Perform the actual image resizing """
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
    """ Backup HTML files as zip archive """
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
    """ Delete older backups beyond retention limit """
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
    """Update icon/thumb image src paths if not already optimized."""
    from bs4 import BeautifulSoup
    updated = False

    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    for key, rule in rules.items():
        if key == "responsive":
            continue

        match_list = rule.get("match", [])
        if isinstance(match_list, str):
            match_list = [match_list]  # normalize to list

        for tag in soup.find_all(rule["tag"]):
            attr_value = tag.get(rule["attribute"], "")

            # Skip if already optimized
            if attr_value.startswith(rule["replace"]):
                continue

            # Try all matches, only apply the first one
            matched_prefixes = [m for m in match_list if attr_value.startswith(m)]
            if matched_prefixes:
                filename = os.path.basename(attr_value)
                tag[rule["attribute"]] = os.path.join(rule["replace"], filename).replace('\\', '/')
                updated = True
                print(f"[Updated] {attr_value} →")
                print(tag.prettify())

    if updated:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(soup.prettify())
        print(f"[Saved] {html_file}")
    else:
        print(f"[No Changes] {html_file}")



def update_responsive_picture(html_file, responsive_rule):
    """ Rewrite <picture> blocks with <source> tags for responsive images """
    from bs4 import BeautifulSoup
    updated = False

    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    base_path = responsive_rule["base_path"]
    optimized_base = responsive_rule["optimized_base"]
    fallback_folder = responsive_rule["fallback_device"]
    breakpoints = responsive_rule["breakpoints"]

    for picture in soup.find_all("picture"):
        img = picture.find("img")
        if not img:
            continue

        src = img.get("src", "")
        if not src.startswith(base_path):
            print(f"[Skip] No responsive match for <img src=\"{src}\">")
            continue

        filename = os.path.basename(src)

        expected_sources = {
            bp["media"]: f"{optimized_base}/{bp['folder']}/standard/{filename}"
            for bp in breakpoints
        }
        current_sources = {
            s.get("media"): s.get("srcset")
            for s in picture.find_all("source")
        }

        expected_img_src = f"{optimized_base}/{fallback_folder}/standard/{filename}"
        current_img_src = img.get("src")

        if expected_sources == current_sources and current_img_src == expected_img_src:
            print(f"[No Changes] {src} already matches expected <picture>")
            continue

        for tag in picture.find_all("source"):
            tag.decompose()

        for bp in breakpoints:
            source = soup.new_tag("source")
            source["media"] = bp["media"]
            source["srcset"] = f"{optimized_base}/{bp['folder']}/standard/{filename}"
            picture.insert(0, source)

        img["src"] = expected_img_src
        updated = True
        print(f"[Responsive Rewrite] {src} →")
        print(picture.prettify())

    if updated:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(soup.prettify())
        print(f"[Saved] {html_file}")
    else:
        print(f"[No Changes] {html_file}")


def apply_html_rewriters(html_path, rules):
    """ Apply all rewrites (responsive, thumbs, icons) to a single HTML file """
    responsive_config = rules.get("responsive")
    if responsive_config and isinstance(responsive_config.get("base_path"), list):
        for base_path in responsive_config["base_path"]:
            config = responsive_config.copy()
            config["base_path"] = base_path
            update_responsive_picture(html_path, config)
    elif responsive_config:
        update_responsive_picture(html_path, responsive_config)

    for key in ["thumbs", "icons"]:
        config = rules.get(key)
        if not config:
            continue
        match_values = config.get("match")
        if isinstance(match_values, list):
            for match in match_values:
                single_config = config.copy()
                single_config["match"] = match
                update_thumb_icon_paths(html_path, {key: single_config})
        elif isinstance(match_values, str):
            update_thumb_icon_paths(html_path, {key: config})


def prettify_all_html(source_folder):
    """ Reformat all HTML in a directory for readability """
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
    # Ensure required packages are installed
    for pip_name, import_name in REQUIRED_PACKAGES:
        install_package(pip_name, import_name)

    check_platform(EXPECTED_PLATFORMS)

    # Make sure all necessary output directories exist
    for profile in IMAGE_PROFILES.values():
        for device, versions in profile["sizes"].items():
            for version_type in versions:
                ensure_directory(os.path.join(profile["output_base"], device, version_type))

    for asset_type in ASSET_SETS.values():
        for config in asset_type.values():
            ensure_directory(config["input_dir"])
            ensure_directory(config["output_dir"])

    # Resize responsive images
    for label, config in IMAGE_PROFILES.items():
        print(f"Processing profile: {label}")
        for task in process_all_images(config["input_dir"], config["output_base"], config["sizes"]):
            resize_image(*task, config["quality"])

    # Resize thumbs and icons
    for asset_type, sets in ASSET_SETS.items():
        for label, config in sets.items():
            print(f"Processing {asset_type} for: {label}")
            for task in process_assets(config["input_dir"], config["output_dir"], config["width"], config["quality"]):
                resize_image(*task)

    print("Done. Responsive images and asset images generated.")

    # Apply HTML transformations to every HTML file
    for source, rules in HTML_IMAGE_CONFIG.items():
        print(f"\n[Scan] Checking HTML in folder: {source}")
        if not check_source_directory(source):
            continue

        for file in os.listdir(source):
            if file.endswith(".html"):
                html_path = os.path.join(source, file)
                print(f"[Processing] {html_path}")
                apply_html_rewriters(html_path, rules)

    # Final prettify pass
    for folder in HTML_IMAGE_CONFIG:
        prettify_all_html(folder)


if __name__ == "__main__":
    main()
