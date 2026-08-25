from typing import TypedDict, List, Dict, Any
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask.typing import ResponseReturnValue

app = Flask(__name__)
app.config["SECRET_KEY"] = "dev-secret-key-change-in-production"

class Project(TypedDict):
    id: str
    title: str
    category: str
    tech: List[str]
    summary: str
    github: str
    live_demo: str

class SkillItem(TypedDict):
    name: str
    level: int

# Saytdagi barcha matnlar (O'zbekcha / Inglizcha)
TRANSLATIONS: Dict[str, Dict[str, str]] = {
    "uz": {
        "brand_title": "Shohjahon",
        "brand_ext": ".dev",
        "nav_about": "Haqimda",
        "nav_projects": "Loyihalar",
        "nav_skills": "Ko'nikmalar",
        "nav_contact": "Bog'lanish",
        
        # Hero
        "hero_tagline": "⚡ AKHU Talabasi • Frontend & Python Backend • Gamer",
        "hero_title_1": "Zamonaviy",
        "hero_title_accent_1": "Frontend & Backend",
        "hero_title_2": "va Interaktiv",
        "hero_title_accent_2": "3D Dunyo",
        "hero_desc": "Al-Xorazmiy universiteti (AKHU) talabasiman. Veb-dasturlash (Frontend 75%), Python backend, Windows tizim optimizatsiyasi va boshlang'ich 3D modellashtirish bilan shug'ullanaman.",
        "btn_projects": "Loyihalarni ko'rish",
        "btn_contact": "Bog'lanish",

        # About / Qiziqishlar
        "about_heading": "Men Haqimda",
        "about_sub": "Dasturlash, tizim optimizatsiyasi va geyming qiziqishlarim",
        "about_p1": "Hozirda Al-Xorazmiy nomidagi universitetda (AKHU) dasturiy injiniring yo'nalishida tahsil olyapman. Vebning vizual qismi (HTML/SCSS/JS) bilan bir qatorda Python va Flask orqali mustahkam backend tizimlarni qurishni o'rganmoqdaman.",
        "about_p2": "Dasturlashdan tashqari Windows va Linux operatsion tizimlarini chuqur optimizatsiya qilish, past kechikishli (low-latency) tizim sozlamalarini yaratishga qiziqaman. Bo'sh vaqtimda sevimli o'yinlarimni o'ynayman.",
        "gamer_title": "Geyming & Tizim Qiziqishlari:",
        
        # Loyihalar
        "projects_heading": "Amaliy Loyihalarim",
        "projects_sub": "O'rganish va amaliyot davomida yaratgan loyihalarim",
        "filter_all": "Barchasi",
        
        # Ko'nikmalar
        "skills_heading": "Texnologiyalar & Ko'nikmalar",
        "skills_sub": "Hozirgi amaliy bilim va tajriba darajalarim",
        
        # Aloqa
        "contact_heading": "Aloqaga Chiqish",
        "contact_sub": "Savollaringiz, taklif yoki loyihalar bo'lsa, xabar qoldiring",
        "form_name": "Ismingiz",
        "form_email": "Elektron pochta",
        "form_message": "Xabar matni",
        "form_submit": "Xabarni yuborish",
        "source_code": "GitHub &rarr;",
        "live_demo": "Jonli Demo &rarr;",
        "footer_text": "© 2026 Shohjahon • AKHU Student Portfolio. Python, Flask & SCSS yordamida yaratildi."
    },
    "en": {
        "brand_title": "Shohjahon",
        "brand_ext": ".dev",
        "nav_about": "About",
        "nav_projects": "Projects",
        "nav_skills": "Skills",
        "nav_contact": "Contact",
        
        # Hero
        "hero_tagline": "⚡ AKHU Student • Frontend & Python Backend • Gamer",
        "hero_title_1": "Modern",
        "hero_title_accent_1": "Frontend & Backend",
        "hero_title_2": "& Interactive",
        "hero_title_accent_2": "3D Graphics",
        "hero_desc": "Software Engineering student at Al-Khwarizmi University (AKHU). Passionate about Frontend Development (75%), Python backend architectures, Windows system optimization, and 3D modeling.",
        "btn_projects": "Explore Projects",
        "btn_contact": "Get in Touch",

        # About
        "about_heading": "About Me",
        "about_sub": "My engineering journey, system optimization passions, and gaming world",
        "about_p1": "Currently studying at Al-Khwarizmi University (AKHU). I build clean, high-performance web interfaces with HTML/SCSS/JS alongside robust Python and Flask backend services.",
        "about_p2": "Beyond web development, I am passionate about Windows low-latency optimization, OS debloating, and Linux environments. In my free time, I dive into immersive gaming.",
        "gamer_title": "Gaming & System Focus:",
        
        # Projects
        "projects_heading": "Featured Projects",
        "projects_sub": "Practical applications built throughout my engineering path",
        "filter_all": "All",
        
        # Skills
        "skills_heading": "Skills & Technologies",
        "skills_sub": "Current proficiency breakdown across development and systems",
        
        # Contact
        "contact_heading": "Get In Touch",
        "contact_sub": "Feel free to reach out for collaboration or inquiries",
        "form_name": "Your Name",
        "form_email": "Email Address",
        "form_message": "Your Message",
        "form_submit": "Transmit Message",
        "source_code": "GitHub &rarr;",
        "live_demo": "Live Demo &rarr;",
        "footer_text": "© 2026 Shohjahon • AKHU Student Portfolio. Powered by Python, Flask & SCSS."
    }
}

