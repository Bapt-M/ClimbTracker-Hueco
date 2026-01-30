# -*- coding: utf-8 -*-
"""
Script de scraping detaille pour sboulder.com/hueco/zenith
Clique sur chaque carte pour recuperer toutes les infos

Usage:
    pip install selenium webdriver-manager
    python scripts/scrape-sboulder-detailed.py
"""

import json
import time
import re
import os
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# Configuration
BASE_URL = "https://sboulder.com/hueco/zenith"
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_JSON = os.path.join(OUTPUT_DIR, "sboulder-data-detailed.json")
OUTPUT_SQL = os.path.join(OUTPUT_DIR, "insert-zenith-blocs.sql")

OPENER_ID = "57f59f9a-432e-46e2-a4fd-1df817b5b52f"

# Mapping des niveaux (anglais + francais)
DIFFICULTY_MAP = {
    # Anglais
    "green": {"hex": "#22c55e", "category": "green", "name": "Vert"},
    "light green": {"hex": "#86efac", "category": "green", "name": "Vert clair"},
    "light blue": {"hex": "#7dd3fc", "category": "blue", "name": "Bleu clair"},
    "blue": {"hex": "#3b82f6", "category": "blue", "name": "Bleu foncé"},
    "dark blue": {"hex": "#1d4ed8", "category": "blue", "name": "Bleu fonce"},
    "purple": {"hex": "#a855f7", "category": "purple", "name": "Violet"},
    "pink": {"hex": "#ec4899", "category": "pink", "name": "Rose"},
    "red": {"hex": "#ef4444", "category": "red", "name": "Rouge"},
    "orange": {"hex": "#f97316", "category": "orange", "name": "Orange"},
    "yellow": {"hex": "#eab308", "category": "yellow", "name": "Jaune"},
    "white": {"hex": "#f3f4f6", "category": "white", "name": "Blanc"},
    "black": {"hex": "#1f2937", "category": "black", "name": "Noir"},
    "gray": {"hex": "#6b7280", "category": "grey", "name": "Gris"},
    "grey": {"hex": "#6b7280", "category": "grey", "name": "Gris"},
    # Francais
    "vert": {"hex": "#22c55e", "category": "green", "name": "Vert"},
    "vert clair": {"hex": "#86efac", "category": "green", "name": "Vert clair"},
    "bleu clair": {"hex": "#7dd3fc", "category": "blue", "name": "Bleu clair"},
    "bleu": {"hex": "#3b82f6", "category": "blue", "name": "Bleu foncé"},
    "bleu fonce": {"hex": "#1d4ed8", "category": "blue", "name": "Bleu fonce"},
    "bleu foncé": {"hex": "#1d4ed8", "category": "blue", "name": "Bleu fonce"},
    "violet": {"hex": "#a855f7", "category": "purple", "name": "Violet"},
    "rose": {"hex": "#ec4899", "category": "pink", "name": "Rose"},
    "rouge": {"hex": "#ef4444", "category": "red", "name": "Rouge"},
    "jaune": {"hex": "#eab308", "category": "yellow", "name": "Jaune"},
    "blanc": {"hex": "#f3f4f6", "category": "white", "name": "Blanc"},
    "noir": {"hex": "#1f2937", "category": "black", "name": "Noir"},
    "gris": {"hex": "#6b7280", "category": "grey", "name": "Gris"},
}

