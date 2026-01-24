@echo off
REM SuiviMat - Script de démarrage complet (Windows)
REM Ce script démarre automatiquement le serveur Java et le frontend Angular

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                   SuiviMat - Application                       ║
echo ║              Material Tracking System with API                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Vérifier que le script est exécuté du répertoire racine
if not exist "pom.xml" (
    echo ❌ Erreur: pom.xml non trouvé
    echo Exécutez ce script depuis la racine du projet (où se trouve pom.xml)
    pause
    exit /b 1
)

echo 📦 Vérification des dépendances...
echo.

REM Vérifier Java
where java >nul 2>nul
if errorlevel 1 (
    echo ❌ Java n'est pas installé
    pause
    exit /b 1
)
for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| find "version"') do (
    echo ✅ Java %%g détecté
)

REM Vérifier Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé
    pause
    exit /b 1
)
for /f "tokens=*" %%g in ('node -v') do (
    echo ✅ Node.js %%g détecté
)

REM Vérifier npm
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm n'est pas installé
    pause
    exit /b 1
)
for /f "tokens=*" %%g in ('npm -v') do (
    echo ✅ npm %%g détecté
)

echo.
echo 📥 Vérification des dépendances frontend...
echo.

REM Installer les dépendances frontend si nécessaire
if not exist "frontend\node_modules" (
    echo Installation npm dans le répertoire frontend...
    cd frontend
    call npm install
    cd ..
) else (
    echo ✅ Dépendances frontend déjà installées
)

echo.
echo 🚀 Démarrage de l'application...
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  Backend Java démarrera sur  : http://localhost:8080/api      ║
echo ║  Frontend Angular démarrera  : http://localhost:4200           ║
echo ║                                                                ║
echo ║  Veuillez patienter quelques secondes...                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Démarrer le serveur Java
echo ▶ Démarrage du serveur Java...
start "SuiviMat - Java Backend" cmd /k "mvnw.cmd spring-boot:run"

REM Attendre 30 secondes pour que Java démarre
echo  Attente du démarrage du serveur Java...
timeout /t 30 /nobreak

REM Démarrer le serveur Angular
echo ▶ Démarrage du serveur Angular...
cd frontend
start "SuiviMat - Angular Frontend" cmd /k "ng serve --open"
cd ..

timeout /t 5 /nobreak

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                   ✅ APPLICATION DÉMARRÉE                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🌐 L'application est accessible à: http://localhost:4200
echo.
echo Deux fenêtres de commande ont été ouvertes:
echo   - SuiviMat - Java Backend    (port 8080)
echo   - SuiviMat - Angular Frontend (port 4200)
echo.
echo Pour arrêter l'application:
echo   - Fermez les deux fenêtres de commande
echo   - Ou appuyez sur Ctrl+C dans chaque fenêtre
echo.
pause
