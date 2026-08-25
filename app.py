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

TRANSLATIONS: Dict[str, Dict[str, str]] = {
    "uz": {
        "brand_title": "Portfolio",
        "brand_ext": ".dev",
        "nav_projects": "Loyihalar",
        "nav_skills": "Ko'nikmalar",
        "nav_contact": "Bog'lanish",
        "hero_tagline": "⚡ Tizimlar • 3D Grafika • Backend",
        "hero_title_1": "Masshtablanuvchi",
        "hero_title_accent_1": "Backend",
        "hero_title_2": "va Real-Vaqt",
        "hero_title_accent_2": "3D Grafika",
        "hero_desc": "Python yordamida yuqori tezlikdagi veb-servislar, 3D matematik modellashtirish, protsedurali renderlash va zamonaviy arxitektura yechimlari.",
        "btn_projects": "Loyihalarni ko'rish",
        "btn_contact": "Bog'lanish",
        "projects_heading": "Tanlangan Loyihalar",
        "projects_sub": "3D hisoblash grafikasi, mikroxizmatlar va backend dvigatellari bo'yicha ishlar",
        "skills_heading": "Asosiy Ko'nikmalar",
        "skills_sub": "Backend arxitekturasi va 3D matematik modellashtirishdagi texnologiyalar",
        "contact_heading": "Aloqaga Chiqish",
        "contact_sub": "Hamkorlik, loyihalar yoki savollar bo'yicha to'g'ridan-to'g'ri xabar yuboring",
        "form_name": "Ismingiz",
        "form_email": "Elektron pochta",
        "form_message": "Xabar matni",
        "form_submit": "Xabarni yuborish",
        "source_code": "Kod &rarr;",
        "live_demo": "Jonli Demo &rarr;",
        "footer_text": "© 2026 Python, Flask va SCSS yordamida yaratildi. WebGL bilan tezlashtirilgan."
    },
    "en": {
        "brand_title": "Portfolio",
        "brand_ext": ".dev",
        "nav_projects": "Projects",
        "nav_skills": "Skills",
        "nav_contact": "Contact",
        "hero_tagline": "⚡ Systems • 3D Graphics • Backend",
        "hero_title_1": "Building Scalable",
        "hero_title_accent_1": "Backends",
        "hero_title_2": "& Real-Time",
        "hero_title_accent_2": "3D Graphics",
        "hero_desc": "Specializing in high-performance Python web services, computational 3D geometry, procedural mesh rendering, and modern backend architectures.",
        "btn_projects": "Explore Projects",
        "btn_contact": "Get in Touch",
        "projects_heading": "Featured Projects",
        "projects_sub": "Selected work across computational 3D graphics, algorithms, and backend systems",
        "skills_heading": "Core Competencies",
        "skills_sub": "Continuous learning trajectory across backend architectures and mathematical modeling",
        "contact_heading": "Get In Touch",
        "contact_sub": "Interested in collaborating or have a question? Leave a message below.",
        "form_name": "Your Name",
        "form_email": "Email Address",
        "form_message": "Your Message",
        "form_submit": "Transmit Message",
        "source_code": "Source &rarr;",
        "live_demo": "Live Demo &rarr;",
        "footer_text": "© 2026 Crafted with Python, Flask & SCSS. Accelerated with WebGL."
    }
}