# Mapping des couleurs de prises (anglais + francais)
HOLD_COLOR_MAP = {
    # Anglais
    "yellow": {"hex": "#eab308", "category": "yellow"},
    "red": {"hex": "#ef4444", "category": "red"},
    "blue": {"hex": "#3b82f6", "category": "blue"},
    "light blue": {"hex": "#7dd3fc", "category": "blue"},
    "green": {"hex": "#22c55e", "category": "green"},
    "light green": {"hex": "#86efac", "category": "green"},
    "orange": {"hex": "#f97316", "category": "orange"},
    "purple": {"hex": "#a855f7", "category": "purple"},
    "pink": {"hex": "#ec4899", "category": "pink"},
    "black": {"hex": "#1f2937", "category": "black"},
    "white": {"hex": "#f3f4f6", "category": "white"},
    "gray": {"hex": "#6b7280", "category": "grey"},
    "grey": {"hex": "#6b7280", "category": "grey"},
    # Francais
    "jaunes": {"hex": "#eab308", "category": "yellow"},
    "jaune": {"hex": "#eab308", "category": "yellow"},
    "rouges": {"hex": "#ef4444", "category": "red"},
    "rouge": {"hex": "#ef4444", "category": "red"},
    "bleues": {"hex": "#3b82f6", "category": "blue"},
    "bleu": {"hex": "#3b82f6", "category": "blue"},
    "bleu clair": {"hex": "#7dd3fc", "category": "blue"},
    "vertes": {"hex": "#22c55e", "category": "green"},
    "vert": {"hex": "#22c55e", "category": "green"},
    "vert clair": {"hex": "#86efac", "category": "green"},
    "oranges": {"hex": "#f97316", "category": "orange"},
    "violettes": {"hex": "#a855f7", "category": "purple"},
    "violet": {"hex": "#a855f7", "category": "purple"},
    "roses": {"hex": "#ec4899", "category": "pink"},
    "rose": {"hex": "#ec4899", "category": "pink"},
    "noires": {"hex": "#1f2937", "category": "black"},
    "noir": {"hex": "#1f2937", "category": "black"},
    "blanches": {"hex": "#f3f4f6", "category": "white"},
    "blanc": {"hex": "#f3f4f6", "category": "white"},
    "grises": {"hex": "#6b7280", "category": "grey"},
    "gris": {"hex": "#6b7280", "category": "grey"},
}

# Mapping des types de voie
ROUTE_TYPES_MAP = {
    "dalle": "Dalle", "devers": "Devers", "vertical": "Vertical",
    "diedre": "Diedre", "arete": "Arete", "toit": "Toit",
    "dynamique": "Dynamique", "dyno": "Dynamique", "equilibre": "Equilibre",
    "coordination": "Coordination", "reglette": "Reglette", "pince": "Pince",
    "bac": "Bac", "plat": "Plat", "arquee": "Arquee",
}


def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)


def find_difficulty(label_text):
    if not label_text:
        return DIFFICULTY_MAP["gris"]
    # Nettoyer le texte (enlever "niveau", "level", etc.)
    label_lower = label_text.lower().replace("niveau ", "").replace("level ", "").strip()
    for key, value in DIFFICULTY_MAP.items():
        if key == label_lower or key in label_lower:
            return value
    return DIFFICULTY_MAP["gris"]


def find_hold_color(color_text):
    if not color_text:
        return {"hex": "#6b7280", "category": "grey"}
    # Nettoyer le texte (enlever "prises", "holds", etc.)
    color_lower = color_text.lower().replace(" holds", "").replace("prises ", "").strip()
    for key, value in HOLD_COLOR_MAP.items():
        if key == color_lower or key in color_lower:
            return value
    return {"hex": "#6b7280", "category": "grey"}


def parse_date(text):
    if not text:
        return None

    # Format ISO: "2026-01-29"
    match = re.search(r'(\d{4}-\d{2}-\d{2})', text)
    if match:
        return match.group(1)

    mois = {
        "janvier": "01", "fevrier": "02", "mars": "03", "avril": "04",
        "mai": "05", "juin": "06", "juillet": "07", "aout": "08",
        "septembre": "09", "octobre": "10", "novembre": "11", "decembre": "12",
        "january": "01", "february": "02", "march": "03", "april": "04",
        "may": "05", "june": "06", "july": "07", "august": "08",
        "september": "09", "october": "10", "november": "11", "december": "12",
    }

    text_lower = text.lower()

    for m, num in mois.items():
        pattern = rf'(\d{{1,2}})\s*{m}[a-z]*\s*(\d{{4}})'
        match = re.search(pattern, text_lower)
        if match:
            return f"{match.group(2)}-{num}-{match.group(1).zfill(2)}"

    # Format: "12/01/2024"
    match = re.search(r'(\d{1,2})/(\d{1,2})/(\d{4})', text)
    if match:
        return f"{match.group(3)}-{match.group(2).zfill(2)}-{match.group(1).zfill(2)}"

    return None


def extract_opener_name(text):
    """Extrait le nom de l'ouvreur"""
    if not text:
        return None
    # Le nom est generalement sur une ligne contenant des lettres (pas juste des chiffres)
    lines = text.strip().split('\n')
    for line in lines:
        name = line.strip()
        # Verifier que ce n'est pas une date, un hashtag, ou juste un nombre
        if name and not name.startswith('#') and not re.match(r'^\d+$', name) and not re.match(r'\d{4}-\d{2}-\d{2}', name):
            # Doit contenir au moins une lettre
            if re.search(r'[a-zA-ZÀ-ÿ]', name):
                return name
    return None


