import os
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import TypedDict, List, Dict, Any
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask.typing import ResponseReturnValue

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

MY_EMAIL = "user.doner2006@gmail.com"
AUTHOR_NAME = "Ulug'bekov Shohjahon"

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
        "brand_title": "",
        "brand_ext": "SPACE",
        "nav_about": "Haqimda",
        "nav_projects": "Loyihalar",
        "nav_skills": "Ko'nikmalar",
        "nav_contact": "Bog'lanish",
        
        "hero_tagline": f"🚀 AKHU Talabasi • {AUTHOR_NAME} • Gamer",
        "hero_title_1": "Kosmik",
        "hero_title_accent_1": "Frontend & Backend",
        "hero_title_2": "va Interaktiv",
        "hero_title_accent_2": "3D Olam",
        "hero_desc": f"Men {AUTHOR_NAME}, Al-Xorazmiy universiteti (AKHU) talabasiman. Veb-dasturlash (Frontend 75%), Python backend arxitekturasi, Windows optimizatsiyasi va Three.js/3D kosmik modellashtirish bilan shug'ullanaman.",
        "btn_projects": "Loyihalarni ko'rish",
        "btn_contact": "Bog'lanish",

        "about_heading": "Men Haqimda",
        "about_sub": "Dasturlash sarguzashtlarim, tizim optimizatsiyasi va geyming qiziqishlarim",
        "about_p1": f"Men {AUTHOR_NAME}, Al-Xorazmiy nomidagi universitetda (AKHU) dasturiy injiniring bo'yicha tahsil olyapman. SCSS, JavaScript va zamonaviy UI arxitekturasi bilan bir qatorda Python va Flask orqali tezkor va mustahkam backend tizimlarni yaratmoqdaman.",
        "about_p2": "Dasturlashdan tashqari Windows va Linux operatsion tizimlarini chuqur optimizatsiya qilish, past kechikishli (low-latency) tizim sozlamalarini yaratishga qiziqaman. Bo'sh vaqtimda sevimli o'yinlarimni o'ynayman.",
        "gamer_title": "Geyming & Tizim Qiziqishlari:",
        
        "projects_heading": "Amaliy Loyihalarim",
        "projects_sub": "O'rganish va amaliyot davomida yaratgan loyihalarim",
        
        "skills_heading": "Texnologiyalar & Ko'nikmalar",
        "skills_sub": "Hozirgi amaliy bilim va tajriba darajalarim",
        
        "contact_heading": "Aloqaga Chiqish",
        "contact_sub": "Hamkorlik, taklif yoki loyihalar bo'lsa, xabar qoldiring",
        "contact_email_label": "Elektron pochta:",
        "copy_email_btn": "Nusxalash",
        "copied_text": "Nusxalandi!",
        "form_name": "Ismingiz",
        "form_email": "Sizning emailingiz",
        "form_message": "Xabar matni",
        "form_submit": "Xabarni yuborish",
        "source_code": "GitHub &rarr;",
        "live_demo": "Jonli Demo &rarr;",
        "footer_text": f"© 2026 {AUTHOR_NAME} • {MY_EMAIL} • AKHU Student Space Portfolio."
    },
    "ru": {
        "brand_title": "",
        "brand_ext": "SPACE",
        "nav_about": "Обо мне",
        "nav_projects": "Проекты",
        "nav_skills": "Навыки",
        "nav_contact": "Контакты",
        
        "hero_tagline": f"🚀 Студент AKHU • {AUTHOR_NAME} • Геймер",
        "hero_title_1": "Космический",
        "hero_title_accent_1": "Frontend & Backend",
        "hero_title_2": "и 3D",
        "hero_title_accent_2": "Вселенная",
        "hero_desc": f"Меня зовут {AUTHOR_NAME}, студент Университета Аль-Хорезми (AKHU). Разрабатываю Frontend (75%), Python backend сервисы, оптимизирую Windows и создаю 3D графику.",
        "btn_projects": "Смотреть проекты",
        "btn_contact": "Связаться",

        "about_heading": "Обо мне",
        "about_sub": "Мой путь в инженерии, системная оптимизация и мир игр",
        "about_p1": f"Я {AUTHOR_NAME}, обучаюсь программной инженерии в Университете Аль-Хорезми (AKHU). Создаю эстетичные веб-интерфейсы на HTML/SCSS/JavaScript и высокопроизводительные веб-сервисы на Python и Flask.",
        "about_p2": "Помимо веб-разработки, увлекаюсь тонким твикингом и оптимизацией Windows/Linux (low-latency). В свободное время погружаюсь в атмосферные игры и стратегические задачи.",
        "gamer_title": "Игры и Системный фокус:",
        
        "projects_heading": "Избранные Проекты",
        "projects_sub": "Практические проекты, созданные в процессе обучения",
        
        "skills_heading": "Навыки и Технологии",
        "skills_sub": "Текущий уровень владения технологиями и инструментами",
        
        "contact_heading": "Связаться со мной",
        "contact_sub": "Буду рад интересным проектам, предложениям и сотрудничеству",
        "contact_email_label": "Электронная почта:",
        "copy_email_btn": "Скопировать",
        "copied_text": "Скопировано!",
        "form_name": "Ваше имя",
        "form_email": "Ваш Email",
        "form_message": "Ваше сообщение",
        "form_submit": "Отправить сообщение",
        "source_code": "GitHub &rarr;",
        "live_demo": "Демо &rarr;",
        "footer_text": f"© 2026 {AUTHOR_NAME} • {MY_EMAIL} • AKHU Student Space Portfolio."
    },
    "en": {
        "brand_title": "",
        "brand_ext": "SPACE",
        "nav_about": "About",
        "nav_projects": "Projects",
        "nav_skills": "Skills",
        "nav_contact": "Contact",
        
        "hero_tagline": f"🚀 AKHU Student • {AUTHOR_NAME} • Gamer",
        "hero_title_1": "Cosmic",
        "hero_title_accent_1": "Frontend & Backend",
        "hero_title_2": "& Interactive",
        "hero_title_accent_2": "3D Universe",
        "hero_desc": f"I am {AUTHOR_NAME}, Software Engineering student at Al-Khwarizmi University (AKHU). Passionate about Frontend Development (75%), Python backend architectures, Windows system optimization, and 3D modeling.",
        "btn_projects": "Explore Projects",
        "btn_contact": "Get in Touch",

        "about_heading": "About Me",
        "about_sub": "My engineering journey, system optimization passions, and gaming world",
        "about_p1": f"I am {AUTHOR_NAME}, currently studying Software Engineering at Al-Khwarizmi University (AKHU). I build clean, high-performance web interfaces with HTML/SCSS/JS alongside robust Python and Flask backend services.",
        "about_p2": "Beyond web development, I am passionate about Windows low-latency optimization, OS debloating, and Linux environments. In my free time, I dive into immersive gaming.",
        "gamer_title": "Gaming & System Focus:",
        
        "projects_heading": "Featured Projects",
        "projects_sub": "Practical applications built throughout my engineering path",
        
        "skills_heading": "Skills & Technologies",
        "skills_sub": "Current proficiency breakdown across development and systems",
        
        "contact_heading": "Get In Touch",
        "contact_sub": "Feel free to reach out for collaboration or inquiries",
        "contact_email_label": "Email Address:",
        "copy_email_btn": "Copy",
        "copied_text": "Copied!",
        "form_name": "Your Name",
        "form_email": "Your Email Address",
        "form_message": "Your Message",
        "form_submit": "Transmit Message",
        "source_code": "GitHub &rarr;",
        "live_demo": "Live Demo &rarr;",
        "footer_text": f"© 2026 {AUTHOR_NAME} • {MY_EMAIL} • AKHU Student Space Portfolio."
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
            "github": "https://github.com/Doner01/flask_learning",
            "live_demo": "#"
        },
        {
            "id": "user-list",
            "title": "User-List Boshqaruv Tizimi",
            "category": "Full-Stack",
            "tech": ["Python", "Flask", "JavaScript", "SCSS"],
            "summary": "Foydalanuvchilarni qo'shish, filtrlash, tahrirlash va ma'lumotlar oqimini tartibga soluvchi to'liq CRUD veb-ilovasi.",
            "github": "https://github.com/Doner01/user_list",
            "live_demo": "#"
        },
        {
            "id": "youtube-project",
            "title": "YouTube Media Platforma & UI",
            "category": "Frontend",
            "tech": ["HTML5", "SCSS", "JavaScript", "Responsive UI"],
            "summary": "YouTube interfeysiga asoslangan, moslashuvchan video pleyer, to'rsimon (grid) katalog va zamonaviy kosmik dark-theme dizayni.",
            "github": "https://github.com/Doner01/youtube",
            "live_demo": "#"
        }
    ],
    "ru": [
        {
            "id": "flask-learning",
            "title": "Архитектура Flask Backend & Sandbox",
            "category": "Backend",
            "tech": ["Python", "Flask", "Jinja2", "SQLite", "SCSS"],
            "summary": "Серверная песочница, включающая маршрутизацию URL, шаблонизацию Jinja2, управление сессиями и CRUD операции с БД.",
            "github": "https://github.com/Doner01/flask_learning",
            "live_demo": "#"
        },
        {
            "id": "user-list",
            "title": "Система Управления User-List",
            "category": "Full-Stack",
            "tech": ["Python", "Flask", "JavaScript", "SCSS"],
            "summary": "Интерактивное веб-приложение для добавления, фильтрации, редактирования пользователей и структурирования данных.",
            "github": "https://github.com/Doner01/user_list",
            "live_demo": "#"
        },
        {
            "id": "youtube-project",
            "title": "Медиа-Платформа YouTube UI",
            "category": "Frontend",
            "tech": ["HTML5", "SCSS", "JavaScript", "Responsive UI"],
            "summary": "Адаптивный медиа-интерфейс в стиле YouTube с кастомными видеокомпонентами и оптимизированным дизайном.",
            "github": "https://github.com/Doner01/youtube",
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
            "github": "https://github.com/Doner01/flask_learning",
            "live_demo": "#"
        },
        {
            "id": "user-list",
            "title": "User-List Management Platform",
            "category": "Full-Stack",
            "tech": ["Python", "Flask", "JavaScript", "SCSS"],
            "summary": "Interactive user management application supporting full CRUD operations, live search filtering, and clean data modeling.",
            "github": "https://github.com/Doner01/user_list",
            "live_demo": "#"
        },
        {
            "id": "youtube-project",
            "title": "YouTube Media Interface & Player",
            "category": "Frontend",
            "tech": ["HTML5", "SCSS", "JavaScript", "Responsive UI"],
            "summary": "Responsive media layout inspired by YouTube, featuring custom video components, dynamic sidebar, and optimized styling.",
            "github": "https://github.com/Doner01/youtube",
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
    "ru": {
        "Frontend и Веб-дизайн": [
            {"name": "Frontend разработка (HTML/CSS/SCSS)", "level": 75},
            {"name": "Адаптивный дизайн (Mobile-First)", "level": 75},
            {"name": "JavaScript (ES6+)", "level": 45},
            {"name": "Основы TypeScript", "level": 35},
        ],
        "Backend и 3D Графика": [
            {"name": "Программирование на Python", "level": 55},
            {"name": "Фреймворк Flask & REST API", "level": 55},
            {"name": "3D Моделирование (Базовые объекты)", "level": 30},
        ],
        "Системы и Оптимизация": [
            {"name": "Оптимизация и твикинг Windows", "level": 85},
            {"name": "Linux (Arch / Ubuntu) и macOS", "level": 80},
            {"name": "Контроль версий Git & GitHub", "level": 60},
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
    if lang_code in ["uz", "ru", "en"]:
        session["lang"] = lang_code
    return redirect(request.referrer or url_for("index"))

@app.route("/")
def index() -> ResponseReturnValue:
    lang: str = str(session.get("lang", "uz"))
    t: Dict[str, str] = TRANSLATIONS.get(lang, TRANSLATIONS["uz"])
    projects: List[Project] = PROJECTS_DATA.get(lang, PROJECTS_DATA["uz"])
    skills: Dict[str, List[SkillItem]] = SKILLS_DATA.get(lang, SKILLS_DATA["uz"])
    
    return render_template(
        "index.html",
        t=t,
        current_lang=lang,
        my_email=MY_EMAIL,
        projects=projects,
        skills=skills,
        translations_json=json.dumps(TRANSLATIONS),
        projects_json=json.dumps(PROJECTS_DATA),
        skills_json=json.dumps(SKILLS_DATA)
    )

@app.route("/api/contact", methods=["POST"])
def contact() -> ResponseReturnValue:
    data: Dict[str, Any] = request.get_json(silent=True) or {}
    name: str = str(data.get("name", "")).strip()
    sender_email: str = str(data.get("email", "")).strip()
    message: str = str(data.get("message", "")).strip()

    lang: str = str(session.get("lang", "uz"))
    if not name or not sender_email or not message:
        err_msgs = {
            "uz": "Barcha maydonlarni to'ldiring.",
            "ru": "Пожалуйста, заполните все поля.",
            "en": "All fields are required."
        }
        return jsonify({"status": "error", "message": err_msgs.get(lang, err_msgs["uz"])}), 400

    smtp_user = os.getenv("GMAIL_USER", MY_EMAIL)
    smtp_pass = os.getenv("GMAIL_APP_PASSWORD")

    if smtp_pass:
        try:
            msg = MIMEMultipart()
            msg["From"] = smtp_user
            msg["To"] = MY_EMAIL
            msg["Subject"] = f"🚀 Portfolio Yangi Xabar: {name}"
            
            body_content = f"Ism: {name}\nEmail: {sender_email}\n\nXabar:\n{message}"
            msg.attach(MIMEText(body_content, "plain", "utf-8"))

            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(smtp_user, smtp_pass)
                server.send_message(msg)
        except Exception as e:
            print(f"Gmail SMTP error: {e}")

    ok_msgs = {
        "uz": f"Rahmat {name}, xabaringiz {MY_EMAIL} ga yetkazildi!",
        "ru": f"Спасибо, {name}! Ваше сообщение отправлено на {MY_EMAIL}.",
        "en": f"Thank you {name}, your message has been sent to {MY_EMAIL}!"
    }
    return jsonify({"status": "success", "message": ok_msgs.get(lang, ok_msgs["uz"])})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)