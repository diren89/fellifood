import os, json, http.server, socketserver
from urllib.parse import urlparse

os.chdir('/Users/christian.fellenstein/Desktop/FelliFood')
PORT = 3456
STATE_FILE = 'state.json'

class Handler(http.server.SimpleHTTPRequestHandler):

    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/state':
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self._cors()
            self.end_headers()
            try:
                with open(STATE_FILE, 'rb') as f:
                    self.wfile.write(f.read())
            except FileNotFoundError:
                self.wfile.write(b'null')
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/state':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            with open(STATE_FILE, 'wb') as f:
                f.write(body)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self._cors()
            self.end_headers()
            self.wfile.write(b'{"ok":true}')
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, fmt, *args):
        pass  # suppress request logs

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', PORT), Handler) as httpd:
    print(f'FelliFood running on http://localhost:{PORT}')
    httpd.serve_forever()