def extract_hashtags(text):
    """Extrait les hashtags comme types de voie"""
    if not text:
        return []
    # Mots de liaison a exclure
    excluded_words = {
        'a', 'à', 'au', 'aux', 'de', 'des', 'du', 'le', 'la', 'les', 'l',
        'un', 'une', 'et', 'ou', 'en', 'pour', 'par', 'sur', 'avec', 'sans',
        'the', 'a', 'an', 'and', 'or', 'for', 'with', 'without', 'on', 'in',
        'kid', 'kids', 'adapte', 'adapted'  # mots specifiques a exclure
    }
    # Trouver tous les hashtags
    hashtags = re.findall(r'#(\w+)', text)
    # Filtrer les mots de liaison
    filtered = [h for h in hashtags if h.lower() not in excluded_words and len(h) > 2]
    return filtered


# Mapping des secteurs
SECTOR_MAP = {
    "sous-bois": "Sous-bois",
    "sousbois": "Sous-bois",
    "champignon": "Champignon",
    "elephant": "Éléphant",
    "éléphant": "Éléphant",
    "podium": "Podium",
    "high-board": "High-board",
    "highboard": "High-board",
    "high board": "High-board",
    "bibliotheque": "Bibliothèque",
    "bibliothèque": "Bibliothèque",
    "backstage": "Backstage",
    "bigwall": "Bigwall",
    "big wall": "Bigwall",
    "massif central": "Massif central",
    "massif-central": "Massif central",
    "massifcentral": "Massif central",
    "lego": "Lego",
    "zenith": "Zenith",
}


def extract_sector(text):
    """Extrait le secteur depuis le texte"""
    if not text:
        return "Zenith"  # Default
    text_lower = text.lower().strip()
    for key, value in SECTOR_MAP.items():
        if key in text_lower:
            return value
    return "Zenith"  # Default si non trouve


def extract_route_types(text):
    if not text:
        return []
    types = []
    text_lower = text.lower()
    for key, value in ROUTE_TYPES_MAP.items():
        if key in text_lower and value not in types:
            types.append(value)
    return types


def scrape_card_details(driver, card, bloc_num):
    """Clique sur une carte et recupere les details"""
    details = {"openedAt": None, "routeTypes": [], "openerName": None, "mainPhoto": None, "sector": None}

    try:
        # Scroll et clic sur la carte
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", card)
        time.sleep(0.3)
        card.click()
        time.sleep(2)  # Attendre que le detail s'ouvre

        # Chercher la photo dans card-image-Div
        try:
            img_div = driver.find_element(By.CSS_SELECTOR, "[class*='card-image-Div']")
            img = img_div.find_element(By.TAG_NAME, "img")
            details["mainPhoto"] = img.get_attribute("src")
        except:
            pass

        # Chercher les infos dans card-info (class contenant "card-info")
        try:
            # Attendre l'element card-info
            WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "[class*='card-info']"))
            )
            info_elements = driver.find_elements(By.CSS_SELECTOR, "[class*='card-info']")
            all_text = ""
            for el in info_elements:
                text = el.text.strip()
                if text:
                    all_text += " " + text
                    # Extraire la date (format ISO)
                    if not details["openedAt"]:
                        date = parse_date(text)
                        if date:
                            details["openedAt"] = date
                    # Extraire le nom de l'ouvreur
                    if not details["openerName"]:
                        opener = extract_opener_name(text)
                        if opener:
                            details["openerName"] = opener
                    # Extraire les hashtags
                    hashtags = extract_hashtags(text)
                    if hashtags:
                        details["routeTypes"].extend(hashtags)

            # Dedupliquer les types
            details["routeTypes"] = list(set(details["routeTypes"]))

        except Exception as e:
            print(f"      [!] Pas de card-info: {str(e)[:40]}")

        # Chercher le secteur dans la page (aria-label de mapIconContainer ou texte)
        try:
            # Chercher dans les elements avec class contenant "map" ou "sector"
            sector_el = driver.find_element(By.CSS_SELECTOR, "[class*='mapIconContainer']")
            sector_text = sector_el.get_attribute("aria-label") or ""
            details["sector"] = extract_sector(sector_text)
        except:
            pass

        # Fermer en utilisant back()
        driver.back()
        time.sleep(1)

        # Re-attendre que la page soit chargee
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "[class*='cardHeader-boulderNum']"))
        )

    except Exception as e:
        print(f"      [!] Erreur: {str(e)[:60]}")
        try:
            driver.back()
            time.sleep(1)
        except:
            pass

    return details


