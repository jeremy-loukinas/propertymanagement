import os, time
from rq import Queue
import redis
from app.utils.ical import parse_ical
from app.db import SessionLocal
from app import models

redis_url = os.getenv("REDIS_URL")
conn = redis.from_url(redis_url)
q = Queue("default", connection=conn)

if __name__ == "__main__":
    while True:
        with SessionLocal() as db:
            links = db.query(models.Integration).filter(models.Integration.type == "airbnb:ical").all()
            for link in links:
                q.enqueue("app.workers.tasks.sync_ical", link.id)
        time.sleep(1800)  # 30 minutes

def sync_ical(integration_id: int):
    with SessionLocal() as db:
        integ = db.get(models.Integration, integration_id)
        events = parse_ical(integ.config_json)
        for ev in events:
            existing = db.query(models.Booking).filter(models.Booking.external_id == ev.get("uid")).first()
            if existing:
                existing.start_date = ev.get("begin")
                existing.end_date = ev.get("end")
            else:
                unit_id = int(integ.label.split()[-1])
                b = models.Booking(
                    external_id=ev.get("uid"),
                    source="airbnb:ical",
                    unit_id=unit_id,
                    start_date=ev.get("begin"),
                    end_date=ev.get("end"),
                )
                db.add(b)
        db.commit()
