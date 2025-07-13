# ===========================
# IMPORTS
# ===========================

import os
import sys
import subprocess
import platform
from PIL import Image
from zipfile import ZipFile
from datetime import datetime
from bs4 import BeautifulSoup

# ===========================
# CONSTANTS
# ===========================

IMAGE_PROFILES = {
    "main": {
        "input_dir": "images/main/original",
        "output_base": "images/main/optimized",
        "quality": 90,
        "sizes": {
            "desktop": {"standard": 1280, "zoom": 1920},
            "laptop":  {"standard": 1024, "zoom": 1366},
            "mobile":  {"standard": 480,  "zoom": 768}
        }
    },
    "projects": {
        "input_dir": "projects/images/main/original",
        "output_base": "projects/images/main/optimized",
        "quality": 90,
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
    }
}

REQUIRED_PACKAGES = [
    ("Pillow", "PIL"),
    ("beautifulsoup4", "bs4")
]

EXPECTED_PLATFORMS = ["debian", "ubuntu"]

# ===========================
# FUNCTIONS
# ===========================

def install_package(pip_name, import_name):
    try:
        __import__(import_name)
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", pip_name])

def check_platform(expected_platforms):
    if "linux" in platform.system().lower():
        distro_info = subprocess.getoutput("cat /etc/os-release")
        if not any(p in distro_info for p in expected_platforms):
            print("Warning: Unexpected Linux distro")
    else:
        print("Warning: Non-Linux system")

def ensure_directory(path):
    os.makedirs(path, exist_ok=True)

def process_all_images(input_dir, output_base, sizes):
    tasks = []
    if not os.path.isdir(input_dir):
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
    tasks = []
    if not os.path.isdir(input_dir):
        return tasks
    for filename in os.listdir(input_dir):
        if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        tasks.append((os.path.join(input_dir, filename),
                      os.path.join(output_dir, filename),
                      target_width, quality))
    return tasks

def resize_image(input_path, output_path, target_width, quality):
    try:
        with Image.open(input_path) as img:
            orig_width, orig_height = img.size
            scale = target_width / orig_width
            target_height = int(orig_height * scale)
            img_resized = img.resize((target_width, target_height), Image.LANCZOS)
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            img_resized.save(output_path, optimize=True, quality=quality)
            print(f"Saved: {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

# ===========================
# MAIN
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

if __name__ == "__main__":
    main()
