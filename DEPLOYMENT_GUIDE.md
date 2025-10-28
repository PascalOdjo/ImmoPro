# ImmoPro - Gestion Immobilière

Application web de gestion immobilière avec interface admin et client.

## 🚀 Déploiement sur Netlify

### Fichiers de configuration créés :

1. **`index.html`** - Page d'accueil avec redirection vers l'authentification
2. **`public/_redirects`** - Fichier de redirections Netlify
3. **`netlify.toml`** - Configuration avancée Netlify

### Structure des redirections :

- `/` → Page d'accueil (`index.html`)
- `/login` → Page de connexion
- `/admin` → Dashboard admin
- `/client` → Dashboard client
- `/*` → Page 404 pour les routes non trouvées

### Instructions de déploiement :

1. **Connecter le repository à Netlify**
2. **Configurer le build** :
   - Build command : `echo 'No build step required'`
   - Publish directory : `.` (racine)
3. **Déployer** : Netlify détectera automatiquement les fichiers de configuration

### URLs disponibles après déploiement :

- **Page d'accueil** : `https://votre-site.netlify.app/`
- **Connexion** : `https://votre-site.netlify.app/login`
- **Admin** : `https://votre-site.netlify.app/admin`
- **Client** : `https://votre-site.netlify.app/client`

### Fonctionnalités de la page d'accueil :

- Design moderne avec dégradé de couleurs
- Boutons de connexion et inscription
- Présentation des fonctionnalités principales
- Redirection automatique après 10 secondes
- Responsive design

### Sécurité :

- Headers de sécurité configurés
- Cache optimisé pour les assets statiques
- Gestion des erreurs 404/500

## 📁 Structure du projet

```
/
├── index.html              # Page d'accueil
├── netlify.toml           # Configuration Netlify
├── public/
│   └── _redirects         # Redirections Netlify
├── pages/
│   ├── auth/              # Pages d'authentification
│   ├── admin/             # Pages admin
│   └── client/            # Pages client
├── css/                   # Styles CSS
├── js/                    # Scripts JavaScript
└── assets/                # Images et icônes
```

## 🔧 Configuration locale

Pour tester localement avec les mêmes redirections que Netlify :

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Servir le site localement
netlify dev
```

Le site sera accessible sur `http://localhost:8888` avec toutes les redirections configurées.
