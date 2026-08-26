# Pure Python, so no --platform pin: this builds natively on arm64 and amd64.
FROM python:3.12-slim

WORKDIR /ioc

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Channel Access: TCP for connections, UDP for name resolution and beacons.
# docker-compose.sim.yml deliberately does NOT publish these to the host -- the
# IOC is reachable only from inside the compose network.
EXPOSE 5064/tcp 5064/udp 5065/udp

CMD ["python", "-u", "bl531_ioc.py"]
