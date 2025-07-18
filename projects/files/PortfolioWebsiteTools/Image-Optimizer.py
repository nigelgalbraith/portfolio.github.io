# IMPORTS

import os
import sys
import subprocess
from zipfile import ZipFile
from datetime import datetime

# CONSTANTS

IMAGE_PROFILES = {
    "main": {
        "input_dir": "../images/main/original",
        "output_base": "../images/main/optimized",
        "quality": 90,
        "sizes": {
            "desktop": {"standard": 1280, "zoom": 1920},
            "laptop":  {"standard": 1024, "zoom": 1366},
            "mobile":  {"standard": 480,  "zoom": 768}
        }
    },
    "projects": {
        "input_dir": "../projects/images/main/original",
        "output_base": "../projects/images/main/optimized",
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
            "input_dir": "../images/thumbs/original",
            "output_dir": "../images/thumbs/optimized",
            "width": 400,
            "quality": 85
        },
        "projects": {
            "input_dir": "../projects/images/thumbs/original",
            "output_dir": "../projects/images/thumbs/optimized",
            "width": 400,
            "quality": 85
        }
    },
    "icons": {
        "main": {
            "input_dir": "../images/icons/original",
            "output_dir": "../images/icons/optimized",
            "width": 100,
            "quality": 85
        }
    }
}

REQUIRED_PACKAGES = ["PIL", "bs4"]


def check_package(package_name):
    """Check if a package is installed, else print error and exit."""
    try:
        __import__(package_name)
    except ImportError:
        print(f"Package '{package_name}' not installed.")
        sys.exit(1)

        
def ensure_directory(path):
    """Create a directory if it doesn't exist, and print status."""
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"Created directory: {path}")
        

def process_all_images(input_dir, output_base, sizes):
    """Build resize tasks for each image profile."""
    tasks = []
    # Skip if input directory doesn't exist
    if not os.path.isdir(input_dir):
        return tasks
    # Iterate over valid image files
    for filename in os.listdir(input_dir):
        if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        input_path = os.path.join(input_dir, filename)
        # Create output path variations for each device and version
        for device, versions in sizes.items():
            for version_type, width in versions.items():
                output_path = os.path.join(output_base, device, version_type, filename)
                tasks.append((input_path, output_path, width))
    return tasks


def process_assets(input_dir, output_dir, target_width, quality):
    """Build resize tasks for asset images (thumbs/icons)."""
    tasks = []
    # Skip if input directory doesn't exist
    if not os.path.isdir(input_dir):
        return tasks
    # Collect tasks for valid images
    for filename in os.listdir(input_dir):
        if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        tasks.append((os.path.join(input_dir, filename),
                      os.path.join(output_dir, filename),
                      target_width, quality))
    return tasks


def resize_image(input_path, output_path, target_width, quality):
    """Resize and save an image at target width and quality."""
    try:
        from PIL import Image
        # Open image and calculate new size
        with Image.open(input_path) as img:
            orig_width, orig_height = img.size
            scale = target_width / orig_width
            target_height = int(orig_height * scale)
            # Resize using high-quality filter
            img_resized = img.resize((target_width, target_height), Image.LANCZOS)
            # Ensure output directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            # Save optimized image
            img_resized.save(output_path, optimize=True, quality=quality)
            print(f"Saved: {output_path}")
    except Exception as e:
        # Log any errors encountered
        print(f"Error processing {input_path}: {e}")



# MAIN
def main():
    """Run all setup, processing, and resizing tasks."""

    # Ensure required packages are available
    for package in REQUIRED_PACKAGES:
        check_package(package)

    # Import modules after confirming packages are installed
    from PIL import Image
    from bs4 import BeautifulSoup

    # Create output directories for responsive image profiles
    for profile in IMAGE_PROFILES.values():
        for device, versions in profile["sizes"].items():
            for version_type in versions:
                ensure_directory(os.path.join(profile["output_base"], device, version_type))

    # Create input/output directories for thumbnails and icons
    for asset_type in ASSET_SETS.values():
        for config in asset_type.values():
            ensure_directory(config["input_dir"])
            ensure_directory(config["output_dir"])

    # Resize and save responsive images for each profile
    for label, config in IMAGE_PROFILES.items():
        print(f"Processing profile: {label}")
        for task in process_all_images(config["input_dir"], config["output_base"], config["sizes"]):
            resize_image(*task, config["quality"])

    # Resize and save assets (thumbs/icons) for each asset type
    for asset_type, sets in ASSET_SETS.items():
        for label, config in sets.items():
            print(f"Processing {asset_type} for: {label}")
            for task in process_assets(config["input_dir"], config["output_dir"], config["width"], config["quality"]):
                resize_image(*task)

    print("Done. Responsive images and asset images generated.")


if __name__ == "__main__":
    main()
