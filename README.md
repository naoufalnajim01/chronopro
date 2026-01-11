# ⏱️ Chrono EPS Pro+

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-3.0-green.svg)](https://github.com/naoufalnajim01/chronopro)
[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://chronopro.connectapps.org)

> **Application web moderne et professionnelle de chronométrage dédiée aux professeurs d'Éducation Physique et Sportive**

Une solution complète et élégante pour gérer tous vos besoins de chronométrage en cours d'EPS : chronomètre avec tours, entraînement fractionné (HIIT/Tabata), technique Pomodoro, et minuteur personnalisé.

![Chrono EPS Pro+ Screenshot](./img/screenshot.png)

## ✨ Fonctionnalités

### 🏃 Chronomètre
- ⏱️ Affichage précis HH:MM:SS.MS
- 🚩 Enregistrement de tours avec tableau détaillé
- 📊 Statistiques automatiques (tour le plus rapide, le plus lent, moyenne)
- 💾 Nom de session personnalisable
- ⏳ Décompte optionnel de 3 secondes avant démarrage

### 🔄 Minuteur d'Intervalle (HIIT/Tabata)
- ⚡ Configuration Travail/Repos en minutes et secondes
- 🔢 Nombre de rounds personnalisable
- 🎨 Anneau de progression visuel avec phases colorées
- 💾 Système de préréglages sauvegardables (localStorage)
- ⏭️ Bouton "Suivant" pour passer à la phase suivante
- 🔊 Alertes sonores entre les phases

### 📝 Mode Devoir
- ⏱️ **Chronomètre Devoir** : Simple HH:MM:SS pour mesurer le temps de travail
- 🕐 **Heure Actuelle** : Affichage en temps réel avec message de motivation

### 🍅 Pomodoro
- 🎯 Technique de productivité Pomodoro
- ⏰ 3 modes prédéfinis : Pomodoro (25m), Pause Courte (5m), Pause Longue (15m)
- 📊 Anneau de progression circulaire
- 💬 Messages de statut dynamiques

### ⏲️ Minuteur Personnalisé
- 🎛️ Configuration libre HH:MM:SS
- 📊 Anneau de progression
- ⏳ Décompte optionnel de 3 secondes
- ✅ Validation avant démarrage

## 🎨 Design & UX

- 🌓 **Mode Sombre/Clair** : Thème adaptatif avec préférence système
- 📱 **Responsive** : Optimisé pour desktop, tablette et mobile
- 🖥️ **Mode Plein Écran** : Affichage géant pour une visibilité maximale
- ⌨️ **Raccourcis Clavier** : Navigation et contrôle rapides
- 🎵 **Feedback Audio** : Sons pour démarrage, arrêt, tours
- ♿ **Accessible** : Attributs ARIA, navigation au clavier
- 🎭 **Animations Fluides** : Transitions et effets modernes

## 🚀 Démo en Ligne

👉 **[chronopro.connectapps.org](https://chronopro.connectapps.org)**

## 💻 Technologies

### Frontend
- **HTML5** - Structure sémantique
- **CSS3** - Design system moderne avec variables CSS
- **JavaScript (Vanilla)** - Logique sans framework
- **Web Audio API** - Gestion des sons
- **localStorage API** - Sauvegarde des préréglages

### Typographie & Icons
- **Inter** - Police principale (Google Fonts)
- **JetBrains Mono** - Police monospace pour les chiffres
- **Font Awesome 6** - Icônes

### Optimisations
- ✅ Compression GZIP
- ✅ Cache navigateur optimisé
- ✅ Headers de sécurité (CSP, X-Frame-Options, etc.)
- ✅ Performance optimale (< 100KB total)

## 📦 Installation

### Option 1 : Téléchargement Direct

```bash
# Cloner le repository
git clone https://github.com/naoufalnajim01/chronopro.git

# Accéder au dossier
cd chronopro

# Ouvrir index.html dans votre navigateur
# Ou utiliser un serveur local (recommandé)
```

### Option 2 : Serveur Local

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server

# Avec PHP
php -S localhost:8000
```

Puis ouvrir : `http://localhost:8000`

## 📁 Structure du Projet

```
chronopro/
├── index.html          # Page principale
├── style.css           # Styles CSS
├── script.js           # Logique JavaScript
├── .htaccess          # Configuration Apache (sécurité & performance)
├── audio/             # Fichiers audio
│   ├── start_beep.mp3
│   └── stop_beep.mp3
├── img/               # Images
│   └── logo.gif
├── README.md          # Documentation
└── LICENSE            # Licence MIT
```

## ⌨️ Raccourcis Clavier

### Globaux
- `T` - Basculer thème clair/sombre
- `G` - Activer/désactiver mode plein écran
- `Esc` - Fermer les guides d'aide

### Chronomètre
- `Espace` - Démarrer/Pause
- `L` - Enregistrer un tour
- `R` - Reset
- `C` - Effacer les tours

### Intervalle
- `Espace` - Démarrer/Pause
- `R` - Reset
- `N` ou `→` - Phase suivante

### Pomodoro
- `Espace` - Démarrer/Pause
- `R` - Reset
- `1-3` - Sélectionner mode (Pomodoro/Pause Courte/Pause Longue)

### Minuteur Personnalisé
- `Espace` - Démarrer/Pause
- `R` - Reset
- `Enter` - Définir la durée

## 🔒 Sécurité

Le fichier `.htaccess` inclut :
- 🛡️ Protection XSS et Clickjacking
- 🔐 Content Security Policy (CSP)
- 🚫 Désactivation du directory listing
- 🔒 Protection des fichiers sensibles
- 📦 Compression GZIP
- ⚡ Cache optimisé

## 🌐 Déploiement

Ce projet peut être déployé sur n'importe quel hébergement web statique :

- **GitHub Pages** - Gratuit et simple
- **Netlify** - Déploiement automatique depuis Git
- **Vercel** - Performance optimale
- **Hébergement Apache/Nginx** - Avec le fichier `.htaccess` fourni

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. 🍴 Fork le projet
2. 🌿 Créer une branche (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. 📤 Push vers la branche (`git push origin feature/AmazingFeature`)
5. 🔃 Ouvrir une Pull Request

## 📝 Changelog

### Version 3.0 (Janvier 2026)
- ✨ Refonte complète du design
- 🎨 Nouveau système de design avec variables CSS
- 🌓 Mode sombre amélioré
- ♿ Accessibilité renforcée (ARIA)
- ⚡ Performance optimisée
- 🔒 Sécurité renforcée
- 📱 Responsive amélioré
- 🎵 Gestion audio optimisée

### Version 2.4
- 🔄 Mode Intervalle avec préréglages
- 📝 Mode Devoir ajouté
- 🍅 Mode Pomodoro intégré

### Version 1.0
- ⏱️ Chronomètre de base
- 🚩 Enregistrement de tours

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Naoufal Najim**
- 💼 LinkedIn: [@naoufalnajim01](https://www.linkedin.com/in/naoufalnajim01/)
- 🐙 GitHub: [@naoufalnajim01](https://github.com/naoufalnajim01)
- 📧 Email: naoufal.najim19@gmail.com

## 🙏 Remerciements

- Font Awesome pour les icônes
- Google Fonts pour les polices
- La communauté open source

---

<div align="center">

**⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile !**

Made with ❤️ by [Naoufal Najim](https://github.com/naoufalnajim01)

</div>
