import os, json, http.server, socketserver, threading, queue, time
from urllib.parse import urlparse

PORT = int(os.environ.get('PORT', 3456))
STATE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'state.json')

# ─── SSE broadcast ───────────────────────────────────────────────────────────
_clients = set()
_clients_lock = threading.Lock()

def broadcast(data):
    msg = f'data: {data}\n\n'.encode('utf-8')
    with _clients_lock:
        dead = set()
        for q in _clients:
            try:
                q.put_nowait(msg)
            except queue.Full:
                dead.add(q)
        _clients -= dead

# ─── Request handler ─────────────────────────────────────────────────────────
_SERVE_DIR = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=_SERVE_DIR, **kwargs)

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

        elif self.path == '/api/events':
            q = queue.Queue(maxsize=10)
            with _clients_lock:
                _clients.add(q)
            self.send_response(200)
            self.send_header('Content-type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self._cors()
            self.end_headers()
            try:
                while True:
                    try:
                        msg = q.get(timeout=25)
                        self.wfile.write(msg)
                        self.wfile.flush()
                    except queue.Empty:
                        # Send keepalive comment
                        self.wfile.write(b': keepalive\n\n')
                        self.wfile.flush()
            except Exception:
                pass
            finally:
                with _clients_lock:
                    _clients.discard(q)

        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/state':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            with open(STATE_FILE, 'wb') as f:
                f.write(body)
            broadcast(body.decode('utf-8'))
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

socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(('', PORT), Handler) as httpd:
    print(f'FelliFood running on http://localhost:{PORT}')
    httpd.serve_forever()