PROJECTS_DATA: Dict[str, List[Project]] = {
    "uz": [
        {
            "id": "py-3d-renderer",
            "title": "Software 3D Rasterizator",
            "category": "3D Grafika",
            "tech": ["Python", "NumPy", "Pygame", "Linear Algebra"],
            "summary": "Proyeksion matritsalar, perspektiva hisoblash va z-buffer algoritmini noldan amalga oshiruvchi CPU-asosli 3D renderlash tizimi.",
            "github": "https://github.com",
            "live_demo": "#"
        },
        {
            "id": "flask-mesh-api",
            "title": "Parametrik 3D Mesh Generatsiya API",
            "category": "Backend",
            "tech": ["Flask", "PostgreSQL", "Redis", "Docker"],
            "summary": "3D protsedurali shakllarni (torus, fraktallar, relyeflar) hisoblab, OBJ/GLTF formatida uzatuvchi yuqori tezlikdagi REST API.",
            "github": "https://github.com",
            "live_demo": "#"
        },
        {
            "id": "realtime-websocket-engine",
            "title": "Real-vaqt Simulyatsiya Dvigateli",
            "category": "Full-Stack / Tizimlar",
            "tech": ["Python", "WebSockets", "Three.js", "SCSS"],
            "summary": "Fizik harakat va zarrachalar simulyatsiyasini WebSockets orqali 60Hz chastotada brauzerga uzatuvchi dvigatel.",
            "github": "https://github.com",
            "live_demo": "#"
        }
    ],
    "en": [
        {
            "id": "py-3d-renderer",
            "title": "Software 3D Rasterizer",
            "category": "3D Graphics",
            "tech": ["Python", "NumPy", "Pygame", "Linear Algebra"],
            "summary": "Custom CPU-based wireframe and raster renderer implementing projection matrices, perspective division, and z-buffering from scratch.",
            "github": "https://github.com",
            "live_demo": "#"
        },
        {
            "id": "flask-mesh-api",
            "title": "Parametric Mesh Generation API",
            "category": "Backend",
            "tech": ["Flask", "PostgreSQL", "Redis", "Docker"],
            "summary": "High-throughput REST API computing 3D procedural meshes (torus, fractals, terrain) on demand and returning serialized OBJ/GLTF buffers.",
            "github": "https://github.com",
            "live_demo": "#"
        },
        {
            "id": "realtime-websocket-engine",
            "title": "Real-time Simulation Engine",
            "category": "Full-Stack / Systems",
            "tech": ["Python", "WebSockets", "Three.js", "SCSS"],
            "summary": "Physics and particle engine broadcasting rigid-body transform updates at 60Hz to web clients.",
            "github": "https://github.com",
            "live_demo": "#"
        }
    ]
}

SKILLS_DATA: Dict[str, Dict[str, List[SkillItem]]] = {
    "uz": {
        "Backend va Arxitektura": [
            {"name": "Python 3 / Flask / FastAPI", "level": 85},
            {"name": "PostgreSQL va SQL Optimizatsiya", "level": 78},
            {"name": "RESTful API va Mikroxizmatlar", "level": 82},
            {"name": "Redis va Kesh strategiyalari", "level": 70},
        ],
        "3D Matematika va Grafika": [
            {"name": "3D Geometriya & Chiziqli Algebra", "level": 80},
            {"name": "Three.js va WebGL Renderlash", "level": 72},
            {"name": "3D Mesh yaratish & OBJ/GLTF", "level": 68},
            {"name": "PyOpenGL va Matritsa Transformatsiyalari", "level": 65},
        ],
        "Frontend va Ish Qurollari": [
            {"name": "SCSS / Moslashuvchan Dizayn", "level": 88},
            {"name": "Git va CI/CD", "level": 80},
            {"name": "Linux / Arch Linux Muhiti", "level": 85},
            {"name": "Docker Konteynerizatsiyasi", "level": 74},
        ]
    },
    "en": {
        "Backend & Architecture": [
            {"name": "Python 3 / Flask / FastAPI", "level": 85},
            {"name": "PostgreSQL & Query Optimization", "level": 78},
            {"name": "RESTful API & Microservices", "level": 82},
            {"name": "Redis & Caching Strategies", "level": 70},
        ],
        "3D Math & Graphics": [
            {"name": "3D Geometry & Linear Algebra", "level": 80},
            {"name": "Three.js & WebGL Shaders", "level": 72},
            {"name": "Mesh Generation & OBJ/GLTF Parsing", "level": 68},
            {"name": "PyOpenGL & Matrix Transformations", "level": 65},
        ],
        "Frontend & Tooling": [
            {"name": "SCSS / Modern Responsive CSS", "level": 88},
            {"name": "Git & CI/CD Pipelines", "level": 80},
            {"name": "Linux / Arch Linux Environment", "level": 85},
            {"name": "Docker Containerization", "level": 74},
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