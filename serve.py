"""
Cybersecurity Portfolio - High Performance Multi-Threaded Server Launcher
Run with: python serve.py
Automatically serves http://localhost:8080 in your default browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        sys.stdout.write(f"[CIPHER-NODE] {self.address_string()} - {format % args}\n")

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    httpd = ThreadedHTTPServer(("", PORT), Handler)
    url = f"http://localhost:{PORT}"
    print(f"\n=======================================================")
    print(f" [+] CIPHERBENZ COMMAND CENTER LIVE AT: {url}")
    print(f" [+] Operator: Athulyanath (@CipherBenz)")
    print(f" [+] Node: Chennai, IN")
    print(f" [+] Directory: {DIRECTORY}")
    print(f" [+] Multi-threaded HTTP Engine active.")
    print(f"=======================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[-] Shutting down node...")
        httpd.server_close()