PROJECTS_DATA: Dict[str, List[Project]] = {
    "uz": [
        {
            "id": "flask-learning",
            "title": "Flask Backend & Web Arxitekturasi",
            "category": "Backend",
            "tech": ["Python", "Flask", "Jinja2", "SQLite", "SCSS"],
            "summary": "Marshrutlash (routing), andozalar renderlash, sessiyalar boshqaruvi va ma'lumotlar bazasi bilan ishlashni o'z ichiga olgan to'liq backend tizimi.",
            "github": "https://github.com",
            "live_demo": "#"
        },
        {
            "id": "user-list",
            "title": "User-List Boshqaruv Tizimi",
            "category": "Full-Stack",
            "tech": ["Python", "Flask", "JavaScript", "SCSS"],
            "summary": "Foydalanuvchilarni qo'shish, filtrlash, tahrirlash va ma'lumotlar oqimini tartibga soluvchi to'liq CRUD veb-ilovasi.",
            "github": "https://github.com",
            "live_demo": "#"
        },
        {
            "id": "youtube-project",
            "title": "YouTube Media Platforma & UI",
            "category": "Frontend",
            "tech": ["HTML5", "SCSS", "JavaScript", "Responsive UI"],
            "summary": "YouTube interfeysiga asoslangan, moslashuvchan video pleyer, to'rsimon (grid) katalog va zamonaviy dark-theme dizayni.",
            "github": "https://github.com",
            "live_demo": "#"
        }
    ],
    "en": [
        {
            "id": "flask-learning",
            "title": "Flask Backend Architecture & Sandbox",
            "category": "Backend",
            "tech": ["Python", "Flask", "Jinja2", "SQLite", "SCSS"],
            "summary": "Full-featured backend sandbox covering URL routing, Jinja2 template inheritance, session handling, and database operations.",
            "github": "https://github.com",
            "live_demo": "#"
        },
        {
            "id": "user-list",
            "title": "User-List Management Platform",
            "category": "Full-Stack",
            "tech": ["Python", "Flask", "JavaScript", "SCSS"],
            "summary": "Interactive user management application supporting full CRUD operations, live search filtering, and clean data modeling.",
            "github": "https://github.com",
            "live_demo": "#"
        },
        {
            "id": "youtube-project",
            "title": "YouTube Media Interface & Player",
            "category": "Frontend",
            "tech": ["HTML5", "SCSS", "JavaScript", "Responsive UI"],
            "summary": "Responsive media layout inspired by YouTube, featuring custom video components, dynamic sidebar, and optimized styling.",
            "github": "https://github.com",
            "live_demo": "#"
        }
    ]
}

SKILLS_DATA: Dict[str, Dict[str, List[SkillItem]]] = {
    "uz": {
        "Frontend & Dizayn": [
            {"name": "Frontend Development (HTML/CSS/SCSS)", "level": 75},
            {"name": "Responsive & Mobile-First Dizayn", "level": 75},
            {"name": "JavaScript (ES6+)", "level": 45},
            {"name": "TypeScript Asoslari", "level": 35},
        ],
        "Backend & 3D Dasturlash": [
            {"name": "Python Dasturlash", "level": 55},
            {"name": "Flask Freymvorki & REST API", "level": 55},
            {"name": "3D Modellashtirish & Obyektlar yaratish", "level": 30},
        ],
        "Tizimlar & Optimizatsiya": [
            {"name": "Windows Optimizatsiyasi & Tweak", "level": 85},
            {"name": "Linux (Arch / Ubuntu) & macOS", "level": 80},
            {"name": "Git & GitHub Versiya Nazorati", "level": 60},
        ]
    },
    "en": {
        "Frontend & Web UI": [
            {"name": "Frontend Development (HTML/CSS/SCSS)", "level": 75},
            {"name": "Responsive & Mobile-First Design", "level": 75},
            {"name": "JavaScript (ES6+)", "level": 45},
            {"name": "TypeScript Basics", "level": 35},
        ],
        "Backend & 3D Graphics": [
            {"name": "Python Programming", "level": 55},
            {"name": "Flask Framework & REST API", "level": 55},
            {"name": "3D Modeling & Basic Mesh Creation", "level": 30},
        ],
        "Systems & Optimization": [
            {"name": "Windows Optimization & Tweaking", "level": 85},
            {"name": "Linux (Arch / Ubuntu) & macOS", "level": 80},
            {"name": "Git & GitHub Version Control", "level": 60},
        ]
    }
}

@app.route("/set-lang/<lang_code>")
def set_language(lang_code: str) -> ResponseReturnValue:
    if lang_code in ["uz", "en"]:
        session["lang"] = lang_code
    return redirect(request.referrer or url_for("index"))

@app.route("/")
def index() -> ResponseReturnValue:
    lang: str = str(session.get("lang", "uz"))
    t: Dict[str, str] = TRANSLATIONS.get(lang, TRANSLATIONS["uz"])
    projects: List[Project] = PROJECTS_DATA.get(lang, PROJECTS_DATA["uz"])
    skills: Dict[str, List[SkillItem]] = SKILLS_DATA.get(lang, SKILLS_DATA["uz"])
    
    return render_template("index.html", t=t, current_lang=lang, projects=projects, skills=skills)

@app.route("/api/contact", methods=["POST"])
def contact() -> ResponseReturnValue:
    data: Dict[str, Any] = request.get_json(silent=True) or {}
    name: str = str(data.get("name", "")).strip()
    email: str = str(data.get("email", "")).strip()
    message: str = str(data.get("message", "")).strip()

    lang: str = str(session.get("lang", "uz"))
    if not name or not email or not message:
        err_msg = "Barcha maydonlarni to'ldiring." if lang == "uz" else "All fields are required."
        return jsonify({"status": "error", "message": err_msg}), 400

    ok_msg = f"Rahmat {name}, xabaringiz qabul qilindi!" if lang == "uz" else f"Thank you {name}, message received!"
    return jsonify({"status": "success", "message": ok_msg})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)  