def test_scraping(driver):
    """Test sur 3 cartes pour verifier qu'on recupere bien les infos"""
    print("\n[TEST] Test sur 3 cartes...")

    cards = driver.find_elements(By.CSS_SELECTOR, "[class*='card-card']")[:3]

    for i, card in enumerate(cards):
        try:
            bloc_num_el = card.find_element(By.CSS_SELECTOR, "[class*='cardHeader-boulderNum']")
            bloc_num = bloc_num_el.text.strip()

            # Infos de base
            difficulty = "?"
            try:
                label = card.find_element(By.CSS_SELECTOR, "[class*='cardHeader-label']")
                difficulty = label.get_attribute("aria-label") or "?"
            except:
                pass

            hold_color = "?"
            try:
                circle = card.find_element(By.CSS_SELECTOR, "[class*='cardHeader-circleContainer']")
                hold_color = circle.get_attribute("aria-label") or "?"
            except:
                pass

            print(f"\n   Carte {i+1} - Bloc {bloc_num}")
            print(f"   - Niveau: {difficulty}")
            print(f"   - Prises: {hold_color}")

            # Cliquer pour details
            details = scrape_card_details(driver, card, bloc_num)
            print(f"   - Date: {details.get('openedAt', 'NON')}")
            print(f"   - Ouvreur: {details.get('openerName', 'NON')}")
            print(f"   - Types: {details.get('routeTypes', [])}")

            # Recharger les cartes apres back()
            cards = driver.find_elements(By.CSS_SELECTOR, "[class*='card-card']")

        except Exception as e:
            print(f"   [!] Erreur carte {i+1}: {e}")

    return True


def scrape_all_blocs(driver):
    """Scrape tous les blocs"""
    blocs = {}
    processed = set()

    print("\n[SCRAPE] Scraping de tous les blocs...")

    scroll_pos = 0
    max_scroll = 50000
    no_new = 0

    while scroll_pos < max_scroll and no_new < 15:
        cards = driver.find_elements(By.CSS_SELECTOR, "[class*='card-card']")
        found_new = False

        for card in cards:
            try:
                bloc_num_el = card.find_element(By.CSS_SELECTOR, "[class*='cardHeader-boulderNum']")
                bloc_text = bloc_num_el.text.strip()
                if not bloc_text:
                    continue

                match = re.search(r'(\d+)', bloc_text)
                if not match:
                    continue

                bloc_num = int(match.group(1))
                if bloc_num in processed:
                    continue

                processed.add(bloc_num)
                found_new = True

                # Infos de base
                hold_color = {"hex": "#6b7280", "category": "grey"}
                try:
                    circle = card.find_element(By.CSS_SELECTOR, "[class*='cardHeader-circleContainer']")
                    hold_color = find_hold_color(circle.get_attribute("aria-label") or "")
                except:
                    pass

                difficulty = DIFFICULTY_MAP["gray"]
                try:
                    label = card.find_element(By.CSS_SELECTOR, "[class*='cardHeader-label']")
                    difficulty = find_difficulty(label.get_attribute("aria-label") or "")
                except:
                    pass

                # Details (clic) - recupere photo, secteur, date, ouvreur, types
                details = scrape_card_details(driver, card, bloc_num)

                # Photo de fallback si pas trouvee dans le detail
                main_photo = details.get("mainPhoto")
                if not main_photo:
                    try:
                        img = card.find_element(By.CSS_SELECTOR, "img[src*='socialboulder']")
                        main_photo = img.get_attribute("src")
                    except:
                        pass

                blocs[bloc_num] = {
                    "number": bloc_num,
                    "name": f"Bloc {bloc_num}",
                    "difficulty": difficulty["name"],
                    "holdColorHex": hold_color["hex"],
                    "holdColorCategory": hold_color["category"],
                    "mainPhoto": main_photo,
                    "sector": details.get("sector") or "Zenith",
                    "routeTypes": details.get("routeTypes", []),
                    "openedAt": details.get("openedAt") or datetime.now().strftime("%Y-%m-%d"),
                    "openerName": details.get("openerName"),
                }

                date_str = details.get("openedAt") or "aujourd'hui"
                opener_str = details.get("openerName") or "?"
                sector_str = details.get("sector") or "Zenith"
                print(f"   [+] Bloc {bloc_num}: {difficulty['name']}, {sector_str}, {opener_str}, {date_str}")

                # Recharger les cartes
                cards = driver.find_elements(By.CSS_SELECTOR, "[class*='card-card']")

            except Exception as e:
                continue

        if not found_new:
            no_new += 1
        else:
            no_new = 0

        scroll_pos += 400
        driver.execute_script(f"window.scrollTo(0, {scroll_pos});")
        time.sleep(0.5)

        if scroll_pos % 4000 == 0:
            print(f"   [SCROLL] {scroll_pos}px, {len(blocs)} blocs")

    return blocs


