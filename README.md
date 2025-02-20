# Template Next.js

![Next.js Badge](https://img.shields.io/badge/Next.js-v15.1.7-blue)
![Auth.js Badge](https://img.shields.io/badge/Auth.js-v5.0.0-blue)
![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind%20CSS-v3.4.1-blue)
![Prisma Badge](https://img.shields.io/badge/Prisma-v6.4.0-blue)
![License Badge](https://img.shields.io/badge/license-MIT-green)

Un template moderne et sur mesure pour démarrer avec Next.js, Tailwind CSS et Prisma. Ce template inclut une configuration prête à l'emploi pour l'authentification, la gestion de session, la gestion des erreurs, et bien plus encore.

## Fonctionnalités

- Authentification avec NextAuth
- Pages de connexion, inscription, réinitialisation de mot de passe et vérification d'email
- Utilisation de Tailwind CSS pour un design moderne et réactif
- Prisma pour la gestion de la base de données
- Validation des formulaires avec Zod
- Gestion des erreurs avec AlertMessage personnalisées

## Installation

### Cloner le projet

```sh
git clone https://github.com/RitualCoder/nextjs-auth-template.git

cd template-nextjs
```

### Installer les dépendances

```sh
npm install
```

### Copier le fichier .env.example
```sh
cp .env.example .env.local
```

### Commandes intermédiaires

```bash
# Générer les fichiers de configuration pour NextAuth
npx auth

# Pousser le schéma prisma à la base de données
npx prisma db push
```

### Lancer le projet

```sh
npm run dev
```

Le projet sera accessible à l'adresse http://localhost:3000

## Documentation

### Authentification

Ce template inclut la configuration de NextAuth pour gérer l'authentification. Vous pouvez personnaliser les stratégies de connexion et les pages d'authentification.

### Prisma

Le template est configuré avec Prisma pour la gestion des données. Vous pouvez facilement personnaliser le schéma de la base de données en modifiant le fichier prisma/schema.prisma.

## Technologies utilisées

- Next.js pour la gestion de l'interface et du rendu côté serveur
- Tailwind CSS pour la mise en page réactive
- Prisma pour l'accès à la base de données
- NextAuth pour l'authentification
- Zod pour la validation des données

## License

Ce projet est sous la licence MIT. Consultez le fichier LICENSE pour plus d'informations.

Merci d'utiliser ce template ! Si vous avez des questions, n'hésitez pas à ouvrir une issue.
