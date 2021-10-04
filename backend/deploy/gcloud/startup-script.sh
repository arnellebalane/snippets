set -v

# Install logging monitor. The monitor will automatically pick up logs sent to syslog.
curl -s "https://storage.googleapis.com/signals-agents/logging/google-fluentd-install.sh" | bash
service google-fluentd restart &

# Install dependencies from apt
apt-get update
apt-get install -yq ca-certificates git build-essential supervisor

# Install nodejs
mkdir /opt/nodejs
curl https://nodejs.org/dist/v14.18.0/node-v14.18.0-linux-x64.tar.gz | tar xvzf - -C /opt/nodejs --strip-components=1
ln -s /opt/nodejs/bin/node /usr/bin/node
ln -s /opt/nodejs/bin/npm /usr/bin/npm

# Get the application source code from the GitHub repository.
# git requires $HOME and it's not set during the startup script.
export HOME=/root
git clone https://github.com/arnellebalane/snippets /opt/app/snippets

# Install app dependencies
cd /opt/app/snippets/backend
npm ci

# Create a nodeapp user. The application will run as this user.
useradd -m -d /home/nodeapp nodeapp
chown -R nodeapp:nodeapp /opt/app

# Set environment variables based on Google Secrets Manager
export DATABASE_URL=$(gcloud secrets versions access latest --secret DATABASE_URL)
export SNIPPETS_CLIENT_URL=$(gcloud secrets versions access latest --secret SNIPPETS_CLIENT_URL)

# Create environment file that will be expanded inside the supervisor config
cat >/opt/app/snippets/.env << EOF
HOME="/home/nodeapp",USER="nodeapp",NODE_ENV="production",DATABASE_URL="$DATABASE_URL",SNIPPETS_CLIENT_URL="$SNIPPETS_CLIENT_URL"
EOF

# Create directory for storing application logs
mkdir /var/log/snippets

# Configure supervisor to run the node app.
cat >/etc/supervisor/conf.d/snippets.conf << EOF
[program:snippets]
directory=/opt/app/snippets/backend
command=npm start
autostart=true
autorestart=true
user=nodeapp
environment=$(cat /opt/app/snippets/.env)
stdout_logfile=/var/log/snippets/stdout.log
stderr_logfile=/var/log/snippets/stderr.log
EOF

supervisorctl reread
supervisorctl update

# Application should now be running under supervisor