def generate_sql(blocs):
    all_blocs = sorted(blocs.values(), key=lambda x: x["number"])
    placeholder = "https://socialboulder.s3-eu-west-1.amazonaws.com/800/bouldersPics/joa5yFWESd2bfGe47.jpg"

    # Mapping pour corriger les difficultés vers les valeurs enum valides
    difficulty_fix = {
        "Bleu": "Bleu foncé",
        "Bleu fonce": "Bleu foncé",
    }

    sql = f"-- Blocs Zenith - {datetime.now().isoformat()}\n-- Total: {len(all_blocs)}\n\nBEGIN;\n\n"

    for b in all_blocs:
        if b["number"] == 16:
            sql += "-- Bloc 16 existe deja\n\n"
            continue

        photo = (b.get("mainPhoto") or placeholder).replace("'", "''")
        types = json.dumps(b.get("routeTypes", []))

        # Corriger la difficulté
        difficulty = b["difficulty"]
        if difficulty in difficulty_fix:
            difficulty = difficulty_fix[difficulty]

        # Corriger holdColorCategory: 'gray' -> 'grey'
        hold_category = b["holdColorCategory"]
        if hold_category == "gray":
            hold_category = "grey"

        sector = b.get("sector", "Zenith")

        sql += f"""INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc {b["number"]}', '{difficulty}', '{b["holdColorHex"]}', '{hold_category}', '{sector}', '{types}'::jsonb, 'Bloc {b["number"]}', '', '{OPENER_ID}', '{photo}', 'ACTIVE', '{b["openedAt"]}', NOW(), NOW());

"""

    sql += "COMMIT;\n"
    return sql


def main():
    print("=" * 60)
    print("   SCRAPER SBOULDER.COM - HUECO ZENITH")
    print("=" * 60)

    driver = None
    try:
        print("\n[START] Demarrage...")
        driver = setup_driver()

        print(f"[PAGE] Chargement {BASE_URL}...")
        driver.get(BASE_URL)
        time.sleep(5)

        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "[class*='cardHeader-boulderNum']"))
        )

        # Test d'abord
        test_scraping(driver)

        # Mode test seulement par defaut
        import sys
        if len(sys.argv) < 2 or sys.argv[1] != "--full":
            print("\n" + "=" * 60)
            print("Mode test termine. Utilisez --full pour scraper tous les blocs.")
            return

        # Recharger la page
        driver.get(BASE_URL)
        time.sleep(5)

        # Scrape complet
        blocs = scrape_all_blocs(driver)
        print(f"\n[STATS] {len(blocs)} blocs scrapes")

        if blocs:
            all_blocs = sorted(blocs.values(), key=lambda x: x["number"])

            with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
                json.dump({"scrapedAt": datetime.now().isoformat(), "blocs": all_blocs}, f, indent=2, ensure_ascii=False)
            print(f"[OK] JSON: {OUTPUT_JSON}")

            sql = generate_sql(blocs)
            with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
                f.write(sql)
            print(f"[OK] SQL: {OUTPUT_SQL}")

            with_date = sum(1 for b in all_blocs if b["openedAt"] != datetime.now().strftime("%Y-%m-%d"))
            print(f"\n   Blocs avec date: {with_date}/{len(all_blocs)}")

    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback
        traceback.print_exc()

    finally:
        if driver:
            print("\n[CLOSE] Fermeture...")
            driver.quit()


if __name__ == "__main__":
    main()
