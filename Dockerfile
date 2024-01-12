# Verwenden Sie das offizielle Nginx-Image als Basis
FROM nginx:alpine

# Kopieren Sie Ihre Webseiten-Dateien in das Verzeichnis /usr/share/nginx/html
COPY . /usr/share/nginx/html

# Exponieren Sie den Port 80
EXPOSE 80
