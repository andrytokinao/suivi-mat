#!/bin/bash

# SuiviMat - Script de démarrage complet
# Ce script démarre automatiquement le serveur Java et le frontend Angular

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   SuiviMat - Application                       ║"
echo "║              Material Tracking System with API                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier que le script est exécuté du répertoire racine
if [ ! -f "pom.xml" ]; then
    echo -e "${RED}❌ Erreur: pom.xml non trouvé${NC}"
    echo "Exécutez ce script depuis la racine du projet (où se trouve pom.xml)"
    exit 1
fi

echo -e "${BLUE}📦 Vérification des dépendances...${NC}"

# Vérifier Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java n'est pas installé${NC}"
    exit 1
fi
JAVA_VERSION=$(java -version 2>&1 | grep "version" | awk '{print $3}')
echo -e "${GREEN}✅ Java ${JAVA_VERSION} détecté${NC}"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION} détecté${NC}"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm ${NPM_VERSION} détecté${NC}"

echo ""
echo -e "${BLUE}📥 Installation des dépendances frontend...${NC}"

# Installer les dépendances frontend si nécessaire
if [ ! -d "frontend/node_modules" ]; then
    echo "Installation npm dans le répertoire frontend..."
    cd frontend
    npm install
    cd ..
else
    echo -e "${GREEN}✅ Dépendances frontend déjà installées${NC}"
fi

echo ""
echo -e "${YELLOW}🚀 Démarrage de l'application...${NC}"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Backend Java démarrera sur  : http://localhost:8080/api      ║"
echo "║  Frontend Angular démarrera  : http://localhost:4200           ║"
echo "║                                                                ║"
echo "║  Veuillez patienter quelques secondes...                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Démarrer le serveur Java en background
echo -e "${BLUE}▶ Démarrage du serveur Java...${NC}"
./mvnw spring-boot:run > /tmp/java-server.log 2>&1 &
JAVA_PID=$!

# Attendre que le serveur Java soit prêt (max 60 secondes)
echo "  Attente du démarrage du serveur Java..."
for i in {1..60}; do
    if curl -s http://localhost:8080/api/materials > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Serveur Java démarré avec succès (PID: $JAVA_PID)${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${RED}❌ Timeout: Le serveur Java n'a pas pu démarrer${NC}"
        echo "Vérifiez /tmp/java-server.log pour les détails"
        kill $JAVA_PID 2>/dev/null
        exit 1
    fi
    echo -n "."
    sleep 1
done

echo ""

# Démarrer le serveur Angular en background
echo -e "${BLUE}▶ Démarrage du serveur Angular...${NC}"
cd frontend
ng serve --open > /tmp/angular-server.log 2>&1 &
ANGULAR_PID=$!

# Attendre que Angular soit prêt
echo "  Attente du démarrage du serveur Angular (cela peut prendre 30 secondes)..."
for i in {1..120}; do
    if curl -s http://localhost:4200 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Serveur Angular démarré avec succès (PID: $ANGULAR_PID)${NC}"
        break
    fi
    if [ $i -eq 120 ]; then
        echo -e "${YELLOW}⚠  Angular en cours de démarrage, consultez les logs${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   ✅ APPLICATION DÉMARRÉE                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}🌐 L'application est accessible à:${NC} http://localhost:4200"
echo ""
echo "Logs:"
echo "  - Java Backend:    /tmp/java-server.log"
echo "  - Angular Frontend: /tmp/angular-server.log"
echo ""
echo "Pour arrêter l'application, appuyez sur Ctrl+C"
echo ""

# Garder le script actif
wait

# Cleanup si script arrêté
echo ""
echo -e "${YELLOW}🛑 Arrêt de l'application...${NC}"
kill $JAVA_PID 2>/dev/null
kill $ANGULAR_PID 2>/dev/null
echo -e "${GREEN}✅ Application arrêtée${NC}"
