import os
import sys
import subprocess
from PIL import Image
import platform

# ===========================
# CONSTANTS
# ===========================
IMAGE_PROFILES = {
    "main": {
        "input_dir": "images/original",
        "output_base": "images/optimized",
        "quality": 85,
        "sizes": {
            "desktop": {"standard": 1280, "zoom": 1920},
            "laptop":  {"standard": 1024, "zoom": 1366},
            "mobile":  {"standard": 480,  "zoom": 768}
        }
    },
    "projects": {
        "input_dir": "projects/images/original",
        "output_base": "projects/images/optimized",
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


REQUIRED_PACKAGES = ["PIL"]
EXPECTED_PLATFORMS = ["debian", "ubuntu"]

# ===========================
# FUNCTIONS
# ===========================

def install_packages(required_packages):
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])

def check_platform(expected_platforms):
    os_type = platform.system().lower()
    if "windows" in os_type:
        print("Running on Windows")
    elif "linux" in os_type:
        print("Running on Linux")
        try:
            distro_info = subprocess.getoutput("cat /etc/os-release")
            if not any(p in distro_info for p in expected_platforms):
                print("Warning: Distro not in expected list — check for compatibility.")
        except Exception:
            pass
    else:
        print("Warning: Unsupported OS for auto setup")


def process_all_images(input_dir, output_base, sizes):
    """
    Collects all image processing tasks and returns a list of (input_path, output_path, width)
    """
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
    tasks = []
    if not os.path.isdir(input_dir):
        print(f"Assets: Input folder not found: {input_dir}")
        return tasks

    for filename in os.listdir(input_dir):
        if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)
        tasks.append((input_path, output_path, target_width, quality))

    return tasks



def resize_image(input_path, output_path, target_width, quality):
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

# ===========================
# MAIN
# ===========================

def main():
    install_packages(REQUIRED_PACKAGES)
    check_platform(EXPECTED_PLATFORMS)

    # Resize responsive images (per device)
    for label, config in IMAGE_PROFILES.items():
        print(f"Processing profile: {label}")
        tasks = process_all_images(
            config["input_dir"],
            config["output_base"],
            config["sizes"]
        )
        for input_path, output_path, width in tasks:
            resize_image(input_path, output_path, width, config["quality"])

    # Resize assets (thumbs and icons)
    for asset_type, sets in ASSET_SETS.items():
        for label, config in sets.items():
            print(f"Processing {asset_type} for: {label}")
            tasks = process_assets(
                config["input_dir"],
                config["output_dir"],
                config["width"],
                config["quality"]
            )
            for input_path, output_path, width, quality in tasks:
                resize_image(input_path, output_path, width, quality)

    print("Done. Responsive images and asset images generated.")


if __name__ == "__main__":
    main()
